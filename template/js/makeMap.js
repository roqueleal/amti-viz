var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

var url =
  window.location != window.parent.location
    ? document.referrer
    : document.location.href;

var href = /lang=([^&]+)/.exec(url);
var lang = href ? href[1] : null;

id = 0;

function Map(container, options) {
  // constructor {
  this.id = id++;
  this.attribution = options.attribution;
  this.center = options.center;
  this.container = container;
  this.cluster = options.cluster;
  this.description = options.description;
  this.externalLinkText = options.externalLinkText;
  this.filters = [];
  this.footer = options.footer;
  this.group;
  this.instructions = options.instructions;
  this.json;
  this.apiKey = options.apiKey;
  this.logo = options.logo;
  this.map;
  this.mapboxStyle = options.mapboxStyle;
  this.popupContent = options.popupContent;
  this.popupHeaders = options.popupHeaders;
  this.program = options.program;
  this.slug = options.slug;
  this.table = options.table;
  this.title = options.title;
  this.translations = options.translations;
  this.widgets = options.widgets;
  this.zoom = options.zoom;

  Map.all = Map.all || [];

  Map.all.push(this);

  this.resetFilters = function() {
    this.filters = [];
  };

  this.removeGroups = function() {
    this.map.removeLayer(this.group);
  };

  this.render = function() {
    this.map = L.map(container, {
      center: this.center,
      zoom: this.zoom,
      scrollWheelZoom: window.innerWidth < 768 ? false : true,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer(
      `https://api.mapbox.com/styles/v1/ilabmedia/${
        this.mapboxStyle
      }/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaWxhYm1lZGlhIiwiYSI6ImNpbHYycXZ2bTAxajZ1c2tzdWU1b3gydnYifQ.AHxl8pPZsjsqoz95-604nw`,
      {}
    ).addTo(this.map);

    L.control.zoomslider().addTo(this.map);

    L.control
      .attribution({ position: "bottomleft" })
      .setPrefix(this.attribution)
      .addTo(this.map);

    this.resetFilters();
  };
}

function makeMap(
  container,
  spreadsheetID,
  mapboxStyle,
  popupHeaders = [],
  popupContent = []
) {
  var dataURL = "https://spreadsheets.google.com/feeds/list/";

  var translations;

  if (lang) {
    fetch(dataURL + spreadsheetID + "/" + 3 + "/public/values?alt=json")
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        var translations = parseLanguageData(json.feed.entry);

        init(
          dataURL,
          container,
          spreadsheetID,
          mapboxStyle,
          popupHeaders,
          popupContent,
          translations
        );
      })
      .catch(function(ex) {
        console.log("mm parsing failed", ex);
      });
  } else {
    init(
      dataURL,
      container,
      spreadsheetID,
      mapboxStyle,
      popupHeaders,
      popupContent,
      translations
    );
  }
}

function init(
  dataURL,
  container,
  spreadsheetID,
  mapboxStyle,
  popupHeaders,
  popupContent,
  translations
) {
  fetch(dataURL + spreadsheetID + "/" + 2 + "/public/values?alt=json")
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      var metaData = parseMetaData(json.feed.entry);

      var id = 0;
      var widgets = Object.keys(metaData)
        .filter(k => k.toLowerCase().indexOf("data") > -1)
        .map(k => {
          var widgetOptions = metaData[k].split(",").map(o => convertType(o));

          return {
            id: id++,
            map_id: this.id,
            type: widgetOptions[0],
            field: widgetOptions[1].replace(/ /g, "_"),
            instructions: widgetOptions[2],
            maxItems: widgetOptions[3],
            style: widgetOptions[4],
            legendReferenceSheetId: widgetOptions[5]
          };
        });

      var metaDataHeaders = metaData["popup headers"]
        .split(",")
        .map(i => i.trim())
        .filter(i => i);

      var metaDataContent = metaData["popup content"]
        .split(",")
        .map(i => i.trim())
        .filter(i => i);

      var options = {
        attribution: metaData.attribution,
        mapboxStyle,
        center: metaData.center.split(","),
        cluster: metaData.cluster,
        description: metaData.description,
        externalLinkText: metaData["external link text"],
        instructions: metaData.instructions,
        logo: metaData.logo,
        apiKey: metaData["api key"],
        popupContent: metaDataContent.length ? metaDataContent : popupContent,
        popupHeaders: metaDataHeaders.length ? metaDataHeaders : popupHeaders,
        program: metaData.program,
        slug: metaData.title.toLowerCase().replace(/ /g, "-"),
        table: metaData.table,
        title: metaData.title,
        translations: translations,
        widgets: widgets,
        zoom: metaData.zoom
      };

      var referenceSheets = widgets.filter(w => w.legendReferenceSheetId);
      Array.prototype.groupBy = function(prop) {
        return this.reduce(function(groups, item) {
          const val = item[prop];
          groups[val] = groups[val] || [];
          groups[val].push(item);
          return groups;
        }, {});
      };

      var newSectionHTML = ``;

      newSectionHTML += `<section id="${options.slug}">`;
      newSectionHTML += `<div id="${options.slug}__map" class="map"></div>`;
      newSectionHTML += `<aside class="toolbox">
          <input type="checkbox" checked class="ui mobile-only">
          <div class="hamburger mobile-only">
            <div class="icon">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="menu translate">

            </div>
          </div>
          <div class="box">
            <header  class="translate">
              <h1></h1>
              <a target="_blank" id="logo"></a>
              <p class="translate"></p>
            </header>
            <p class="translate">
            ${options.instructions}</p>
            <div id="controls">
            </div>
            <footer></footer>
          </div>
        </aside>`;

      newSectionHTML += `</section>`;

      document.title = metaData.title + " | CSIS " + metaData.program;
      document.body.innerHTML += newSectionHTML;
      document.querySelector(`#${options.slug} .menu`).innerText =
        metaData.title;
      document.querySelector(`#${options.slug} header h1`).innerText =
        metaData.title;
      document.querySelector(
        `#${options.slug} header a`
      ).style.backgroundImage =
        "url(" + metaData.logo + ")";
      document.querySelector(`#${options.slug} header a`).href =
        metaData.website;
      document.querySelector(`#${options.slug} header p`).innerText =
        metaData.description;

      if (translations) {
        var translatableNodes = Array.from(
          document.querySelectorAll(".translate")
        );

        translatableStrings = Object.keys(translations).sort(function(a, b) {
          return b.length - a.length;
        });

        translatableNodes.forEach(function(el, i) {
          translatableStrings.forEach(function(t) {
            if (Object.keys(translations[t]).length) {
              var re = new RegExp("\\b(" + RegExp.escape(t) + ")", "gi");

              el.innerHTML = el.innerHTML.replace(re, translations[t]);
            }
          });
        });
      }

      var container = document.querySelector(`#${options.slug} .map`);

      new Map(container, options).render();

      if (referenceSheets) {
        var boxContent = "";

        var referenceSheetURLS = widgets
          .map(w => {
            if (w.legendReferenceSheetId) {
              return (
                dataURL +
                spreadsheetID +
                "/" +
                w.legendReferenceSheetId +
                "/public/values?alt=json"
              );
            }
          })
          .filter(u => u);

        Promise.all(
          referenceSheetURLS.map(url => {
            return fetch(url);
          })
        )
          .then(responses => {
            return Promise.all(
              responses.map(response => {
                return response.json();
              })
            );
          })
          .then(jsons => {
            var dropdownOptions = [];

            widgets.forEach((w, x) => {
              var legendData = w.legendReferenceSheetId
                ? parseLegendData(jsons[x].feed.entry, w.style)
                : null;

              widgets[x].keys = legendData;

              var widgetTitle =
                widgets[x].field === "all"
                  ? "Search"
                  : widgets[x].field.replace(/_/g, " ");

              boxContent += `<section class="widget ${
                widgets[x].field
              }"><h3 class="translate">${widgetTitle}</h3>`;

              switch (widgets[x].type) {
                case "toggle":
                  boxContent += `<label for="toggle_${
                    widgets[x].field
                  }" class="translate">
                   <input type="radio" name="${widgets[x].field}" id="toggle_${
                    widgets[x].field
                  }"  value="1" checked>
                   Show
                   </label>`;

                  boxContent += `<label for="$toggle_{widgets[x].field}" class="translate">
                   <input type="radio" name="${widgets[x].field}" id="toggle_${
                    widgets[x].field
                  }" value="0" >
                   Hide
                   </label>`;
                  break;
                case "search":
                  boxContent += `<input type="text" id="search_${
                    widgets[x].field
                  }" placeholder="${widgets[x].instructions}" size="10" />`;

                  boxContent += `<button type="button" id="resetButton" class="translate">Reset</button>`;
                  break;
                case "dropdown":
                  var groups = widgets[x].keys.groupBy("group");
                  var choices = Object.keys(groups).map((g, z) => {
                    return {
                      id: z,
                      label: g,
                      disabled: false,
                      choices: groups[g]
                    };
                  });
                  boxContent += `<select id="dropdown_${
                    widgets[x].field
                  }" placeholder="${
                    widgets[x].instructions
                  }" multiple=""></select>`;

                  var dropdownOption = {
                    choices: choices,
                    removeItemButton: true,
                    maxItemCount: 6,
                    callbackOnCreateTemplates: function(template) {
                      var _this = this;

                      return {
                        item: function(classNames, data) {
                          var color = widgets[x].keys.find(function(v) {
                            return v.label === data.label;
                          }).color;

                          var svg =
                            "<svg  xmlns='http://www.w3.org/2000/svg'><circle cx='6' cy='6' r='5' stroke='" +
                            color +
                            "'  fill='" +
                            color +
                            "' /></svg>";

                          var remove =
                            '<svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg"><g fill="#000" fill-rule="evenodd"><path d="M2.592.044l18.364 18.364-2.548 2.548L.044 2.592z"/><path d="M0 18.364L18.364 0l2.548 2.548L2.548 20.912z"/></g></svg>';

                          var markup =
                            '<div style="border-color:' +
                            color +
                            '" class="' +
                            classNames.item +
                            '" data-item data-id="' +
                            data.id +
                            '" data-value="' +
                            data.value +
                            '" ' +
                            (data.active ? 'aria-selected="true"' : "") +
                            " " +
                            (data.disabled ? 'aria-disabled="true"' : "") +
                            '><span class="colorKey" ' +
                            "style=\"background-image: url('data:image/svg+xml;base64," +
                            window.btoa(svg) +
                            '")></span> ' +
                            data.label +
                            '<button style="border-left: 1px solid ' +
                            color +
                            "; background-image: url('data:image/svg+xml;base64," +
                            window.btoa(remove) +
                            '\')" type="button" class="choices__button" data-button="" aria-label="Remove item">Remove item</button></div>';
                          return template(markup);
                        },
                        choice: function(classNames, data) {
                          var color = widgets[x].keys.find(function(v) {
                            return v.label === data.label;
                          }).color;

                          var svg =
                            "<svg xmlns='http://www.w3.org/2000/svg'><circle cx='6' cy='6' r='5' stroke='" +
                            color +
                            "'  fill='" +
                            color +
                            "' /></svg>";

                          var markup =
                            ' <div class="' +
                            classNames.item +
                            " " +
                            classNames.itemChoice +
                            " " +
                            (data.disabled
                              ? classNames.itemDisabled
                              : classNames.itemSelectable) +
                            '" data-select-text="' +
                            _this.config.itemSelectText +
                            '" data-choice ' +
                            (data.disabled
                              ? 'data-choice-disabled aria-disabled="true"'
                              : "data-choice-selectable") +
                            ' data-id="' +
                            data.id +
                            '" data-value="' +
                            data.value +
                            '" ' +
                            (data.groupId > 0
                              ? 'role="treeitem"'
                              : 'role="option"') +
                            '> <span class="colorKey" ' +
                            "style=\"background-image: url('data:image/svg+xml;base64," +
                            window.btoa(svg) +
                            '")></span> ' +
                            data.label +
                            " </div> ";

                          return template(markup);
                        }
                      };
                    }
                  };
                  dropdownOptions.push(dropdownOption);
                  break;
                case "checkbox":
                  var weights = [];
                  var dashArrays = [];
                  var colors = [];
                  var forms = widgets[x].keys.map(f => f.value);
                  boxContent += "<ul>";

                  switch (widgets[x].style) {
                    case "form":
                      widgets[x].keys.forEach((key, i) => {
                        switch (key.form) {
                          case "line":
                            switch (i) {
                              case 0:
                                weights.push([3, 3]);
                                dashArrays.push(["6,9", "6,9"]);
                                colors.push([
                                  defaultColor.darker().hex(),
                                  defaultColor.darker().hex()
                                ]);
                                break;
                              case 1:
                                weights.push([5, 2]);
                                dashArrays.push([null, null]);
                                colors.push([
                                  defaultColor.darker().hex(),
                                  "#ffffff"
                                ]);
                                break;
                              case 2:
                                weights.push([4, 3.5]);
                                dashArrays.push([null, "6,12"]);
                                colors.push(["#000000", defaultColor.hex()]);
                                break;
                              case 3:
                                weights.push([7, 3]);
                                dashArrays.push([null, null]);
                                colors.push([
                                  "#ffffff",
                                  defaultColor.darker().hex()
                                ]);
                                break;
                              default:
                                weights.push([4, 4]);
                                dashArrays.push(["18,12", "18,12"]);
                                colors.push([
                                  defaultColor.darker().hex(),
                                  defaultColor.darker().hex()
                                ]);
                                break;
                            }

                            var svg =
                              "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 12'><line x1='0' x2='48' y1='50%' y2='50%' stroke='" +
                              colors[i][0] +
                              "' stroke-width='" +
                              weights[i][0] +
                              "' stroke-linecap='square' stroke-dasharray='" +
                              dashArrays[i][0] +
                              "'/><line x1='0' x2='48' y1='50%' y2='50%' stroke='" +
                              colors[i][1] +
                              "' stroke-width='" +
                              weights[i][1] +
                              "' stroke-linecap='square' stroke-dasharray='" +
                              dashArrays[i][1] +
                              "'/></svg>";

                            boxContent +=
                              '<li><label for="' +
                              key.value +
                              '"><input class="widget ' +
                              widgets[x].type +
                              '" type="checkbox" name="' +
                              key.value +
                              '" id="' +
                              key.value +
                              '" ' +
                              (key.selected ? "checked" : "") +
                              ' ><span class="lineKey" ' +
                              "style=\"background-image: url('data:image/svg+xml;base64," +
                              window.btoa(svg) +
                              '")></span>' +
                              key.label +
                              "</label></li>";

                            break;

                          case "shape":
                            switch (i) {
                              case 0:
                                svg =
                                  '<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rainbow" y1="4" x2="8" y2="4" gradientUnits="userSpaceOnUse" gradientTransform="translate(4 -4) rotate(135)"><stop offset="0" stop-color="#7f3c8d"/><stop offset="0.325" stop-color="#e73f74"/><stop offset="0.5" stop-color="#f2b701"/><stop offset="0.675" stop-color="#11a579"/><stop offset="1" stop-color="##3969ac"/></linearGradient></defs><rect x="4" y="2" width="8" height="8" transform="translate(4 -4) rotate(45)" fill="url(#rainbow)" paint-order="stroke" /></svg>';
                                break;
                              case 1:
                                svg =
                                  '<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rainbow" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3969ac"/><stop offset="0.25" stop-color="#11a579"/><stop offset="0.5" stop-color="#f2b701"/><stop offset="0.75" stop-color="#e73f74"/><stop offset="1" stop-color="#7f3c8d"/></linearGradient></defs><rect width="10" height="10" fill="url(#rainbow)"/></svg>';
                                break;
                              case 2:
                                svg =
                                  '<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rainbow" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3969ac"/><stop offset="0.325" stop-color="#11a579"/><stop offset="0.5" stop-color="#f2b701"/><stop offset="0.675" stop-color="#e73f74"/><stop offset="1" stop-color="#7f3c8d"/></linearGradient></defs><polygon points="6 10.39 0 10.39 3 5.2 6 0 9 5.2 12 10.39 6 10.39"  fill="url(#rainbow)" /></svg>';
                                break;
                              default:
                                svg =
                                  '<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rainbow" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3969ac"/><stop offset="0.25" stop-color="#11a579"/><stop offset="0.5" stop-color="#f2b701"/><stop offset="0.75" stop-color="#e73f74"/><stop offset="1" stop-color="#7f3c8d"/></linearGradient></defs><circle cx="6" cy="6" r="5" fill="url(#rainbow)"/></svg>';
                            }

                            boxContent +=
                              '<li><label for="' +
                              key.value +
                              '"><input class="widget ' +
                              widgets[x].type +
                              '" type="checkbox" name="' +
                              key.value +
                              '" id="' +
                              key.value +
                              '" ' +
                              (key.selected ? "checked" : "") +
                              ' ><span class="shapeKey" ' +
                              "style=\"background-image: url('data:image/svg+xml;base64," +
                              window.btoa(svg) +
                              '")></span>' +
                              key.label +
                              "</label></li>";

                            break;
                        }
                      });

                      break;

                    case "color":
                      colors = widgets[x].keys.forEach(k => {
                        svg = `<svg xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="6" r="5" fill="${
                          k.color
                        }"/></svg>`;
                        boxContent +=
                          '<li><label for="' +
                          k.value +
                          '"><input class="widget ' +
                          widgets[x].type +
                          '" type="checkbox" name="' +
                          k.value +
                          '" id="' +
                          k.value +
                          '" ' +
                          (k.selected ? "checked" : "") +
                          ' ><span class="shapeKey" ' +
                          "style=\"background-image: url('data:image/svg+xml;base64," +
                          window.btoa(svg) +
                          '")></span>' +
                          k.label +
                          "</label></li>";
                      });

                      break;
                  }
                  boxContent += "</ul>";

                  break;
              }

              var widget = widgets[x];
              boxContent += `</section>`;

              var box = document.querySelector(`#${options.slug} #controls`);

              box.innerHTML = boxContent;
            });

            widgets.forEach((w, x) => {
              var widget = widgets[x];

              var map = Map.all.find(m => m.id === widget.map_id);

              var element = document.querySelector(
                `#${options.slug} .widget.${widget.field}`
              );

              if (element.querySelector("select") && dropdownOptions[x]) {
                new Choices(
                  element.querySelector("select"),
                  dropdownOptions[x]
                );
              }

              if (element.querySelector("input[id^='search']")) {
                element
                  .querySelector("#resetButton")
                  .addEventListener("click", function(e) {
                    element.querySelector("input[type='text']").value = "";

                    if (map.group) map.removeGroups();
                    map.filters[x] = function() {
                      return true;
                    };
                    makeGroups(map);
                  });
              }

              var selects = Array.from(element.querySelectorAll("select"));
              var checks = Array.from(
                element.querySelectorAll("input[type='checkbox']")
              );

              var search = Array.from(
                element.querySelectorAll("input[type='text']")
              );

              var toggle = Array.from(
                element.querySelectorAll("input[type='radio']")
              );

              var inputs = selects
                .concat(checks)
                .concat(search)
                .concat(toggle);

              fetch(
                "https://csis.carto.com/api/v2/sql?api_key=" +
                  map.apiKey +
                  "&format=geojson&q=SELECT%20*%20FROM%20" +
                  map.table
              )
                .then(function(resp) {
                  return resp.json();
                })
                .then(function(json) {
                  map.json = json;

                  handleChange(map, element, widget, inputs);

                  function handleClick() {
                    inputs.forEach(input => {
                      input.addEventListener("change", () =>
                        handleChange(map, element, widget, inputs)
                      );
                    });
                  }

                  element.addEventListener("click", handleClick);
                });
            });
          });
      } else {
        var newSectionHTML = ``;

        newSectionHTML += `<section id="${options.slug}">`;
        newSectionHTML += `<div id="${options.slug}__map" class="map"></div>`;
        newSectionHTML += `<aside class="toolbox">
            <input type="checkbox" checked class="ui mobile-only">
            <div class="hamburger mobile-only">
              <div class="icon">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div class="menu translate">

              </div>
            </div>
            <div class="box">
              <header class="translate">
                <h1></h1>
                <a target="_blank" id="logo"></a>
                <p class="translate"></p>
              </header>
                <p class="translate">
                ${options.instructions}</p>
              <div id="controls">
              </div>
              <footer></footer>
            </div>
          </aside>`;

        newSectionHTML += `</section>`;

        document.title = metaData.title + " | CSIS " + metaData.program;
        document.body.innerHTML += newSectionHTML;
        document.querySelector(`#${options.slug} .menu`).innerText =
          metaData.title;
        document.querySelector(`#${options.slug} header h1`).innerText =
          metaData.title;
        document.querySelector(
          `#${options.slug} header a`
        ).style.backgroundImage =
          "url(" + metaData.logo + ")";
        document.querySelector(`#${options.slug} header a`).href =
          metaData.website;
        document.querySelector(`#${options.slug} header p`).innerText =
          metaData.description;

        var container = document.querySelector(`#${options.slug} .map`);
        new Map(container, options).render();
      }
    });
}

function handleChange(map, element, widget, inputs) {
  var selections = element.querySelector("select")
    ? Array.from(element.querySelector("select").options)
    : element.querySelector("input[type='text']")
      ? Array.from(element.querySelectorAll("input[type='text']"))
      : Array.from(element.querySelectorAll("input:checked"));

  var query = Array.from(selections).map(function(o) {
    return element.querySelector("input[type='checkbox']")
      ? o.name.toLowerCase()
      : o.value.toLowerCase();
  });

  map.filters[widget.id] =
    widget.type === "toggle"
      ? function(feature) {
          var bool = true;

          if (feature.properties.toggle) {
            bool = convertType(query[0]) ? true : false;
          } else {
            bool = true;
          }

          return bool;
        }
      : widget.field === "all"
        ? function(feature) {
            var bool = true;

            var withDiacritics = Object.values(feature.properties)
              .join("")
              .toLowerCase();

            var withoutDiacritics = Object.values(feature.properties)
              .join("")
              .toLowerCase()
              .latinise();

            if (
              withDiacritics.indexOf(query[0]) < 0 &&
              withoutDiacritics.indexOf(query[0]) < 0
            ) {
              bool = false;
            }

            return bool;
          }
        : function(feature, layers) {
            var bool = true;

            if (
              query.indexOf(feature.properties[widget.field].toLowerCase()) < 0
            ) {
              bool = false;
            }
            return bool;
          };

  if (map.group) map.removeGroups();

  // map.map.invalidateSize();
  makeGroups(map);

  inputs.forEach(oldInput => {
    newInput = oldInput.cloneNode(true);
    if (oldInput.parentNode) {
      // oldInput.parentNode.replaceChild(newInput, oldInput);
    }
  });
}

function convertType(value) {
  var v = Number(value);
  return !isNaN(v)
    ? v
    : value === "undefined"
      ? undefined
      : value === "null"
        ? null
        : value === "true" ? true : value === "false" ? false : value;
}

function parseLanguageData(data) {
  var languageData = {};

  data.forEach(function(row) {
    var key;
    Object.keys(row).forEach(function(column, i) {
      if (column.indexOf("gsx$") > -1) {
        var columnName = column.replace("gsx$", "");
        if (columnName === "en") {
          key = row[column]["$t"];
          languageData[key] = {};
        }

        // if (languageData[key]) {
        //   languageData[key][columnName] = row[column]["$t"];
        // }

        if (columnName === lang) {
          languageData[key] = row[column]["$t"];
        }
      }
    });
  });

  return languageData;
}

function parseLegendData(json, style) {
  var colorScale = createColorScale(json.length);
  var legendItems = [];
  json.forEach(function(row, x) {
    var data = {};
    Object.keys(row).forEach(function(column, y) {
      if (column.indexOf("gsx$") > -1) {
        var columnName = column.replace("gsx$", "");

        if (columnName === "label") {
          var key = row[column]["$t"].toLowerCase();
          data.key = key;
          data.label = row[Object.keys(row)[y + 0]]["$t"];
          data.value = row[Object.keys(row)[y + 1]]["$t"];
          data.group = convertType(row[Object.keys(row)[y + 2]]["$t"]);
          data.selected = convertType(row[Object.keys(row)[y + 3]]["$t"]);

          var colorVal = row[Object.keys(row)[y + 4]]["$t"];

          data.color = colorVal
            ? colorVal
            : style === "form" ? defaultColor : colorScale[x];

          data.form = row[Object.keys(row)[y + 5]]["$t"];

          legendItems.push(data);
        }
      }
    });
  });
  return legendItems;
}

function createColorScale(count, index) {
  var scaleOne = d3
    .scaleSequential(d3.interpolateRainbow)
    .domain(d3.range(0, count));

  var scaleTwo = d3
    .scaleSequential(d3.interpolateSpectral)
    .domain(d3.range(0, count));

  scale = [];

  for (var i = 0; i < count; i++) {
    var color =
      i % 2 === 0
        ? d3.color(scaleOne(Math.abs(count - i - 5) / count * 1))
        : d3.color(scaleTwo(i / count * 1));

    scale.push(color.hex());
  }

  return scale;
}

function parseMetaData(json) {
  var data = {};
  json.forEach(function(row, x) {
    Object.keys(row).forEach(function(column, y) {
      if (column.indexOf("gsx$") > -1) {
        var columnName = column.replace("gsx$", "");

        if (columnName === "property") {
          var key = row[column]["$t"].toLowerCase();
          data[key] = data[key] || {};
          data[key] = row[Object.keys(row)[y + 1]]["$t"];
        }
      }
    });
  });
  return data;
}

function makeGroups(map) {
  map.group = new L.MarkerClusterGroup({
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false,
    maxClusterRadius: map.cluster,
    iconCreateFunction: function iconCreateFunction(cluster) {
      return L.divIcon({
        className: "icon-group",
        html: '<span class="text">' + cluster.getChildCount() + "</span>"
      });
    }
  });

  var geoJsonOptions = {
    filter: function(feature) {
      map.filters.map(function(f) {
        return f(feature);
      });

      return map.filters
        .map(function(f) {
          return f(feature);
        })
        .every(f => f !== false);
    },
    pointToLayer: function pointToLayer(feature, latlng) {
      var CustomIcon = L.Icon.extend({
        options: {
          iconSize: [20, 20]
        }
      });

      var colorKey = map.widgets.find(w => w.style === "color");

      var color = colorKey.keys.find(
        k =>
          k.value.toLowerCase() ===
          feature.properties[colorKey.field].toLowerCase()
      ).color;

      var svg;

      switch (feature.properties.type.toLowerCase()) {
        case "low-tide elevation":
          svg =
            "<svg xmlns='http://www.w3.org/2000/svg'><polygon points='6 10.39 0 10.39 3 5.2 6 0 9 5.2 12 10.39 6 10.39' stroke=\"#ffffff\" fill='" +
            color +
            "' paint-order='stroke'></polygon></svg>";
          break;
        case "rock":
          svg =
            "<svg xmlns='http://www.w3.org/2000/svg'><rect width='10' height='10' stroke=\"#ffffff\" fill='" +
            color +
            "'></rect></svg>";
          break;
        case "submerged":
          svg =
            "<svg xmlns='http://www.w3.org/2000/svg'><rect x='4' y='2' width='9' height='9' transform='translate(6 -3) rotate(45)' stroke=\"#ffffff\" fill='" +
            color +
            "' paint-order='stroke'></rect></svg>";
          break;
        default:
          svg =
            "<svg xmlns='http://www.w3.org/2000/svg'><circle cx='6' cy='6' r='5' stroke=\"#ffffff\" fill='" +
            nations[nation].color +
            "' /></svg>";
      }

      var iconUrl = encodeURI("data:image/svg+xml;base64," + window.btoa(svg));

      var icon = new CustomIcon({ iconUrl: iconUrl });

      return L.marker(latlng, {
        icon: icon
      });
    },

    onEachFeature: function onEachFeature(feature, layer) {
      layer.on({
        click: function click(e) {
          var isSpiderfied = false;

          if (!layer._popupHandlersAdded) {
            Object.keys(map._layers).forEach(function(l, i) {
              if (map._layers[l].unspiderfy) map._layers[l].unspiderfy();
            });

            Object.values(map.group._featureGroup._layers).forEach(function(v) {
              if (v._group && v._group._spiderfied) isSpiderfied = true;
            });

            Array.from(
              document.querySelectorAll("div.leaflet-marker-icon")
            ).forEach(function(d) {
              return (d.style.opacity = isSpiderfied ? 0.2 : 1);
            });
            Array.from(
              document.querySelectorAll("img.leaflet-marker-icon")
            ).forEach(function(d) {
              return (d.style.opacity = isSpiderfied ? 0.2 : 1);
            });
          }
        }
      });

      var description;
      description = Object.keys(feature.properties)
        .map(function(p) {
          if (feature.properties[p]) {
            if (map.popupHeaders.length && map.popupContent.length) {
              return map.popupHeaders.indexOf(p) > -1 &&
                map.popupContent.indexOf(p) > -1
                ? '<div class="popupHeaderStyle">' +
                    p.toUpperCase().replace(/_/g, " ") +
                    '</div><div class="popupEntryStyle">' +
                    feature.properties[p] +
                    "</div>"
                : map.popupContent.indexOf(p) > -1
                  ? '<div class="popupEntryStyle">' +
                    feature.properties[p] +
                    "</div>"
                  : "";
            } else if (map.popupHeaders.length) {
              return map.popupHeaders.indexOf(p) > -1
                ? '<div class="popupHeaderStyle">' +
                    p.toUpperCase().replace(/_/g, " ") +
                    '</div><div class="popupEntryStyle">' +
                    feature.properties[p] +
                    "</div>"
                : "";
            } else {
              return (
                '<div class="popupHeaderStyle">' +
                p.toUpperCase().replace(/_/g, " ") +
                '</div><div class="popupEntryStyle">' +
                feature.properties[p] +
                "</div>"
              );
            }
          }
        })
        .filter(function(p) {
          return p;
        })
        .join("");

      var link = feature.properties.hyperlink || feature.properties.link;

      var externalLinkContent =
        link && link.trim()
          ? '<div class="separator"></div><div class="hyperlink popupEntryStyle"><a class="translate" href=' +
            link.trim() +
            ' target="_blank">' +
            map.externalLinkText +
            "</a>" +
            externalLink +
            "</div>"
          : "";

      description += externalLinkContent;

      if (lang) {
        translatableStrings = Object.keys(map.translations).sort(function(
          a,
          b
        ) {
          return b.length - a.length;
        });

        translatableStrings.forEach(function(t) {
          var re = new RegExp("\\b(" + RegExp.escape(t) + ")", "gi");

          description = description.replace(re, map.translations[t]);
        });
      }

      layer.bindPopup(description);
    }
  };

  var colorKey = map.widgets.find(w => w.style === "color");
  var formKey = map.widgets.find(w => w.style === "form");
  var weights = [];
  var dashArrays = [];
  var colors = [];
  var forms = [];

  if (formKey) {
    forms = formKey.keys.map(f => f.value);

    var key = formKey.keys.reduce((a, c) => c.form);

    switch (key) {
      case "line":
        forms.forEach((f, i) => {
          switch (i) {
            case 0:
              weights.push([3, 3]);
              dashArrays.push(["12,18", "12,18"]);
              colors.push([null, null]);
              break;
            case 1:
              weights.push([5, 2]);
              dashArrays.push([null, null]);
              colors.push([null, defaultColor.hex()]);
              break;
            case 2:
              weights.push([4, 3.5]);
              dashArrays.push([null, "6,12"]);
              colors.push(["#000000", null]);
              break;
            case 3:
              weights.push([7, 3]);
              dashArrays.push([null, null]);
              colors.push(["#ffffff", null]);
              break;
            default:
              weights.push([4, 4]);
              dashArrays.push([null, null]);
              colors.push([null, null]);
              break;
          }
        });

        var Background = function style(feature) {
          var color = colorKey.keys.find(
            k =>
              k.value.toLowerCase() ===
              feature.properties[colorKey.field].toLowerCase()
          ).color;

          var index = forms.indexOf(feature.properties[formKey.field]);
          if (index > -1)
            return {
              color: colors[index][0] ? colors[index][0] : color,
              weight: weights[index][0],
              lineCap: "square",
              dashArray: dashArrays[index] ? dashArrays[index][0] : null
            };
        };

        var Foreground = function style(feature) {
          var key = map.widgets.find(w => w.style === "color");
          var color = key.keys.find(
            k =>
              k.value.toLowerCase() ===
              feature.properties[key.field].toLowerCase()
          ).color;
          var index = forms.indexOf(feature.properties[formKey.field]);

          if (index > -1)
            return {
              color: colors[index][1] ? colors[index][1] : color,
              weight: weights[index][1],
              lineCap: "square",
              dashArray: dashArrays[index] ? dashArrays[index][1] : null
            };
        };

        var geoJsonA = L.geoJson(
          map.json,
          _extends({}, geoJsonOptions, {
            style: Background
          })
        );

        var geoJsonB = L.geoJson(
          map.json,
          _extends({}, geoJsonOptions, {
            style: Foreground
          })
        );

        map.group.addLayer(geoJsonA);

        map.group.addLayer(geoJsonB);
        break;
      default:
        map.json.features = map.json.features.sort((a, b) =>
          b.properties[colorKey.field].localeCompare(
            a.properties[colorKey.field]
          )
        );

        var geoJson = L.geoJson(map.json, _extends({}, geoJsonOptions, {}));

        map.group.addLayer(geoJson);
    }
  } else if (colorKey) {
    var Style = function style(feature) {
      var key = map.widgets.find(w => w.style === "color");

      var color = key.keys.find(
        k =>
          k.value.toLowerCase() === feature.properties[key.field].toLowerCase()
      ).color;

      if (feature.properties.toggle === "line") {
        return {
          color: d3
            .color(color)
            .brighter()
            .hex(),
          weight: 4
        };
      } else {
        return {
          fillColor: color,
          color: defaultColor,
          fillOpacity: 0.7,
          opacity: 0.5,
          weight: 2
        };
      }
    };

    map.json.features = map.json.features.sort((a, b) =>
      b.properties[colorKey.field].localeCompare(a.properties[colorKey.field])
    );

    var geoJson = L.geoJson(
      map.json,
      _extends({}, geoJsonOptions, { style: Style })
    );

    map.group.addLayer(geoJson);
  }

  map.map.addLayer(map.group);

  map.group.on("clusterclick", function(a) {
    map._layers[a.layer._leaflet_id].spiderfy();

    Object.keys(map._layers).forEach(function(layer, i) {
      if (parseInt(layer, 10) !== a.layer._leaflet_id) {
        if (map._layers[layer].unspiderfy) map._layers[layer].unspiderfy();
      }
    });

    var isSpiderfied = false;

    Object.values(map.group._featureGroup._layers).forEach(function(v) {
      if (v._group && v._group._spiderfied) isSpiderfied = true;
    });

    Array.from(document.querySelectorAll("div.leaflet-marker-icon")).forEach(
      function(d) {
        return (d.style.opacity = isSpiderfied ? 0.2 : 1);
      }
    );
    Array.from(document.querySelectorAll("img.leaflet-marker-icon")).forEach(
      function(d) {
        return (d.style.opacity = isSpiderfied ? 0.2 : 1);
      }
    );
    Object.values(map.group._featureGroup._layers).filter(function(v) {
      a.layer
        .getAllChildMarkers()
        .map(function(m) {
          return m.getElement();
        })
        .filter(function(m) {
          return m;
        })
        .forEach(function(m) {
          return (m.style.opacity = 1);
        });
    });
  });
}

RegExp.escape = function(s) {
  return s.replace(/[\/\\^$*+?.()|[\]{}]/g, "\\$&");
};

var externalLink =
  '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15">><path d="M7.49,0V1.67H1.68V13.32H13.32V7.52H15v5.72a1.76,1.76,0,0,1-.42,1.19,1.64,1.64,0,0,1-1.13.56H1.74a1.67,1.67,0,0,1-1.16-.41A1.61,1.61,0,0,1,0,13.48v-.27C0,9.4,0,5.6,0,1.8A1.83,1.83,0,0,1,.58.4a1.53,1.53,0,0,1,1-.39h6Z" transform="translate(0 0)"/><path d="M9.17,1.67V0H15V5.84H13.34v-3h0c-.05.05-.11.1-.16.16l-.45.46-1.3,1.29-.84.84-.89.9-.88.87-.89.9c-.28.29-.57.57-.86.86L6.16,10l-.88.87a1.83,1.83,0,0,1-.13.16L4,9.86l0,0L5.36,8.47l.95-1,.75-.75,1-1L8.87,5l1-.94.85-.86.92-.91.56-.58Z" transform="translate(0 0)"/></svg>';

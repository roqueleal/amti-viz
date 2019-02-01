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

id = 0;

function Map(container, options) {
  // constructor {
  this.id = id++;
  this.container = container;
  this.basemap = options.basemap;
  this.cluster = options.cluster;
  this.zoom = options.zoom;
  this.center = options.center;
  this.attribution = options.attribution;
  this.table = options.table;
  this.key = options.key;
  this.logo = options.logo;
  this.program = options.program;
  this.title = options.title;
  this.description = options.description;
  this.instruction = options.instruction;
  this.footer = options.footer;
  this.popupContent = options.popupContent;
  this.popupHeaders = options.popupHeaders;
  this.widgets = options.widgets;
  this.map;
  this.group;
  this.json;
  this.filters = [];

  Map.all = [];

  Map.all.push(this);

  this.resetFilters = function() {
    this.filters = [];
  };

  this.removeGroups = function() {
    this.map.removeLayer(this.group);
  };

  this.render = function() {
    var _this = this;

    this.map = L.map(container, {
      center: this.center,
      zoom: this.zoom,
      scrollWheelZoom: window.innerWidth < 768 ? false : true,
      zoomControl: false,
      layers: this.basemap,
      attributionControl: false
    });

    container.style.top = this.id * window.innerHeight;

    L.control.zoomslider().addTo(this.map);

    L.control
      .attribution({ position: "bottomleft" })
      .setPrefix(this.attribution)
      .addTo(this.map);

    this.resetFilters();

    fetch(
      "https://csis.carto.com/api/v2/sql?api_key=" +
        this.key +
        "&format=geojson&q=SELECT%20*%20FROM%20" +
        this.table
    )
      .then(function(resp) {
        return resp.json();
      })
      .then(function(json) {
        _this.json = json;

        return _this;
      });
  };
}

function makeMap(
  container,
  spreadsheetID,
  popupHeaders = [],
  popupContent = []
) {
  var dataURL = "https://spreadsheets.google.com/feeds/list/";

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
            field: widgetOptions[1],
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
        basemap,
        center: metaData.center.split(","),
        cluster: metaData.cluster,
        description: metaData.description,
        instruction: metaData.instruction,
        logo: metaData.logo,
        key: metaData.key,
        popupContent: metaDataContent.length ? metaDataContent : popupContent,
        popupHeaders: metaDataHeaders.length ? metaDataHeaders : popupHeaders,
        program: metaData.program,
        slug: metaData.title.toLowerCase().replace(/ /g, "-"),
        table: metaData.table,
        title: metaData.title,
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
              var legendData = parseLegendData(jsons[x].feed.entry, w.style);
              widgets[x].keys = legendData;

              boxContent += `<section class="widget ${
                widgets[x].type
              }"><h3 class="translate">${widgets[x].field}</h3>`;

              switch (widgets[x].type) {
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
                              widgets[x].keys[i].value +
                              '"><input class="widget ' +
                              widgets[x].type +
                              '" type="checkbox" name="' +
                              widgets[x].keys[i].value +
                              '" id="' +
                              widgets[x].keys[i].value +
                              '" ' +
                              (widgets[x].keys[i].selected ? "checked" : "") +
                              ' ><span class="lineKey" ' +
                              "style=\"background-image: url('data:image/svg+xml;base64," +
                              window.btoa(svg) +
                              '")></span>' +
                              widgets[x].keys[i].label +
                              "</label></li>";

                            break;

                          case "shape":
                            switch (key.form) {
                              case "triangle":
                                svg =
                                  '<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rainbow" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3969ac"/><stop offset="0.325" stop-color="#11a579"/><stop offset="0.5" stop-color="#f2b701"/><stop offset="0.675" stop-color="#e73f74"/><stop offset="1" stop-color="#7f3c8d"/></linearGradient></defs><polygon points="6 10.39 0 10.39 3 5.2 6 0 9 5.2 12 10.39 6 10.39"  fill="url(#rainbow)" /></svg>';
                                break;
                              case "square":
                                svg =
                                  '<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rainbow" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3969ac"/><stop offset="0.25" stop-color="#11a579"/><stop offset="0.5" stop-color="#f2b701"/><stop offset="0.75" stop-color="#e73f74"/><stop offset="1" stop-color="#7f3c8d"/></linearGradient></defs><rect width="10" height="10" fill="url(#rainbow)"/></svg>';
                                break;
                              case "diamond":
                                svg =
                                  '<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rainbow" y1="5" x2="9" y2="5" gradientUnits="userSpaceOnUse" gradientTransform="translate(6 -3) rotate(135)"><stop offset="0" stop-color="#7f3c8d"/><stop offset="0.325" stop-color="#e73f74"/><stop offset="0.5" stop-color="#f2b701"/><stop offset="0.675" stop-color="#11a579"/><stop offset="1" stop-color="##3969ac"/></linearGradient></defs><rect x="4" y="2" width="9" height="9" transform="translate(6 -3) rotate(45)" fill="url(#rainbow)" paint-order="stroke" /></svg>';
                                break;
                              default:
                                svg =
                                  '<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rainbow" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3969ac"/><stop offset="0.25" stop-color="#11a579"/><stop offset="0.5" stop-color="#f2b701"/><stop offset="0.75" stop-color="#e73f74"/><stop offset="1" stop-color="#7f3c8d"/></linearGradient></defs><circle cx="6" cy="6" r="5" fill="url(#rainbow)"/></svg>';
                            }

                            boxContent +=
                              '<li><label for="' +
                              widgets[x].keys[i].value +
                              '"><input class="widget ' +
                              widgets[x].type +
                              '" type="checkbox" name="' +
                              widgets[x].keys[i].value +
                              '" id="' +
                              widgets[x].keys[i].value +
                              '" ' +
                              (widgets[x].keys[i].selected ? "checked" : "") +
                              ' ><span class="shapeKey" ' +
                              "style=\"background-image: url('data:image/svg+xml;base64," +
                              window.btoa(svg) +
                              '")></span>' +
                              widgets[x].keys[i].label +
                              "</label></li>";

                            break;
                        }
                      });

                      break;

                    case "color":
                      colors = widgets[x].keys.forEach(f => {
                        svg = `<svg xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="6" r="5" fill="${f.color.hex()}"/></svg>`;
                        boxContent +=
                          '<li><label for="' +
                          widgets[x].keys[i].value +
                          '"><input class="widget ' +
                          widgets[x].type +
                          '" type="checkbox" name="' +
                          widgets[x].keys[i].value +
                          '" id="' +
                          widgets[x].keys[i].value +
                          '" ' +
                          (widgets[x].keys[i].selected ? "checked" : "") +
                          ' ><span class="shapeKey" ' +
                          "style=\"background-image: url('data:image/svg+xml;base64," +
                          window.btoa(svg) +
                          '")></span>' +
                          widgets[x].keys[i].label +
                          "</label></li>";
                      });

                      break;
                  }
                  boxContent += "</ul>";

                  break;
              }

              var widget = widgets[x];
              boxContent += `</section>`;

              var box = document.querySelector("#controls");
              box.innerHTML = boxContent;
            });

            widgets.forEach((w, x) => {
              var widget = widgets[x];
              var map = Map.all.find(m => m.id === widget.map_id);

              var element = document.querySelector(`.widget.${widget.type}`);

              if (element.querySelector("select") && dropdownOptions[x]) {
                new Choices(
                  element.querySelector("select"),
                  dropdownOptions[x]
                );
              }

              var selects = Array.from(element.querySelectorAll("select"));
              var checks = Array.from(
                element.querySelectorAll("input[type='checkbox']")
              );

              var inputs = selects.concat(checks);

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

        var newSectionHTML = "";
        newSectionHTML += `<section id="${options.slug}">`;
        newSectionHTML += `<div class="map"></div>`;
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
                <p  class="translate"></p>
              </header>
              <div id="controls">
              </div>
              <footer></footer>
            </div>
          </aside>`;

        newSectionHTML += `</section>`;

        document.title = metaData.title + " | CSIS " + metaData.program;
        document.body.innerHTML += newSectionHTML;
        document.querySelector(".menu").innerText = metaData.title;
        document.querySelector("header h1").innerText = metaData.title;
        document.querySelector("header a").style.backgroundImage =
          "url(" + metaData.logo + ")";
        document.querySelector("header a").href = metaData.website;
        document.querySelector("header p").innerText = metaData.description;

        var container = document.querySelector(`#${options.slug} .map`);

        var newMap = new Map(container, options).render();
      }
    });
}

function handleChange(map, element, widget, inputs) {
  var selections = element.querySelector("select")
    ? Array.from(element.querySelector("select").options)
    : Array.from(element.querySelectorAll("input:checked"));

  var names = Array.from(selections).map(function(o) {
    return element.querySelector("select") ? o.value : o.name;
  });

  map.filters[widget.id] = function(features, layers) {
    var bool = false;
    if (names.indexOf(features.properties[widget.field]) > -1) {
      bool = true;
    }
    return bool;
  };

  if (map.group) map.removeGroups();

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
        : value === "true"
          ? true
          : value === "false"
            ? false
            : value;
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
            : style === "form"
              ? defaultColor
              : colorScale[x];

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
        ? d3.color(scaleOne((Math.abs(count - i - 5) / count) * 1))
        : d3.color(scaleTwo((i / count) * 1));

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

      var color;
      var colorKey = widgets.find(w => w.style === "color");

      Object.keys(colorKey.keys).forEach(k => {
        switch (colorKey.keys[k]) {
          case "Territorial Baseline":
            return {
              color: "red",
              weight: 3,
              lineCap: "square",
              dashArray: "12,18",
              opacity: map.initialized === null ? 0 : 1
            };
            break;
          case "Territorial Baseline":
            return {
              color: "red",
              weight: 3,
              lineCap: "square",
              dashArray: "12,18",
              opacity: map.initialized === null ? 0 : 1
            };
            break;
        }
      });

      var svg =
        "<svg xmlns='http://www.w3.org/2000/svg'><circle cx='6' cy='6' r='5' stroke=\"#ffffff\"  fill='" +
        "red" +
        "' /></svg>";

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

      layer.bindPopup(description);
    }
  };

  var colorKey = map.widgets.find(w => w.style === "color");
  var weights = [];
  var dashArrays = [];
  var colors = [];
  var formKey = map.widgets.find(w => w.style === "form");
  var forms = formKey.keys.map(f => f.value);

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
      k => k.value === feature.properties[colorKey.field]
    ).color;

    var index = forms.indexOf(feature.properties.type);

    return {
      color: colors[index][0] ? colors[index][0] : color,
      weight: weights[index][0],
      lineCap: "square",
      dashArray: dashArrays[index] ? dashArrays[index][0] : null
    };
  };

  var Foreground = function style(feature) {
    var key = map.widgets.find(w => w.style === "color");
    var color = key.keys.find(k => k.value === feature.properties[key.field])
      .color;
    var index = forms.indexOf(feature.properties.type);

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

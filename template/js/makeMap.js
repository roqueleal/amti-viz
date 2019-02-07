"use strict";

var url =
  window.location != window.parent.location
    ? document.referrer
    : document.location.href;

var href = /lang=([^&]+)/.exec(url);
var lang = href ? href[1] : null;

var mapId = 0;

function Map(container, options) {
  // constructor {
  this.id = mapId++;
  this.attribution = options.attribution;
  this.center = options.center;
  this.container = container;
  this.cluster = options.cluster;
  this.description = options.description;
  this.externalLinkText = options.externalLinkText;
  this.filters = [];
  this.footer = options.footer;
  this.group;
  this.image = options.image;
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
      "https://api.mapbox.com/styles/v1/ilabmedia/" +
        this.mapboxStyle +
        "/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaWxhYm1lZGlhIiwiYSI6ImNpbHYycXZ2bTAxajZ1c2tzdWU1b3gydnYifQ.AHxl8pPZsjsqoz95-604nw",
      {}
    ).addTo(this.map);

    L.control.zoomslider().addTo(this.map);

    L.control
      .attribution({ position: "bottomleft" })
      .setPrefix(this.attribution)
      .addTo(this.map);

    this.resetFilters();
    return this;
  };
}

function makeMap(container, spreadsheetID, mapboxStyle) {
  var popupHeaders =
    arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var popupContent =
    arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

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
      var widgets = getWidgets(metaData);

      var metaDataHeaders = metaData["popup headers"]
        .split(",")
        .map(function(i) {
          return i.trim();
        })
        .filter(function(i) {
          return i;
        });

      var metaDataContent = metaData["popup content"]
        .split(",")
        .map(function(i) {
          return i.trim();
        })
        .filter(function(i) {
          return i;
        });

      var options = {
        attribution: metaData.attribution,
        mapboxStyle: mapboxStyle,
        center: metaData.center.split(","),
        cluster: metaData.cluster,
        description: metaData.description,
        externalLinkText: metaData["external link text"],
        image: metaData.image,
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

      makeNodes(options);

      var referenceSheets = widgets.filter(function(w) {
        return w.legendReferenceSheetId;
      });

      if (referenceSheets) {
        var boxContent = "";

        var referenceSheetURLS = widgets
          .map(function(w) {
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
          .filter(function(u) {
            return u;
          });

        Promise.all(
          referenceSheetURLS.map(function(url) {
            return fetch(url);
          })
        )
          .then(function(responses) {
            return Promise.all(
              responses.map(function(response) {
                return response.json();
              })
            );
          })
          .then(function(jsons) {
            makeWidgets(jsons, options, boxContent);
          });
      } else {
        console.log("else");
        makeWidgets(jsons, options, boxContent);
        var container = document.querySelector("#" + options.slug + " .map");
        new Map(container, options).render();
      }
    });
}

function getWidgets(metaData) {
  var widgetId = 0;
  var widgets = Object.keys(metaData)
    .filter(function(k) {
      return k.toLowerCase().indexOf("data") > -1;
    })
    .map(function(k) {
      var widgetOptions = metaData[k].split(",").map(function(o) {
        return convertType(o);
      });

      return {
        id: widgetId++,
        type: widgetOptions[0],
        field: widgetOptions[1].replace(/ /g, "_"),
        instructions: widgetOptions[2],
        maxItems: widgetOptions[3],
        style: widgetOptions[4],
        legendReferenceSheetId: widgetOptions[5]
      };
    });

  return widgets;
}

function makeNodes(options) {
  var newSectionHTML = "";

  newSectionHTML += '<section id="' + options.slug + '">';
  newSectionHTML += '<div id="' + options.slug + '__map" class="map"></div>';
  newSectionHTML +=
    '<aside class="toolbox"><input type="checkbox" checked class="ui mobile-only"><div class="hamburger mobile-only"><div class="icon"> <span></span> <span></span> <span></span></div><div class="menu translate"></div></div><div class="box"><header  class="translate"> <h1></h1> <a target="_blank" id="logo"></a> <p class="translate"></p></header>' +
    (options.instructions ? '<p class="translate"></p>' : "") +
    '<div id="controls"><div class="loader"></div></div><footer></footer></div></aside>';

  newSectionHTML += "</section>";
  document.body.innerHTML += newSectionHTML;

  document.title = options.title + " | CSIS " + options.program;

  var metaTitleOG = document.createElement("meta");
  metaTitleOG.setAttribute("property", "og:title");
  metaTitleOG.setAttribute(
    "content",
    options.title + " | CSIS " + options.program
  );
  document.head.appendChild(metaTitleOG);

  var metaTitleTwitter = document.createElement("meta");
  metaTitleTwitter.setAttribute("property", "twitter:title");
  metaTitleTwitter.setAttribute(
    "content",
    options.title + " | CSIS " + options.program
  );
  document.head.appendChild(metaTitleTwitter);

  var metaDescriptionOG = document.createElement("meta");
  metaDescriptionOG.setAttribute("property", "og:description");
  metaDescriptionOG.setAttribute("content", options.description);
  document.head.appendChild(metaDescriptionOG);

  var metaDescriptionTwitter = document.createElement("meta");
  metaDescriptionTwitter.setAttribute("property", "twitter:description");
  metaDescriptionTwitter.setAttribute("content", options.description);
  document.head.appendChild(metaDescriptionTwitter);

  var metaImageOG = document.createElement("meta");
  metaImageOG.setAttribute("property", "og:image");
  metaImageOG.setAttribute("content", options.image);
  document.head.appendChild(metaImageOG);

  var metaImageTwitter = document.createElement("meta");
  metaImageTwitter.setAttribute("property", "twitter:image");
  metaImageTwitter.setAttribute("content", options.image);
  document.head.appendChild(metaImageTwitter);

  document.querySelector("#" + options.slug + " .menu").innerText =
    options.title;
  document.querySelector("#" + options.slug + " header h1").innerText =
    options.title;
  document.querySelector(
    "#" + options.slug + " header a"
  ).style.backgroundImage =
    "url(" + options.logo + ")";
  document.querySelector("#" + options.slug + " header a").href =
    options.website;
  document.querySelector("#" + options.slug + " header p").innerText =
    options.description;

  if (options.translations) {
    var translatableNodes = Array.from(document.querySelectorAll(".translate"));

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
}

function makeWidgetContent(widgets, x) {
  var widgetNodes = "";
  var options;

  switch (widgets[x].type) {
    case "toggle":
      widgetNodes +=
        '<label for="toggle_' +
        widgets[x].field +
        '" class="translate"><input type="radio" name="' +
        widgets[x].field +
        '" id="toggle_' +
        widgets[x].field +
        '"  value="1" checked>Show</label>';

      widgetNodes +=
        '<label for="$toggle_{widgets[x].field}" class="translate"><input type="radio" name="' +
        widgets[x].field +
        '" id="toggle_' +
        widgets[x].field +
        '" value="0" >Hide</label>';
      break;
    case "search":
      widgetNodes +=
        '<input type="text" id="search_' +
        widgets[x].field +
        '" placeholder="' +
        widgets[x].instructions +
        '" size="10" />';

      widgetNodes +=
        '<button type="button" id="resetButton" class="translate">Reset</button>';
      break;
    case "dropdown":
      widgetNodes +=
        '<select id="dropdown_' +
        widgets[x].field +
        '" placeholder="' +
        widgets[x].instructions +
        '" multiple=""></select>';

      options = makeDropdownOptions(widgets, x);
      break;
    case "checkbox":
      widgetNodes += "<ul>";

      var keyStyle;

      widgets[x].keys.forEach(function(key, i) {
        switch (widgets[x].style) {
          case "form":
            var forms = widgets[x].keys.map(function(f) {
              return f.value;
            });
            keyStyle = styleFormKey(key, i, forms);
            break;

          case "color":
            keyStyle = styleColorKey(key);
            break;
        }

        widgetNodes +=
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
          ' ><span class="' +
          keyStyle.class +
          'Key" ' +
          "style=\"background-image: url('data:image/svg+xml;base64," +
          window.btoa(keyStyle.svg) +
          '")></span>' +
          key.label +
          "</label></li>";
      });

      widgetNodes += "</ul>";

      break;
  }

  var widgetTitle =
    widgets[x].field === "all" ? "Search" : widgets[x].field.replace(/_/g, " ");

  return { nodes: widgetNodes, title: widgetTitle, options: options };
}

function makeWidgets(jsons, options, boxContent) {
  var widgetContent = [];

  options.widgets.forEach(function(w, x) {
    var legendData = w.legendReferenceSheetId
      ? parseLegendData(jsons[x].feed.entry, w.style)
      : null;

    options.widgets[x].keys = legendData;

    widgetContent.push(makeWidgetContent(options.widgets, x));

    boxContent +=
      '<section class="widget ' +
      options.widgets[x].field +
      '"><h3 class="translate">' +
      widgetContent[x].title +
      "</h3>";

    boxContent += widgetContent[x].nodes;

    boxContent += "</section>";

    var box = document.querySelector("#" + options.slug + " #controls");

    box.innerHTML = boxContent;
  });

  var container = document.querySelector("#" + options.slug + " .map");
  var map = new Map(container, options).render();

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

      options.widgets.forEach(function(w, x) {
        var element = document.querySelector(
          "#" + options.slug + " .widget." + options.widgets[x].field
        );

        if (element.querySelector("select") && widgetContent[x].options) {
          new Choices(
            element.querySelector("select"),
            widgetContent[x].options
          );
        }

        if (element.querySelector("input[id^='search']")) {
          element
            .querySelector("#resetButton")
            .addEventListener("click", function() {
              handleReset(element, map, x);
            });
        }

        var selects = Array.from(element.querySelectorAll("select"));
        var checks = Array.from(
          element.querySelectorAll("input[type='checkbox']")
        );

        var search = Array.from(element.querySelectorAll("input[type='text']"));

        var toggle = Array.from(
          element.querySelectorAll("input[type='radio']")
        );

        var inputs = selects
          .concat(checks)
          .concat(search)
          .concat(toggle);

        inputs.forEach(function(input) {
          if (input.type === "text") {
            input.addEventListener("keyup", function() {
              handleChange(map, element, options.widgets[x]);
            });
          } else {
            input.addEventListener("change", function() {
              handleChange(map, element, options.widgets[x]);
            });
          }

          if ("createEvent" in document) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            input.dispatchEvent(evt);
          } else {
            input.fireEvent("onchange");
          }

          w.map_id = map.id;
        });
      });
    });
}

function handleReset(element, map, x) {
  element.querySelector("input[type='text']").value = "";

  if (map.group) map.removeGroups();

  map.filters[x] = function() {
    return true;
  };

  makeGroups(map);
}

function handleChange(map, element, widget) {
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

  map.map.invalidateSize();
  makeGroups(map);
}

function makeDropdownOptions(widgets, x) {
  var groups = widgets[x].keys.groupBy("group");
  var choices = Object.keys(groups).map(function(g, z) {
    return {
      id: z,
      label: g,
      disabled: false,
      choices: groups[g]
    };
  });

  return {
    choices: choices,
    removeItemButton: true,
    maxItemCount: 6,
    callbackOnCreateTemplates: function callbackOnCreateTemplates(template) {
      var _this = this;

      return {
        item: function item(classNames, data) {
          var key = widgets[x].keys.find(function(v) {
            return v.label === data.label;
          });

          var keyStyle;
          switch (widgets[x].style) {
            case "form":
              var forms = widgets[x].keys.map(function(k) {
                return k.value.toLowerCase();
              });
              keyStyle = styleFormKey(key, i, forms);
              break;

            case "color":
              keyStyle = styleColorKey(key);
              break;
          }

          var markup =
            '<div style="border-color:' +
            key.color +
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
            '><span class="' +
            keyStyle.class +
            'Key" ' +
            "style=\"background-image: url('data:image/svg+xml;base64," +
            window.btoa(keyStyle.svg) +
            '")></span> ' +
            data.label +
            '<button style="border-left: 1px solid ' +
            key.color +
            "; background-image: url('data:image/svg+xml;base64," +
            window.btoa(remove) +
            '\')" type="button" class="choices__button" data-button="" aria-label="Remove item">Remove item</button></div>';
          return template(markup);
        },
        choice: function choice(classNames, data) {
          var key = widgets[x].keys.find(function(v) {
            return v.label === data.label;
          });

          var keyStyle;
          switch (widgets[x].style) {
            case "form":
              var forms = widgets[x].keys.map(function(k) {
                return k.value.toLowerCase();
              });

              keyStyle = styleFormKey(key, i, forms);
              break;

            case "color":
              keyStyle = styleColorKey(key);
              break;
          }

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
            (data.groupId > 0 ? 'role="treeitem"' : 'role="option"') +
            '> <span class="' +
            keyStyle.class +
            'Key" ' +
            "style=\"background-image: url('data:image/svg+xml;base64," +
            window.btoa(keyStyle.svg) +
            '")></span> ' +
            data.label +
            " </div> ";

          return template(markup);
        }
      };
    }
  };
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

function pointToLayer(feature, latlng, map, colorKey, formKey) {
  var CustomIcon = L.Icon.extend({
    options: {
      iconSize: [20, 20]
    }
  });

  var pointStyle;

  if (formKey) {
    var forms = formKey.keys.map(function(k) {
      return k.value.toLowerCase();
    });

    var i = forms.indexOf(feature.properties[formKey.field].toLowerCase());

    var key = formKey.keys.find(function(k) {
      return (
        k.value.toLowerCase() ===
        feature.properties[formKey.field].toLowerCase()
      );
    });

    var color = colorKey.keys.find(function(k) {
      return (
        k.value.toLowerCase() ===
        feature.properties[colorKey.field].toLowerCase()
      );
    }).color;

    pointStyle = styleFormKey(key, i, forms, color);
  } else if (colorKey) {
    pointStyle = styleColorKey(key);
  }

  var iconUrl = encodeURI(
    "data:image/svg+xml;base64," + window.btoa(pointStyle.svg)
  );

  var icon = new CustomIcon({ iconUrl: iconUrl });

  return L.marker(latlng, {
    icon: icon
  });
}

function makeGeoJsonOptions(map, colorKey, formKey) {
  return {
    filter: function(feature) {
      return map.filters
        .map(function(f) {
          return f(feature);
        })
        .every(function(f) {
          return f !== false;
        });
    },
    pointToLayer: function(feature, latlng) {
      return pointToLayer(feature, latlng, map, colorKey, formKey);
    },
    onEachFeature: function(feature, layer) {
      handleFeatureClick(feature, layer, map);
    }
  };
}

function makeGroups(map) {
  var colorKey = map.widgets.find(function(w) {
    return w.style === "color";
  });
  var formKey = map.widgets.find(function(w) {
    return w.style === "form";
  });

  var geoJsonOptions = makeGeoJsonOptions(map, colorKey, formKey);

  map.group = new L.MarkerClusterGroup({
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false,
    maxClusterRadius: map.cluster,
    iconCreateFunction: function(cluster) {
      return L.divIcon({
        className: "icon-group",
        html:
          '<span class="text" style="border: 1px solid #000000; color: #000000">' +
          cluster.getChildCount() +
          "</span>"
      });
    }
  });

  if (formKey) {
    var colors = [];
    var forms = [];

    forms = formKey.keys.map(function(f) {
      return f.value;
    });

    var key = formKey.keys.reduce(function(a, c) {
      return c.form;
    });

    switch (key) {
      case "line":
        forms.forEach(function(f, i) {
          switch (i) {
            case 0:
              colors.push([null, null]);
              break;
            case 1:
              colors.push([null, defaultColor]);
              break;
            case 2:
              colors.push(["#000000", null]);
              break;
            case 3:
              colors.push(["#ffffff", null]);
              break;
            default:
              colors.push([null, null]);
              break;
          }
        });

        var Background = function Background(feature) {
          return styleFormFeature(
            feature,
            map,
            formKey.field,
            colors,
            forms,
            0
          );
        };

        var geoJsonA = L.geoJson(
          map.json,
          _extends({}, geoJsonOptions, {
            style: Background
          })
        );

        map.group.addLayer(geoJsonA);

        var Foreground = function Foreground(feature) {
          return styleFormFeature(
            feature,
            map,
            formKey.field,
            colors,
            forms,
            1
          );
        };

        var geoJsonB = L.geoJson(
          map.json,
          _extends({}, geoJsonOptions, {
            style: Foreground
          })
        );

        map.group.addLayer(geoJsonB);

        break;
      default:
        map.json.features = map.json.features.sort(function(a, b) {
          return b.properties[colorKey.field].localeCompare(
            a.properties[colorKey.field]
          );
        });

        var geoJson = L.geoJson(map.json, _extends({}, geoJsonOptions, {}));

        map.group.addLayer(geoJson);
    }
  } else if (colorKey) {
    var Style = function Style(feature) {
      return styleColorFeature(feature, map, colorKey.field, colors, forms);
    };

    map.json.features = map.json.features.sort(function(a, b) {
      return b.properties[colorKey.field].localeCompare(
        a.properties[colorKey.field]
      );
    });

    var geoJson = L.geoJson(
      map.json,
      _extends({}, geoJsonOptions, { style: Style })
    );

    map.group.addLayer(geoJson);
  }

  map.map.addLayer(map.group);

  map.group.on("clusterclick", function(e) {
    handleClusterClick(e, map);
  });
}

function handleFeatureClick(feature, layer, map) {
  layer.on({
    click: function() {
      handleLayerClick(feature, layer, map);
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
    translatableStrings = Object.keys(map.translations).sort(function(a, b) {
      return b.length - a.length;
    });

    translatableStrings.forEach(function(t) {
      var re = new RegExp("\\b(" + RegExp.escape(t) + ")", "gi");

      description = description.replace(re, map.translations[t]);
    });
  }

  layer.bindPopup(description);
}

function handleLayerClick(feature, layer, map) {
  var isSpiderfied = false;

  if (!layer._popupHandlersAdded) {
    Object.keys(map.map._layers).forEach(function(l, i) {
      if (map.map._layers[l].unspiderfy) map.map._layers[l].unspiderfy();
    });

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
  }
}

function handleClusterClick(e, map) {
  map.map._layers[e.layer._leaflet_id].spiderfy();

  Object.keys(map.map._layers).forEach(function(layer, i) {
    console.log(layer);

    if (parseInt(layer, 10) !== e.layer._leaflet_id) {
      if (map.map._layers[layer].unspiderfy)
        map.map._layers[layer].unspiderfy();
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
    e.layer
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
}

function styleFormFeature(feature, map, field, colors, forms, index) {
  var colorKey = map.widgets.find(function(w) {
    return w.style === "color";
  });

  var key = colorKey.keys.find(function(k) {
    return (
      k.value.toLowerCase() === feature.properties[colorKey.field].toLowerCase()
    );
  });

  var i = forms.indexOf(feature.properties[field]);

  if (i > -1)
    return {
      color: colors[i][index] ? colors[i][index] : key.color,
      weight: lineWeights[i][index],
      lineCap: "square",
      dashArray: lineDashArrays[i] ? lineDashArrays[i][index] : null
    };
}

function styleColorFeature(feature, map, field, colors, forms, index) {
  var colorKey = map.widgets.find(function(w) {
    return w.style === "color";
  });

  var key = colorKey.keys.find(function(k) {
    return (
      k.value.toLowerCase() === feature.properties[colorKey.field].toLowerCase()
    );
  });

  if (feature.properties.toggle === "line") {
    return {
      color: chroma(key.color)
        .brighten()
        .hex(),
      weight: 4
    };
  } else {
    return {
      fillColor: key.color,
      color: defaultColor,
      fillOpacity: 0.7,
      opacity: 0.5,
      weight: 2
    };
  }
}

function styleColorKey(key) {
  var svg =
    '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="6" r="5" fill="' +
    key.color +
    '"/></svg>';

  return { svg: svg, class: "color" };
}

function styleFormKey(key, i, forms, color) {
  var dashArray;
  var colors;

  switch (key.form) {
    case "line":
      var svg;
      switch (i) {
        case 0:
          colors = [
            color ? color : chroma(defaultColor).darken(),
            color ? color : chroma(defaultColor).darken()
          ];
          break;
        case 1:
          colors = [color ? color : chroma(defaultColor).darken(), "#ffffff"];
          break;
        case 2:
          colors = ["#000000", color ? color : defaultColor];
          break;
        case 3:
          colors = ["#ffffff", color ? color : chroma(defaultColor).darken()];
          break;
        default:
          colors = [
            color ? color : chroma(defaultColor).darken(),
            color ? color : chroma(defaultColor).darken()
          ];
          break;
      }

      svg =
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 12'><line x1='0' x2='48' y1='50%' y2='50%' stroke='" +
        colors[0] +
        "' stroke-width='" +
        lineWeights[i][0] +
        "' stroke-linecap='square' stroke-dasharray='" +
        (i === 4 ? "18,12" : lineDashArrays[i][0]) +
        "'/><line x1='0' x2='48' y1='50%' y2='50%' stroke='" +
        colors[1] +
        "' stroke-width='" +
        lineWeights[i][1] +
        "' stroke-linecap='square' stroke-dasharray='" +
        (i === 4 ? "18,12" : lineDashArrays[i][0]) +
        "'/></svg>";

      return { svg: svg, class: "line" };

    case "shape":
      var svg;
      switch (i) {
        case 0:
          svg =
            '<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rainbow"  y1="4.5" x2="9" y2="4.5" gradientUnits="userSpaceOnUse" gradientTransform="translate(4.5 -4.5) rotate(135)"><stop offset="0" stop-color="#7f3c8d"/><stop offset="0.325" stop-color="#e73f74"/><stop offset="0.5" stop-color="#f2b701"/><stop offset="0.675" stop-color="#11a579"/><stop offset="1" stop-color="#3969ac"/></linearGradient></defs><rect x="3.25" y="1.75" width="9" height="9" transform="translate(4.5 -4.5) rotate(45)" ' +
            (color ? 'paint-order="stroke" stroke="#ffffff"' : "") +
            ' fill="' +
            (color ? color : "url(#rainbow)") +
            '" /></svg>';
          break;
        case 1:
          svg =
            '<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rainbow" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3969ac"/><stop offset="0.25" stop-color="#11a579"/><stop offset="0.5" stop-color="#f2b701"/><stop offset="0.75" stop-color="#e73f74"/><stop offset="1" stop-color="#7f3c8d"/></linearGradient></defs><rect width="10" height="10" ' +
            (color ? 'stroke="#ffffff"' : "") +
            ' fill="' +
            (color ? color : "url(#rainbow)") +
            '"/></svg>';
          break;
        case 2:
          svg =
            '<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rainbow" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3969ac"/><stop offset="0.325" stop-color="#11a579"/><stop offset="0.5" stop-color="#f2b701"/><stop offset="0.675" stop-color="#e73f74"/><stop offset="1" stop-color="#7f3c8d"/></linearGradient></defs><polygon points="6 10.39 0 10.39 3 5.2 6 0 9 5.2 12 10.39 6 10.39" ' +
            (color ? 'paint-order="stroke" stroke="#ffffff"' : "") +
            ' fill="' +
            (color ? color : "url(#rainbow)") +
            '" /></svg>';
          break;
        default:
          svg =
            '<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rainbow" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3969ac"/><stop offset="0.25" stop-color="#11a579"/><stop offset="0.5" stop-color="#f2b701"/><stop offset="0.75" stop-color="#e73f74"/><stop offset="1" stop-color="#7f3c8d"/></linearGradient></defs><circle cx="6" cy="6" r="5" ' +
            (color ? 'stroke="#ffffff"' : "") +
            ' fill="' +
            (color ? color : "url(#rainbow)") +
            '"/></svg>';
      }

      return { svg: svg, class: "shape" };
  }
}

function createColorScale(count, index) {
  var scaleOne = chroma
    .cubehelix()
    .hue(0.5)
    .lightness([0.4, 0.6])
    .scale()
    .colors(count * 2);

  var scaleTwo = chroma
    .cubehelix()
    .hue(1)
    .gamma(0.5)
    .scale()
    .colors(count * 2)
    .reverse();

  var scale = [];

  for (var i = 0; i < count; i++) {
    var color = i % 2 === 0 ? scaleOne[i * 2] : scaleTwo[i * 2];
    color = chroma(color)
      .saturate()
      .hex();

    scale.push(color);
  }

  return scale;
}

var lineWeights = [[3, 3], [5, 2], [4, 3.5], [7, 3], [4, 4]];

var lineDashArrays = [
  ["6,9", "6,9"],
  [null, null],
  [null, "6,12"],
  [null, null],
  [null, null]
];

var externalLink =
  '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15">><path d="M7.49,0V1.67H1.68V13.32H13.32V7.52H15v5.72a1.76,1.76,0,0,1-.42,1.19,1.64,1.64,0,0,1-1.13.56H1.74a1.67,1.67,0,0,1-1.16-.41A1.61,1.61,0,0,1,0,13.48v-.27C0,9.4,0,5.6,0,1.8A1.83,1.83,0,0,1,.58.4a1.53,1.53,0,0,1,1-.39h6Z" transform="translate(0 0)"/><path d="M9.17,1.67V0H15V5.84H13.34v-3h0c-.05.05-.11.1-.16.16l-.45.46-1.3,1.29-.84.84-.89.9-.88.87-.89.9c-.28.29-.57.57-.86.86L6.16,10l-.88.87a1.83,1.83,0,0,1-.13.16L4,9.86l0,0L5.36,8.47l.95-1,.75-.75,1-1L8.87,5l1-.94.85-.86.92-.91.56-.58Z" transform="translate(0 0)"/></svg>';

var remove =
  '<svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg"><g fill="#000" fill-rule="evenodd"><path d="M2.592.044l18.364 18.364-2.548 2.548L.044 2.592z"/><path d="M0 18.364L18.364 0l2.548 2.548L2.548 20.912z"/></g></svg>';

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

Array.prototype.groupBy = function(prop) {
  return this.reduce(function(groups, item) {
    var val = item[prop];
    groups[val] = groups[val] || [];
    groups[val].push(item);
    return groups;
  }, {});
};

RegExp.escape = function(s) {
  return s.replace(/[\/\\^$*+?.()|[\]{}]/g, "\\$&");
};

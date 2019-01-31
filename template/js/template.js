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
  this.widgets = options.widgets;
  this.map;
  this.group;
  this.json;
  this.initialized;
  this.filters = [];

  Map.all = [];

  Map.all.push(this);

  this.resetFilters = function() {
    this.filters = [];
  };

  this.removeGroups = function() {
    this.map.removeLayer(this.group);
  };

  this.remakeGroups = function() {
    // makeGroups(nation, this.json, filters);
    //
    // var icons = document.querySelectorAll(
    //   ".icon-group:not(.marker-cluster-small)"
    // );
    // Array.from(icons).forEach(function(icon) {
    //   icon.style.color = nations[nation].color;
    //   icon.style.borderColor = nations[nation].color;
    //   icon.style.borderWidth = 1;
    //   icon.style.borderStyle = "solid";
    // });
    //
  };

  this.render = function() {
    var _this = this;

    this.map = L.map(this.container, {
      center: this.center,
      zoom: this.zoom,
      scrollWheelZoom: window.innerWidth < 768 ? false : true,
      zoomControl: false,
      layers: this.basemap,
      attributionControl: false
    });

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
        // makeGroups(_this);

        if (true) {
          _this.initialized = _this.initialized === null ? true : false;
        }

        if (_this.initialized) {
          // search();
          //
          // select.addEventListener("highlightItem", function(e) {
          //   searchBox.removeHighlightedItems();
          // });
          //
          // select.addEventListener("removeItem", search);
          // select.addEventListener("addItem", search);
          //
          // document.querySelector(".choices__input").focus();

          _this.initialized = false;
        }
        return _this;
      });
  };
}

var defaultColor = d3.color("#cad2d3");
var url =
  window.location != window.parent.location
    ? document.referrer
    : document.location.href;

var href = /lang=([^&]+)/.exec(url);
var lang = href ? href[1] : null;

var basemap =
  lang && lang.indexOf("zh-") > -1
    ? (basemap = [
        L.tileLayer(
          "https://api.mapbox.com/styles/v1/ilabmedia/citui3waw00162jo1zcsf1urj/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaWxhYm1lZGlhIiwiYSI6ImNpbHYycXZ2bTAxajZ1c2tzdWU1b3gydnYifQ.AHxl8pPZsjsqoz95-604nw",
          {}
        )
      ])
    : (basemap = [
        L.tileLayer(
          "https://api.mapbox.com/styles/v1/ilabmedia/cj84s9bet10f52ro2lrna50yg/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaWxhYm1lZGlhIiwiYSI6ImNpbHYycXZ2bTAxajZ1c2tzdWU1b3gydnYifQ.AHxl8pPZsjsqoz95-604nw",
          {}
        )
      ]);

var spreadsheetID = "14MvucMac-lYCu0-2vD5tcxfCUqIJog2h4-REFkpH3Kw";

var dataURL = "https://spreadsheets.google.com/feeds/list/";

fetch(dataURL + spreadsheetID + "/" + 2 + "/public/values?alt=json")
  .then(function(response) {
    return response.json();
  })
  .then(function(json) {
    var metaData = parseMetaData(json.feed.entry);
    document.title = metaData.title + " | CSIS " + metaData.program;
    document.querySelector(".menu").innerText = metaData.title;
    document.querySelector("header h1").innerText = metaData.title;
    document.querySelector("header a").style.backgroundImage =
      "url(" + metaData.logo + ")";
    document.querySelector("header a").href = metaData.website;
    document.querySelector("header p").innerText = metaData.description;

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

    var options = {
      attribution: metaData.attribution,
      basemap,
      center: metaData.center.split(","),
      cluster: metaData.cluster,
      description: metaData.description,
      instruction: metaData.instruction,
      logo: metaData.logo,
      key: metaData.key,
      program: metaData.program,
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
                  // [
                  //   {
                  //     label: "Group one",
                  //     id: 1,
                  //     disabled: false,
                  //     choices: [
                  //       { value: "China", label: "China" },
                  //       { value: "Japan", label: "Japan", disabled: true },
                  //       { value: "India", label: "India" }
                  //     ]
                  //   }
                  // ]
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
                boxContent += "<ul>";
                Object.keys(widgets[x].keys).forEach((key, y) => {
                  var svg =
                    "<svg  xmlns='http://www.w3.org/2000/svg'><circle cx='6' cy='6' r='5' stroke='" +
                    defaultColor +
                    "'  fill='" +
                    defaultColor +
                    "' /></svg>";

                  boxContent +=
                    '<li><label for="' +
                    widgets[x].keys[key].value +
                    '"><input class="widget ' +
                    widgets[x].type +
                    '" type="checkbox" name="' +
                    widgets[x].keys[key].value +
                    '" id="' +
                    widgets[x].keys[key].value +
                    '" ' +
                    (widgets[x].keys[key].selected ? "checked" : "") +
                    ' ><span class="colorKey" ' +
                    "style=\"background-image: url('data:image/svg+xml;base64," +
                    window.btoa(svg) +
                    '")></span>' +
                    widgets[x].keys[key].label +
                    "</label></li>";
                });
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
              new Choices(element.querySelector("select"), dropdownOptions[x]);
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
      var newMap = new Map("map", options).render();
    }
  });

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

          data.form = row[Object.keys(row)[y + 4]]["$t"];

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
      var ignoredHeaders = [];
      if (window.innerWidth > 768) {
        description = Object.keys(feature.properties)
          .map(function(p) {
            if (feature.properties[p])
              return ignoredHeaders.indexOf(p) < 0
                ? '<div class="popupHeaderStyle">' +
                    p.toUpperCase().replace(/_/g, " ") +
                    '</div><div class="popupEntryStyle">' +
                    feature.properties[p] +
                    "</div>"
                : "";
          })
          .filter(function(p) {
            return p;
          })
          .join("");
      } else {
        Object.keys(feature.properties).map(function(p) {
          description =
            '<div class="popupHeaderStyle">Name</div><div class="popupEntryStyle">' +
            feature.properties["name"] +
            "</div>";
        });
      }

      layer.bindPopup(description);
    }
  };
  var colorKey = map.widgets.find(w => w.style === "color");
  var weights = [];
  var dashArrays = [];
  var colors = [];
  var formKey = map.widgets.find(w => w.style === "form");
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
        weights.push([4, 2]);
        dashArrays.push([null, null]);
        colors.push([null, defaultColor.hex()]);
        break;
      case 2:
        weights.push([3, 3]);
        dashArrays.push([null, "6,12"]);
        colors.push([null, "#000000"]);
        break;
      case 3:
        weights.push([6, 3]);
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

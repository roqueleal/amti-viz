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

var basemap;
if (lang && lang.indexOf("zh-") > -1) {
  basemap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/ilabmedia/citui3waw00162jo1zcsf1urj/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaWxhYm1lZGlhIiwiYSI6ImNpbHYycXZ2bTAxajZ1c2tzdWU1b3gydnYifQ.AHxl8pPZsjsqoz95-604nw",
    {}
  );
} else {
  basemap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/ilabmedia/cj84s9bet10f52ro2lrna50yg/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaWxhYm1lZGlhIiwiYSI6ImNpbHYycXZ2bTAxajZ1c2tzdWU1b3gydnYifQ.AHxl8pPZsjsqoz95-604nw",
    {}
  );
}

var language = lang ? lang.replace("zh-", "") : lang;

var allowedHeaders = [
  lang ? "name_" + lang : "name",
  lang ? "description_" + lang : "description",
  "link"
];

var select = document.querySelector("#searchClaimant");

var map = L.map("map", {
  center: [20, 120],
  zoom: 4,
  scrollWheelZoom: window.innerWidth < 768 ? false : true,
  zoomControl: false,
  layers: [basemap],
  attributionControl: false
});

L.control
  .attribution({ position: "bottomleft" })
  .setPrefix(
    ' © <a href="https://amti.csis.org" target="_blank">AMTI</a> and <a href="https://www.csis.org" target="_blank">CSIS</a> | 2018'
  )
  .addTo(map);

L.control.zoomslider().addTo(map);

var apiKey = "fd_7Di9PMY2uwTyag2LfVw";

var nations = {
  India: {
    label: "India"
  },
  Bangladesh: { label: "Bangladesh" },
  Brunei: { label: "Brunei" },
  Thailand: { label: "Thailand" },
  Cambodia: { label: "Cambodia" },

  "Democratic People''s Republic of Korea (North Korea)": {
    label: "North Korea"
  },
  Indonesia: { label: "Indonesia" },
  Japan: { label: "Japan" },

  "People''s Republic of China": {
    label: "China",
    selected: true
  },
  "Republic of China (Taiwan)": {
    label: "Taiwan"
  },
  Singapore: { label: "Singapore" },
  "Sri Lanka": { label: "Sri Lanka" },
  Vietnam: {
    label: "Vietnam",
    selected: true
  },
  "South Korea": { label: "South Korea" },
  Maldives: { label: "Maldives" },
  Malaysia: { label: "Malaysia" },
  Myanmar: { label: "Myanmar" },
  Philippines: {
    label: "Philippines"
  }
};

var nationsLength = Object.keys(nations).length;
var scaleOne = d3
  .scaleSequential(d3.interpolateRainbow)
  .domain(d3.range(0, nationsLength));

var scaleTwo = d3
  .scaleSequential(d3.interpolateSpectral)
  .domain(d3.range(0, nationsLength));

Object.keys(nations).forEach(function(nation, i) {
  var color =
    i % 2 === 0
      ? d3.color(
          scaleOne((Math.abs(nationsLength - i - 5) / nationsLength) * 1)
        )
      : d3.color(scaleTwo((i / nationsLength) * 1));

  nations[nation] = _extends({}, nations[nation], {
    color: color.hex()
  });
});

var filters = [];

var nation_geoJson = {};
var nation_marker_clusters = {};

resetFilters();
makeClusters();

function resetFilters() {
  filters = [
    function() {
      return true;
    },
    function() {
      return true;
    }
  ];
}

document.querySelector(".nations").addEventListener("click", function(e) {
  var checkbox = e.target.type === "checkbox" ? e.target : undefined;
  if (checkbox) {
    removeClusters();

    var checkboxes = Array.from(
      document.querySelectorAll(".nations input:checked")
    );

    var names = checkboxes.map(function(c) {
      return c.name.replace("''", "'");
    });

    filters[1] = function(features, layers) {
      var bool = false;
      if (names.indexOf(features.properties.country) > -1) {
        bool = true;
      }
      return bool;
    };

    makeClusters();
  }
});

document.querySelector(".types").addEventListener("click", function(e) {
  var checkbox = e.target.type === "checkbox" ? e.target : undefined;
  if (checkbox) {
    removeClusters();

    var checkboxes = Array.from(
      document.querySelectorAll(".types input:checked")
    );

    var names = checkboxes.map(function(c) {
      return c.name;
    });

    filters[0] = function(features, layers) {
      var bool = false;
      if (names.indexOf(features.properties.type.toLowerCase()) > -1) {
        bool = true;
      }
      return bool;
    };

    makeClusters();
  }
});

function removeClusters() {
  Object.keys(nations).forEach(function(nation) {
    map.removeLayer(nation_marker_clusters[nation]);
  });
}

var types = [
  "Territorial Baseline",
  "Territorial Sea",
  "Exclusive Economic Zone",
  "Continental Shelf",
  "Nine-Dash/U-Shaped Line"
];
types.forEach(function(type) {
  var defaultColor = d3.color("#cad2d3");
  var svg;
  switch (type) {
    case "Territorial Baseline":
      svg =
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 12'><line x1='0' x2='48' y1='50%' y2='50%' stroke='" +
        defaultColor.darker() +
        "' stroke-width='3' stroke-dasharray='9, 3'/></svg>";
      break;
    case "Territorial Sea":
      svg =
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 12'><line x1='0' x2='48' y1='50%' y2='50%' stroke='" +
        defaultColor.darker() +
        "' stroke-width='5' /><line x1='0' x2='48' y1='50%' y2='50%' stroke='" +
        "#ffffff" +
        "' stroke-width='2' /></svg>";
      break;
    case "Exclusive Economic Zone":
      svg =
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 12'><line x1='0' x2='48' y1='50%' y2='50%' stroke='" +
        "#000000" +
        "' stroke-width='3' stroke-linecap='square'/><line x1='0' x2='48' y1='50%' y2='50%' stroke='" +
        defaultColor +
        "' stroke-width='3' stroke-linecap='square' stroke-dasharray='6, 9'/></svg>";
      break;
    case "Continental Shelf":
      svg =
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 12'><line x1='0' x2='48' y1='50%' y2='50%' stroke='" +
        defaultColor.darker() +
        "' stroke-width='3' stroke-linecap='square'/></svg>";
      break;
    default:
      svg =
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 12'><line x1='0' x2='48' y1='50%' y2='50%' stroke='" +
        defaultColor.darker() +
        "' stroke-width='3' stroke-linecap='square' stroke-dasharray='18, 12'/></svg>";
  }

  document.querySelector(".types").innerHTML +=
    '<li><label for="' +
    type.toLowerCase() +
    '"><input type="checkbox" name="' +
    type.toLowerCase() +
    '" id="' +
    type.toLowerCase() +
    '"  checked><span class="typeKey" ' +
    "style=\"background-image: url('data:image/svg+xml;base64," +
    window.btoa(svg) +
    '")></span>' +
    type +
    "</label></li>";
});

Object.keys(nations).forEach(function(nation) {
  var svg =
    "<svg xmlns='http://www.w3.org/2000/svg'><circle cx='6' cy='6' r='5' stroke='" +
    nations[nation].color +
    "'  fill='" +
    nations[nation].color +
    "' /></svg>";

  document.querySelector(".nations").innerHTML +=
    '<li><label for="' +
    nation +
    '"><input type="checkbox" name="' +
    nation +
    '" id="' +
    nation +
    '"' +
    (nations[nation].selected ? "checked" : "") +
    ' ><span class="colorKey" ' +
    "style=\"background-image: url('data:image/svg+xml;base64," +
    window.btoa(svg) +
    '")></span>' +
    nations[nation].label +
    "</label></li>";

  select.innerHTML +=
    "  <option value=" +
    nations[nation].label +
    (nations[nation].selected ? ' selected="selected"' : "") +
    ">" +
    nations[nation].label +
    "</option>";
});

var dropdownOptions = {
  removeItemButton: true,
  maxItemCount: 6,
  callbackOnCreateTemplates: function callbackOnCreateTemplates(template) {
    var _this = this;

    return {
      item: function item(classNames, data) {
        var nation = Object.keys(nations).find(function(n) {
          return nations[n].label == data.label;
        });

        var color = nations[nation].color;

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
          "<button style=\"background-image: url('data:image/svg+xml;base64," +
          window.btoa(remove) +
          '" type="button" class="choices__button" data-button="" aria-label="Remove item">Remove item</button></div>';

        return template(markup);
      },
      choice: function choice(classNames, data) {
        var nation = Object.keys(nations).find(function(n) {
          return nations[n].label == data.label;
        });

        var color = nations[nation].color;

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
          (data.groupId > 0 ? 'role="treeitem"' : 'role="option"') +
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

var searchBox = new Choices(select, dropdownOptions);
var initialized = null;

function makeClusters() {
  Object.keys(nations)
    .reverse()
    .forEach(function(nation) {
      if (Object.keys(nation_marker_clusters) > 0) {
        map.removeLayer(nation_marker_clusters[nation]);
      }

      fetch(
        "https://csis.carto.com/api/v2/sql?api_key=" +
          apiKey +
          "&format=geojson&q=SELECT%20*%20FROM%20all_claims_2%20WHERE%20country%20%3D%20%27" +
          encodeURI(nation) +
          "%27"
      )
        .then(function(resp) {
          return resp.json();
        })
        .then(function(json) {
          makeMarkers(nation, json, filters);

          if (
            Object.keys(nation_marker_clusters).length ===
            Object.keys(nations).length
          ) {
            initialized = initialized === null ? true : false;
          }

          if (initialized) {
            search();

            select.addEventListener("highlightItem", function(e) {
              searchBox.removeHighlightedItems();
            });

            select.addEventListener("removeItem", search);
            select.addEventListener("addItem", search);

            document.querySelector(".choices__input").focus();

            initialized = false;
          }
        });
    });
}

function search() {
  removeClusters();

  var names = Array.from(select.options).map(function(o) {
    var nation = Object.keys(nations).find(function(n) {
      return nations[n].label === o.value;
    });

    return nation.replace("''", "'");
  });

  filters[1] = function(features, layers) {
    var bool = false;

    if (names.indexOf(features.properties.country) > -1) {
      bool = true;
    }
    return bool;
  };
  makeClusters();
}

function makeMarkers(nation, json, filters) {
  nation_marker_clusters[nation] = new L.MarkerClusterGroup({
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false,
    maxClusterRadius: 0,
    iconCreateFunction: function iconCreateFunction(cluster) {
      return L.divIcon({
        className: "icon-" + nation,
        html: '<span class="text">' + cluster.getChildCount() + "</span>"
      });
    }
  });

  var geoJsonOptions = {
    filter: function filter(feature) {
      var bool = filters.map(function(f) {
        return f(feature);
      });

      return bool[0] && bool[1];
    },
    pointToLayer: function pointToLayer(feature, latlng) {
      var CustomIcon = L.Icon.extend({
        options: {
          iconSize: [20, 20]
        }
      });

      var svg =
        "<svg xmlns='http://www.w3.org/2000/svg'><circle cx='6' cy='6' r='5' stroke=\"#ffffff\"  fill='" +
        nations[nation].color +
        "' /></svg>";

      var iconUrl = encodeURI("data:image/svg+xml," + svg).sreplace("#", "%23");

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

            Object.keys(nations).forEach(function(n) {
              Object.values(
                nation_marker_clusters[n]._featureGroup._layers
              ).forEach(function(v) {
                if (v._group && v._group._spiderfied) isSpiderfied = true;
              });
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

      if (window.innerWidth > 768) {
        description = Object.keys(feature.properties)
          .map(function(p) {
            if (feature.properties[p])
              return allowedHeaders.indexOf(p) > -1
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

  var styleLayerA = function style(feature) {
    switch (feature.properties.type) {
      case "Territorial Baseline":
        return {
          color: nations[nation].color,
          weight: 3,
          lineCap: "square",
          dashArray: "12,18",
          opacity: initialized === null ? 0 : 1
        };
      case "Territorial Sea":
        return {
          color: nations[nation].color,
          weight: 4,
          opacity: initialized === null ? 0 : 1
        };
      case "Exclusive Economic Zone":
        return {
          color: "#000000",
          weight: 3,
          opacity: initialized === null ? 0 : 1
        };
      case "Continental Shelf":
        return {
          color: "#ffffff",
          weight: 6,
          opacity: initialized === null ? 0 : 1
        };
      default:
        return {
          color: nations[nation].color,
          lineCap: "square",
          weight: 4,
          opacity: initialized === null ? 0 : 1
        };
    }
  };

  var styleLayerB = function style(feature) {
    switch (feature.properties.type) {
      case "Territorial Baseline":
        return {
          color: nations[nation].color,
          weight: 3,
          lineCap: "square",
          dashArray: "12,18",
          opacity: initialized === null ? 0 : 1
        };
      case "Territorial Sea":
        return {
          color: "#cad2d3",
          weight: 2,
          opacity: initialized === null ? 0 : 1
        };
      case "Exclusive Economic Zone":
        return {
          color: nations[nation].color,
          weight: 3,
          lineCap: "square",
          dashArray: "12,18",
          opacity: initialized === null ? 0 : 1
        };
      case "Continental Shelf":
        return {
          color: nations[nation].color,
          weight: 3,
          opacity: initialized === null ? 0 : 1
        };
      default:
        return {
          color: nations[nation].color,
          lineCap: "square",
          weight: 4,
          opacity: initialized === null ? 0 : 1
        };
    }
  };

  var geoJsonLayerA = L.geoJson(
    json,
    _extends({}, geoJsonOptions, {
      style: styleLayerA
    })
  );

  var geoJsonLayerB = L.geoJson(
    json,
    _extends({}, geoJsonOptions, {
      style: styleLayerB
    })
  );

  nation_marker_clusters[nation].addLayer(geoJsonLayerA);

  nation_marker_clusters[nation].addLayer(geoJsonLayerB);

  map.addLayer(nation_marker_clusters[nation]);

  nation_marker_clusters[nation].on("clusterclick", function(a) {
    map._layers[a.layer._leaflet_id].spiderfy();

    Object.keys(map._layers).forEach(function(layer, i) {
      if (parseInt(layer, 10) !== a.layer._leaflet_id) {
        if (map._layers[layer].unspiderfy) map._layers[layer].unspiderfy();
      }
    });

    var isSpiderfied = false;

    Object.keys(nations).forEach(function(n) {
      Object.values(nation_marker_clusters[n]._featureGroup._layers).forEach(
        function(v) {
          if (v._group && v._group._spiderfied) isSpiderfied = true;
        }
      );
    });
    Object.keys(nations).forEach(function(n) {
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
      Object.values(nation_marker_clusters[n]._featureGroup._layers).filter(
        function(v) {
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
        }
      );
    });
  });
}

map.on("click", function() {
  Array.from(document.querySelectorAll("div.leaflet-marker-icon")).forEach(
    function(d) {
      return (d.style.opacity = 1);
    }
  );
  Array.from(document.querySelectorAll("img.leaflet-marker-icon")).forEach(
    function(d) {
      return (d.style.opacity = 1);
    }
  );
});

function flattenDeep(arr1) {
  return arr1.reduce(function(acc, val) {
    return Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val);
  }, []);
}
var externalLink =
  '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15">><path d="M7.49,0V1.67H1.68V13.32H13.32V7.52H15v5.72a1.76,1.76,0,0,1-.42,1.19,1.64,1.64,0,0,1-1.13.56H1.74a1.67,1.67,0,0,1-1.16-.41A1.61,1.61,0,0,1,0,13.48v-.27C0,9.4,0,5.6,0,1.8A1.83,1.83,0,0,1,.58.4a1.53,1.53,0,0,1,1-.39h6Z" transform="translate(0 0)"/><path d="M9.17,1.67V0H15V5.84H13.34v-3h0c-.05.05-.11.1-.16.16l-.45.46-1.3,1.29-.84.84-.89.9-.88.87-.89.9c-.28.29-.57.57-.86.86L6.16,10l-.88.87a1.83,1.83,0,0,1-.13.16L4,9.86l0,0L5.36,8.47l.95-1,.75-.75,1-1L8.87,5l1-.94.85-.86.92-.91.56-.58Z" transform="translate(0 0)"/></svg>';

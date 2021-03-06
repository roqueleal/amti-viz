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

var map = L.map("map", {
  center: [14, 115],
  zoom: 6,
  scrollWheelZoom: window.innerWidth < 768 ? false : true,
  zoomControl: false,
  layers: [basemap],
  attributionControl: false
});

L.control
  .attribution({ position: "bottomleft" })
  .setPrefix(
    'Data by <a href="https://amti.csis.org" target="_blank">CSIS AMTI</a>, © OpenStreetMap, Leaflet contributors, © CARTO'
  )
  .addTo(map);

L.control.zoomslider().addTo(map);

var apiKey = "wSX_v1e4-P45ernhjNuLgg";

var nations = {
  china: { color: "#3969AC" },
  vietnam: { color: "#11A579" },
  malaysia: { color: "#7F3C8D" },
  philippines: { color: "#E73F74" },
  taiwan: { color: "#F2B701" },
  unoccupied: { color: "#888888" }
};

var filters = [];

var nation_geoJson = {};
var nation_marker_clusters = {};

var ignoredHeaders = [
  "cartodb_id",
  "latitude",
  "longitude",
  "occupier",
  "hyperlink",
  "status",
  "picture"
];

Object.keys(nations).forEach(function(nation) {
  var svg = nations[nation].line
    ? "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'><line x1='0' x2='12' y1='25%' y2='25%' stroke='" +
      nations[nation].color +
      "' stroke-width='3' stroke-linecap='round'/><line x1='0' x2='12' y1='75%' y2='75%' stroke='" +
      nations[nation].color +
      "' stroke-width='3' stroke-linecap='round' stroke-dasharray='4, 6'/></svg>"
    : "<svg xmlns='http://www.w3.org/2000/svg'><circle cx='6' cy='6' r='5' stroke='" +
      nations[nation].color +
      "'  fill='" +
      nations[nation].color +
      "' /></svg>";

  document.querySelector(".occupiers").innerHTML +=
    '<li><label for="' +
    nation +
    '"><input type="checkbox" name="' +
    nation +
    '" id="' +
    nation +
    '"checked><span class="colorKey" ' +
    "style=\"background-image: url('data:image/svg+xml;base64," +
    window.btoa(svg) +
    '\')"></span><span class="translate">' +
    (nation.charAt(0).toUpperCase() + nation.slice(1)) +
    "</span></label></li>";
});

function resetFilters() {
  filters = [
    function() {
      return true;
    },
    function() {
      return true;
    },
    function() {
      return true;
    }
  ];
}

var spreadsheetID = "1wUMSGriDTQgS1NIqeRlJktBxOJ208vWfNVMXNRu4adM";

var translationsURL =
  "https://spreadsheets.google.com/feeds/list/" +
  spreadsheetID +
  "/1/public/values?alt=json";

var translations;
var sortedTranslations;

if (lang) {
  fetch(translationsURL)
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      translations = parseData(json.feed.entry);
      sortedTranslations = Object.keys(translations).sort(function(a, b) {
        return b.length - a.length;
      });

      Array.from(document.querySelectorAll(".translate")).forEach(function(
        el,
        i
      ) {
        sortedTranslations.forEach(function(t) {
          if (Object.keys(translations[t]).length) {
            var re = new RegExp("\\b(" + RegExp.escape(t) + ")", "gi");

            el.innerHTML = el.innerHTML.replace(re, translations[t]);
          }
        });
      });

      resetFilters();

      makeClusters();

      return json;
    })
    .catch(function(ex) {
      console.log("mm parsing failed", ex);
    });
} else {
  resetFilters();

  makeClusters();
}

RegExp.escape = function(s) {
  return s.replace(/[\/\\^$*+?.()|[\]{}]/g, "\\$&");
};

function parseData(data) {
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

document.querySelector("#query").addEventListener("keyup", searchFeatures);

document.querySelector("#resetButton").addEventListener("click", function(e) {
  document.querySelector("#query").value = "";
  removeClusters();
  filters[0] = function() {
    return true;
  };
  remakeClusters();
});

function searchFeatures(e) {
  removeClusters();
  var q = e.target.value.toLowerCase();
  filters[0] = function(feature) {
    var bool = false;
    var withDiacritics = Object.values(feature.properties)
      .join("")
      .toLowerCase();
    var withoutDiacritics = Object.values(feature.properties)
      .join("")
      .toLowerCase()
      .latinise();

    if (withDiacritics.indexOf(q) > -1 || withoutDiacritics.indexOf(q) > -1) {
      bool = true;
    }

    return bool;
  };

  remakeClusters();
}

document.querySelector(".occupiers").addEventListener("click", function(e) {
  var checkbox = e.target.type === "checkbox" ? e.target : undefined;
  if (checkbox) {
    removeClusters();

    var checkboxes = Array.from(
      document.querySelectorAll(".occupiers input:checked")
    );

    var names = checkboxes.map(function(c) {
      return c.name;
    });

    filters[2] = function(features, layers) {
      var bool = false;

      if (names.indexOf(features.properties.occupier.toLowerCase()) > -1) {
        bool = true;
      }

      return bool;
    };

    remakeClusters();
  }
});

document.querySelector(".statuses").addEventListener("click", function(e) {
  var checkbox = e.target.type === "checkbox" ? e.target : undefined;
  if (checkbox) {
    removeClusters();

    var checkboxes = Array.from(
      document.querySelectorAll(".statuses input:checked")
    );

    var names = checkboxes.map(function(c) {
      return c.name;
    });

    filters[1] = function(features, layers) {
      var bool = false;

      if (names.indexOf(features.properties.status.toLowerCase()) > -1) {
        bool = true;
      }

      return bool;
    };

    remakeClusters();
  }
});

function removeClusters() {
  Object.keys(nations).forEach(function(nation) {
    map.removeLayer(nation_marker_clusters[nation]);
  });
}

function makeClusters() {
  Object.keys(nations).forEach(function(nation) {
    if (Object.keys(nation_marker_clusters) > 0) {
      map.removeLayer(nation_marker_clusters[nation]);
    }

    fetch(
      "https://csis.carto.com/api/v2/sql?api_key=" +
        apiKey +
        "&format=geojson&q=SELECT%20*%20FROM%20" +
        nation +
        "_scs_islands"
    )
      .then(function(resp) {
        return resp.json();
      })
      .then(function(json) {
        makeMarkers(nation, json, filters);

        var icons = document.querySelectorAll(
          ".icon-" + nation + ":not(.marker-cluster-small)"
        );
        Array.from(icons).forEach(function(icon) {
          icon.style.color = nations[nation].color;
          icon.style.borderColor = nations[nation].color;
          icon.style.borderWidth = 1;
          icon.style.borderStyle = "solid";
        });
      });
  });
}

function remakeClusters() {
  Object.keys(nations).forEach(function(nation) {
    makeMarkers(nation, nation_marker_clusters[nation].json, filters);

    var icons = document.querySelectorAll(
      ".icon-" + nation + ":not(.marker-cluster-small)"
    );
    Array.from(icons).forEach(function(icon) {
      icon.style.color = nations[nation].color;
      icon.style.borderColor = nations[nation].color;
      icon.style.borderWidth = 1;
      icon.style.borderStyle = "solid";
    });
  });
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

  nation_marker_clusters[nation].json = json;

  var geoJsonLayer = L.geoJson(json, {
    filter: function filter(feature) {
      var bool = filters.map(function(f) {
        return f(feature);
      });

      return bool[0] && bool[1] && bool[2];
    },
    pointToLayer: function pointToLayer(feature, latlng) {
      var CustomIcon = L.Icon.extend({
        options: {
          iconSize: [20, 20]
        }
      });

      var svg;
      switch (feature.properties.status.toLowerCase()) {
        case "low-tide elevation":
          svg =
            "<svg xmlns='http://www.w3.org/2000/svg'><polygon points='6 10.39 0 10.39 3 5.2 6 0 9 5.2 12 10.39 6 10.39' stroke=\"#ffffff\" fill='" +
            nations[nation].color +
            "' paint-order='stroke'></polygon></svg>";
          break;
        case "rock":
          svg =
            "<svg xmlns='http://www.w3.org/2000/svg'><rect width='10' height='10' stroke=\"#ffffff\" fill='" +
            nations[nation].color +
            "'></rect></svg>";
          break;
        case "submerged":
          svg =
            "<svg xmlns='http://www.w3.org/2000/svg'><rect x='4' y='2' width='9' height='9' transform='translate(6 -3) rotate(45)' stroke=\"#ffffff\" fill='" +
            nations[nation].color +
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

      if (true) {
        description = Object.keys(feature.properties)
          .map(function(p) {
            if (feature.properties[p])
              return ignoredHeaders.indexOf(p) < 0
                ? '<div class="popupHeaderStyle">' +
                    p.replace(/_/g, " ") +
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
            '<div class="popupHeaderStyle">name</div><div class="popupEntryStyle">' +
            feature.properties["name"] +
            "</div>";
        });
      }

      // var link = lang
      //   ? feature.properties.hyperlink + "?lang=" + lang
      //   : feature.properties.hyperlink;

      var link = feature.properties.hyperlink;

      var islandTracker =
        feature.properties.hyperlink.trim().length > 1
          ? '<div class="separator"></div><div class="islandTracker popupEntryStyle"><a href=' +
            link +
            ' target="_blank">' +
            "View on the Island Tracker" +
            "</a>" +
            externalLink +
            "</div>"
          : "";

      content = description + islandTracker;

      if (lang) {
        sortedTranslations.forEach(function(t) {
          var re = new RegExp("\\b(" + RegExp.escape(t) + ")", "gi");

          content = content.replace(re, translations[t]);
        });
      }

      layer.bindPopup(content);
    }
  });

  nation_marker_clusters[nation].addLayer(geoJsonLayer);

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

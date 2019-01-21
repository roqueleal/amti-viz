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

var languages = {
  "zh-hant": "china",
  "zh-hans": "china",
  vi: "vietnam",
  ms: "malaysia"
};

var map = L.map("map", {
  center: [14, 115],
  zoom: 6,
  scrollWheelZoom: false,
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

var apiKey = "wSX_v1e4-P45ernhjNuLgg";

var nations = {
  unoccupied: "#888888",
  taiwan: "#F2B701",
  philippines: "#E73F74",
  china: "#3969AC",
  vietnam: "#11A579",
  malaysia: "#7F3C8D"
};

var filters = [];

var nation_geoJson = {};
var nation_marker_clusters = {};

var ignoredHeaders = [
  "cartodb_id",
  "latitude",
  "longitude",
  "occupier",
  "hyperlink"
];
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

document.querySelector("#query").addEventListener("keyup", searchFeatures);

document.querySelector("#resetButton").addEventListener("click", function(e) {
  document.querySelector("#query").value = "";
  removeClusters();
  resetFilters();
  makeClusters();
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

  makeClusters();
}

document.querySelector(".occupiers").addEventListener("click", function(e) {
  var checkbox = e.target.type === "checkbox" ? e.target : undefined;
  if (checkbox && checkbox.checked) {
    map.addLayer(nation_marker_clusters[checkbox.name]);
  } else if (checkbox) {
    map.removeLayer(nation_marker_clusters[checkbox.name]);
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

    makeClusters();
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
      });
  });
}

function makeMarkers(nation, json, filters) {
  nation_marker_clusters[nation] = new L.MarkerClusterGroup({
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false,
    maxClusterRadius: 10,
    iconCreateFunction: function iconCreateFunction(cluster) {
      return L.divIcon({
        className: "icon-" + nation,
        html: '<span class="text">' + cluster.getChildCount() + "</span>"
      });
    }
  });

  var geoJsonLayer = L.geoJson(json, {
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

      var svg;
      switch (feature.properties.status.toLowerCase()) {
        case "low-tide elevation":
          svg =
            "<svg xmlns='http://www.w3.org/2000/svg'><polygon points='6 10.39 0 10.39 3 5.2 6 0 9 5.2 12 10.39 6 10.39' stroke=\"#ffffff\" fill='" +
            nations[nation] +
            "' paint-order='stroke'></polygon></svg>";
          break;
        case "rock":
          svg =
            "<svg xmlns='http://www.w3.org/2000/svg'><rect width='10' height='10' stroke=\"#ffffff\" fill='" +
            nations[nation] +
            "'></rect></svg>";
          break;
        case "submerged":
          svg =
            "<svg xmlns='http://www.w3.org/2000/svg'><rect x='4' y='2' width='9' height='9' transform='translate(6 -3) rotate(45)' stroke=\"#ffffff\" fill='" +
            nations[nation] +
            "' paint-order='stroke'></rect></svg>";
          break;
        default:
          svg =
            "<svg xmlns='http://www.w3.org/2000/svg'><circle cx='6' cy='6' r='6' stroke=\"#ffffff\" fill='" +
            nations[nation] +
            "' /></svg>";
      }

      var iconUrl = encodeURI("data:image/svg+xml," + svg).replace("#", "%23");

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
              return ignoredHeaders.indexOf(p) < 0
                ? '<div class=\n            "popupHeaderStyle">' +
                    p
                      .toUpperCase()
                      .replace(/_/g, " ")
                      .replace("NUMBER", "#") +
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
            '<div class=\n      "popupHeaderStyle">Name</div><div class="popupEntryStyle">' +
            feature.properties["name"] +
            "</div>";
        });
      }

      var link = feature.properties.hyperlink;

      var islandTracker =
        nation !== "unoccupied"
          ? '<div class="separator"></div><div class="islandTracker popupEntryStyle"><a href=' +
            link +
            ' target="_blank">' +
            "View on the Island Tracker" +
            "</a>" +
            externalLink +
            "</div>"
          : "";

      layer.bindPopup(description + islandTracker);
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

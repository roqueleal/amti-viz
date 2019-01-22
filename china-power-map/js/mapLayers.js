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

var language = lang ? lang.replace("-", "_") : "name";

var map = L.map("map", {
  center: [14, 115],
  zoom: 5,
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

var apiKey = "X1A67o9_DcmpMX2RAYQ15g";

var mapLayers = {
  cpp_anti_cruise_ship: {
    label: "Anti-Ship Cruise Missiles",
    color: "#11A579"
  },
  cpp_sam_ranges: { label: "SAM Sites", color: "#7F3C8D" },
  cpp_fighter_ranges: { label: "Fighter Aircraft", color: "#E73F74" },
  cpp_bomber_ranges: { label: "Bomber Aircraft", color: "orange" },
  cpp_radar_ranges: { label: "Radar", color: "yellow" },
  cpp_nine_dash_line: { label: "Chinese Maritime Claims", color: "black" },
  cpp_chinese_outposts: { label: "Chinese Outposts", color: "#245381" }
};

var filters = [];

var mapLayer_geoJson = {};
var mapLayer_marker_clusters = {};

var allowedHeaders = [language, "description", "launcher"];
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

document.querySelector(".mapLayers").addEventListener("click", function(e) {
  var checkbox = e.target.type === "checkbox" ? e.target : undefined;
  if (checkbox && checkbox.checked) {
    map.addLayer(mapLayer_marker_clusters[checkbox.name]);
  } else if (checkbox) {
    map.removeLayer(mapLayer_marker_clusters[checkbox.name]);
  }
});

function removeClusters() {
  Object.keys(mapLayers).forEach(function(mapLayer) {
    map.removeLayer(mapLayer_marker_clusters[mapLayer]);
  });
}

Object.keys(mapLayers).forEach(function(mapLayer) {
  document.querySelector(".mapLayers").innerHTML +=
    '<li>\n     <label for="' +
    mapLayer +
    '">\n     <input type="checkbox" name="' +
    mapLayer +
    '" id="' +
    mapLayer +
    '"  checked>\n     ' +
    mapLayers[mapLayer].label +
    '\n     <span class="colorKey" style="background-color: ' +
    mapLayers[mapLayer].color +
    ';"></span>\n     </label>\n  </li>';
});

function makeClusters() {
  Object.keys(mapLayers)
    .reverse()
    .forEach(function(mapLayer) {
      if (Object.keys(mapLayer_marker_clusters) > 0) {
        map.removeLayer(mapLayer_marker_clusters[mapLayer]);
      }

      fetch(
        "https://csis.carto.com/api/v2/sql?api_key=" +
          apiKey +
          "&format=geojson&q=SELECT%20*%20FROM%20" +
          mapLayer
      )
        .then(function(resp) {
          return resp.json();
        })
        .then(function(json) {
          makeMarkers(mapLayer, json, filters);
        });
    });
}

function makeMarkers(mapLayer, json, filters) {
  mapLayer_marker_clusters[mapLayer] = new L.MarkerClusterGroup({
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false,
    maxClusterRadius: 0,
    iconCreateFunction: function iconCreateFunction(cluster) {
      return L.divIcon({
        className: "icon-" + mapLayer,
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

      var svg =
        "<svg xmlns='http://www.w3.org/2000/svg'><circle cx='6' cy='6' r='6' stroke=\"#ffffff\"  fill='" +
        mapLayers[mapLayer].color +
        "' /></svg>";

      var iconUrl = encodeURI("data:image/svg+xml," + svg).replace("#", "%23");

      var icon = new CustomIcon({ iconUrl: iconUrl });

      return L.marker(latlng, {
        icon: icon
      });
    },
    style: function style(feature) {
      var isRadar = feature.properties.name.toLowerCase().indexOf("radar") > -1;
      return {
        color: mapLayers[mapLayer].color,
        weight: isRadar ? 0 : 4,
        dashArray: feature.properties.observed === false ? "12 18" : null,
        fill: isRadar ? true : false
      };
    },
    onEachFeature: function onEachFeature(feature, layer) {
      layer.on({
        click: function click(e) {
          var isSpiderfied = false;

          if (!layer._popupHandlersAdded) {
            Object.keys(map._layers).forEach(function(l, i) {
              if (map._layers[l].unspiderfy) map._layers[l].unspiderfy();
            });

            Object.keys(mapLayers).forEach(function(n) {
              Object.values(
                mapLayer_marker_clusters[n]._featureGroup._layers
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

      layer.bindPopup(description);
    }
  });

  mapLayer_marker_clusters[mapLayer].addLayer(geoJsonLayer);

  map.addLayer(mapLayer_marker_clusters[mapLayer]);

  mapLayer_marker_clusters[mapLayer].on("clusterclick", function(a) {
    map._layers[a.layer._leaflet_id].spiderfy();

    Object.keys(map._layers).forEach(function(layer, i) {
      if (parseInt(layer, 10) !== a.layer._leaflet_id) {
        if (map._layers[layer].unspiderfy) map._layers[layer].unspiderfy();
      }
    });

    var isSpiderfied = false;

    Object.keys(mapLayers).forEach(function(n) {
      Object.values(mapLayer_marker_clusters[n]._featureGroup._layers).forEach(
        function(v) {
          if (v._group && v._group._spiderfied) isSpiderfied = true;
        }
      );
    });
    Object.keys(mapLayers).forEach(function(n) {
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
      Object.values(mapLayer_marker_clusters[n]._featureGroup._layers).filter(
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

  // mapLayer_marker_clusters.cpp_radar_ranges.bringToBack();
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

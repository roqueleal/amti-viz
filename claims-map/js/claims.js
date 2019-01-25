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

var apiKey = "buPBMXbElVsLJ_AYQ3VA4w";

var nations = {
  India: { label: "India" },
  Bangladesh: { label: "Bangladesh" },
  Brunei: { label: "Brunei" },
  Thailand: { label: "Thailand" },
  Cambodia: { label: "Cambodia" },

  "Democratic People''s Republic of Korea (North Korea)": {
    label: "Democratic People's Republic of Korea (North Korea)"
  },
  Indonesia: { label: "Indonesia" },
  Japan: { label: "Japan" },

  "People''s Republic of China": {
    label: "People's Republic of China"
  },
  "Republic of China (Taiwan)": {
    label: "Republic of China (Taiwan)"
  },
  Singapore: { label: "Singapore" },
  "Sri Lanka": { label: "Sri Lanka" },
  Vietnam: { label: "Vietnam" },
  "South Korea": { label: "South Korea" },
  Maldives: { label: "Maldives" },
  Malaysia: { label: "Malaysia" },
  Myanmar: { label: "Myanmar" },
  Philippines: { label: "Philippines" }
};

var nationsLength = Object.keys(nations).length;

var scaleOne = d3
  .scaleSequential(d3.interpolateCubehelixDefault)
  .domain(d3.range(0, nationsLength));

var scaleTwo = d3
  .scaleSequential(d3.interpolateRainbow)
  .domain(d3.range(0, nationsLength));

Object.keys(nations).forEach((nation, i) => {
  var color =
    i % 2 === 0
      ? d3.color(
          scaleOne((Math.abs(nationsLength - i + -1) / nationsLength) * 1)
        )
      : d3.color(scaleTwo((i / nationsLength) * 1));

  nations[nation] = {
    ...nations[nation],
    color: color.hex()
  };
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
  if (checkbox && checkbox.checked) {
    map.addLayer(nation_marker_clusters[checkbox.name]);
  } else if (checkbox) {
    map.removeLayer(nation_marker_clusters[checkbox.name]);
  }
});

function removeClusters() {
  Object.keys(nations).forEach(function(nation) {
    map.removeLayer(nation_marker_clusters[nation]);
  });
}

Object.keys(nations).forEach(function(nation, i) {
  var svg = true
    ? "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'><line x1='0' x2='12' y1='25%' y2='25%' stroke='" +
      nations[nation].color +
      "' stroke-width='3' stroke-linecap='square'/><line x1='0' x2='12' y1='75%' y2='75%' stroke='" +
      nations[nation].color +
      "' stroke-width='3' stroke-linecap='square' stroke-dasharray='4, 6'/></svg>"
    : "<svg xmlns='http://www.w3.org/2000/svg'><circle cx='6' cy='6' r='6' stroke='" +
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
    '"  checked>' +
    nations[nation].label +
    '<span class="colorKey" ' +
    "style=\"background-image: url('data:image/svg+xml;base64," +
    window.btoa(svg) +
    '")></span></label></li>';
});

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
          "&format=geojson&q=SELECT%20*%20FROM%20all_claims%20WHERE%20country%20%3D%20%27" +
          encodeURI(nation) +
          "%27"
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
        "<svg xmlns='http://www.w3.org/2000/svg'><circle cx='6' cy='6' r='6' stroke=\"#ffffff\"  fill='" +
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
          weight: 4,
          lineCap: "square",
          dashArray: "12,18"
        };
      case "Territorial Sea":
        return {
          color: nations[nation].color,
          weight: 4
        };
      case "Exclusive Economic Zone":
        return {
          color: "#000000",
          weight: 4
        };
      case "Continental Shelf":
        return {
          color: "#ffffff",
          weight: 4
        };
      default:
        return {
          color: nations[nation].color,
          weight: 4
        };
    }
  };

  var styleLayerB = function style(feature) {
    switch (feature.properties.type) {
      case "Territorial Baseline":
        return {
          color: nations[nation].color,
          weight: 4,
          lineCap: "square",
          dashArray: "12,18"
        };
      case "Territorial Sea":
        return {
          color: "#cad2d3",
          weight: 1.5
        };
      case "Exclusive Economic Zone":
        return {
          color: nations[nation].color,
          weight: 4,
          lineCap: "square",
          dashArray: "12,18"
        };
      case "Continental Shelf":
        return {
          color: nations[nation].color,
          weight: 1.5
        };
      default:
        return {
          color: nations[nation].color,
          weight: 4
        };
    }
  };

  var geoJsonLayerA = L.geoJson(json, {
    ...geoJsonOptions,
    style: styleLayerA
  });

  var geoJsonLayerB = L.geoJson(json, {
    ...geoJsonOptions,
    style: styleLayerB
  });

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

  // nation_marker_clusters.cpp_radar_ranges.bringToBack();
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

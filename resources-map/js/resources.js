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

var resourceLayer;
var countryDataFilter;
var resources;
var claim_style;

var map = L.map("map", {
  center: [13.7237264, 110.6814572],
  zoom: 6,
  maxZoom: 18,
  scrollWheelZoom: window.innerWidth < 768 ? false : true,
  minZoom: 1,
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

var client = new carto.Client({
  apiKey: "VIKGbtgYDbaBvbByM9W8gg",
  username: "csis"
});

var spreadsheetID = "1k3NtTK79jZpXK3qzg53-wQFM_KeF6qhXSXzwh8E1IVk";

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

      initResources();
      initClaims();

      client
        .getLeafletLayer()
        .bringToFront()
        .addTo(map);

      return json;
    })
    .catch(function(ex) {
      console.log("mm parsing failed", ex);
    });
} else {
  initResources();
  initClaims();

  client
    .getLeafletLayer()
    .bringToFront()
    .addTo(map);
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

function initResources() {
  countryDataFilter = new carto.filter.Category("country1", {
    in: getCountryData()
  });

  resources = new carto.source.SQL(
    "SELECT * FROM table_2018_allcountries_oilandgas_production ORDER BY country1 DESC"
  );

  resources.addFilter(countryDataFilter);

  var resourceStyle = new carto.style.CartoCSS(
    '#layer {polygon-fill: ramp([country1], (#7F3C8D, #11A579, #3969AC, #F2B701, #E73F74, #80BA5A, #A5AA99), ("Malaysia", "Vietnam", "China", "Brunei", "Philippines", "Indonesia"), "=");polygon-opacity: 0.7;}#layer::outline {line-width: 1;line-color: #FFFFFF;line-opacity: 0.5;}'
  );

  resourceLayer = new carto.layer.Layer(resources, resourceStyle, {
    featureClickColumns: [
      "block_name",
      "resource_type",
      "license_status",
      "production_status",
      "operator",
      "partner1",
      "partner2",
      "partner3"
    ]
  });

  var resourcePopup = L.popup({ closeButton: true });

  resourceLayer.on(carto.layer.events.FEATURE_CLICKED, function(
    blockFeatureEvent
  ) {
    resourcePopup.setLatLng(blockFeatureEvent.latLng);

    var allowed = [
      "block_name",
      "resource_type",
      "license_status",
      "production_status",
      "operator"
    ];
    if (!resourcePopup.isOpen()) {
      var data = blockFeatureEvent.data;

      var stakeHolders = formatStakeholders(data);
      var content = Object.keys(data)
        .filter(function(d) {
          return allowed.includes(d) && data[d].trim();
        })
        .map(function(d) {
          return (
            '<div class="popupHeaderStyle">' +
            d.replace(/_/g, " ") +
            '</div><div class="popupEntryStyle">' +
            data[d] +
            "</div>"
          );
        })
        .join("");

      content += "" + stakeHolders;

      if (lang) {
        sortedTranslations.forEach(function(t) {
          var re = new RegExp("\\b(" + RegExp.escape(t) + ")", "gi");

          content = content.replace(re, translations[t]);
        });
      }

      resourcePopup.setContent("" + content);
      resourcePopup.openOn(map);
    }
  });
  client.addLayer(resourceLayer);

  if (window.innerWidth > 768) {
    var resourceHover = L.popup({ closeButton: false });

    resourceLayer.on(carto.layer.events.FEATURE_OVER, function(
      blockFeatureEvent
    ) {
      resourceHover.setLatLng(blockFeatureEvent.latLng);
      if (!resourcePopup.isOpen()) {
        var data = blockFeatureEvent.data;

        var sectionTitle = lang ? translations["Block name"] : "Block name";

        resourceHover.setContent(
          "<div class='popupHeaderStyle'>" +
            sectionTitle +
            "</div><div class='popupEntryStyle'>" +
            data.block_name +
            "</div>"
        );
        resourceHover.openOn(map);
      }
    });

    resourceLayer.on(carto.layer.events.FEATURE_OUT, function(
      blockFeatureEvent
    ) {
      resourceHover.removeFrom(map);
    });
  }
}

function initClaims() {
  var claimLines = new carto.source.SQL("SELECT * FROM cs_claims");
  claim_style = new carto.style.CartoCSS(
    "#layer {line-width: 0;line-color: #7F3C8D;line-opacity: 1;}"
  );

  var claimsLayer = new carto.layer.Layer(claimLines, claim_style, {
    featureClickColumns: ["name"]
  });

  var claimsPopup = L.popup({ closeButton: false });

  claimsLayer.on(carto.layer.events.FEATURE_OVER, function(claimFeatureEvent) {
    claimsPopup.setLatLng(claimFeatureEvent.latLng);
    if (!claimsPopup.isOpen()) {
      var sectionTitle = lang ? translations["Claim"] : "Claim";

      claimsPopup.setContent(
        "<div class='popupHeaderStyle'>" +
          sectionTitle +
          "</div><div class='popupEntryStyle'>" +
          claimFeatureEvent.data.name +
          "</div>"
      );
      claimsPopup.openOn(map);
    }
  });

  claimsLayer.on(carto.layer.events.FEATURE_OUT, function(claimFeatureEvent) {
    claimsPopup.removeFrom(map);
  });

  client.addLayer(claimsLayer);
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatStakeholders(data) {
  var partnerColKeys = Object.keys(data).filter(function(k) {
    return k.indexOf("partner") > -1;
  });

  var stakeholderArray = [];

  partnerColKeys.forEach(function(k) {
    return stakeholderArray.push(data[k]);
  });

  var stakeholderString = void 0;

  stakeholderArray = stakeholderArray.filter(function(s) {
    return !!s.trim();
  });
  switch (true) {
    case stakeholderArray.length === 1:
      return (
        '<div class="popupHeaderStyle">Stakeholders</div>\n      <div class="popupEntryStyle">' +
        stakeholderArray[0] +
        "</div>"
      );
      break;
    case stakeholderArray.length > 1:
      stakeholderLIs = stakeholderArray.map(function(s) {
        return "<li>" + s + "</li>";
      });
      return (
        '<div class="popupHeaderStyle">Stakeholders</div>\n      <div class="popupEntryStyle">\n      <ul>' +
        stakeholderLIs.join("") +
        "</ul>\n      </div>"
      );

      break;
    default:
      return "";
  }
}

function getCountryData() {
  var values = [];

  Array.from(document.querySelectorAll("#controls input")).forEach(function(
    input
  ) {
    return input.checked ? values.push(input.value) : null;
  });
  return values;
}

function applyFilters() {
  countryDataFilter.set("in", getCountryData());
}

function setClaims() {
  claim_style.setContent(
    ' #layer {line-width: 4;line-color: ramp([country], (#12eba9, #98c1ff, #e671ff, #405e2c, #fdc006, #83203f), ("Vietnam", "China", "Malaysia", "Indonesia", "Brunei", "Philisppines"), "="); } '
  );
}

function setNone() {
  claim_style.setContent(
    "#layer {line-width: 0;line-color: #7F3C8D;line-opacity: 1;}"
  );
}

Array.from(document.querySelectorAll("#controls input")).forEach(function(
  input
) {
  return input.addEventListener("click", function() {
    applyFilters();
  });
});

document.querySelector("#query").addEventListener("keyup", function() {
  var q = document.querySelector("#query").value;
  var filterArray = [];

  if (
    q.toLowerCase().indexOf("prod") > -1 &&
    !(q.toLowerCase().indexOf("non") > -1)
  ) {
    filterArray.push(
      new carto.filter.Category("production", {
        eq: "Producing"
      })
    );
    filterArray.push(
      new carto.filter.Category("production", {
        eq: "producing"
      })
    );
  } else if (
    q.toLowerCase().indexOf("non ") > -1 ||
    q.toLowerCase().indexOf("non-p") > -1
  ) {
    filterArray.push(
      capital("production", q),
      lower("production", q),
      upper("production", q)
    );
  } else {
    var columnArray = resourceLayer["_featureClickColumns"];
    columnArray.push("country1");
    columnArray.map(function(c) {
      filterArray.push(capital(c, q), lower(c, q), upper(c, q));
    });
  }

  var filters = new carto.filter.OR(filterArray);

  resources
    .getFilters()
    .slice(1)
    .forEach(function(f) {
      return resources.removeFilter(f);
    });

  resources.addFilter(filters);
});

var capital = function capital(c, q) {
  return new carto.filter.Category(c, {
    like: "%" + (q.charAt(0).toUpperCase() + q.slice(1)) + "%"
  });
};
var lower = function lower(c, q) {
  return new carto.filter.Category(c, {
    like: "%" + q.toLowerCase() + "%"
  });
};
var upper = function upper(c, q) {
  return new carto.filter.Category(c, {
    like: "%" + q.toUpperCase() + "%"
  });
};

document.querySelector("#resetButton").addEventListener("click", function(e) {
  document.querySelector("#query").value = "";
  resources
    .getFilters()
    .slice(1)
    .forEach(function(f) {
      return resources.removeFilter(f);
    });
  applyFilters();
});

var basemap = L.tileLayer(
  "https://api.mapbox.com/styles/v1/ilabmedia/cj84s9bet10f52ro2lrna50yg/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaWxhYm1lZGlhIiwiYSI6ImNpbHYycXZ2bTAxajZ1c2tzdWU1b3gydnYifQ.AHxl8pPZsjsqoz95-604nw",
  {}
);

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

var client = new carto.Client({
  apiKey: "wSX_v1e4-P45ernhjNuLgg",
  username: "csis"
});

var url =
  window.location != window.parent.location
    ? document.referrer
    : document.location.href;

var href = /lang=([^&]+)/.exec(url);
var lang = href ? href[1] : null;

var languages = {
  "zh-hant": "china",
  "zh-hans": "china",
  vi: "vietnam",
  ms: "malaysia"
};

var nations = {
  unoccupied: "#CCCCCC",
  taiwan: "#F2B701",
  philippines: "#E73F74",
  china: "#3969AC",
  vietnam: "#11A579",
  malaysia: "#7F3C8D"
};

var nationSQL = {};
var nationStyle = {};
var nationLayer = {};
var featureHover = L.popup({ closeButton: false });
var svgUrL = "https://csis-ilab.github.io/amti-viz/features-map/images";
Object.keys(nations).forEach(nation => {
  nationSQL[nation] = new carto.source.SQL(
    `SELECT * FROM ${nation}_scs_islands`
  );
  nationStyle[nation] = new carto.style.CartoCSS(`
    #layer {
      marker-file: ramp([status],(url(${svgUrL}/low_tide.svg),url(${svgUrL}/rock.svg),url(${svgUrL}/submerged.svg)),("Low-tide elevation","Rock","Submerged"),"=");
      marker-width: ramp([status],(15,12,15),("Low-tide elevation","Rock","Submerged"),"=");
      marker-fill: ${nations[nation]};
      marker-line-color: #ffffff;
      marker-line-width: 1;
      marker-allow-overlap: true;
    }
`);

  nationLayer[nation] = new carto.layer.Layer(
    nationSQL[nation],
    nationStyle[nation],
    {
      featureOverColumns: [
        "name",
        "name_taiwan",
        "name_china",
        "name_vietnam",
        "name_malaysia",
        "name_philippines",
        "status",
        "date_of_occupation"
      ]
    }
  );

  nationLayer[nation].on(carto.layer.events.FEATURE_OVER, function(
    blockFeatureEvent
  ) {
    featureHover.setLatLng(blockFeatureEvent.latLng);

    var allowed = nationLayer[nation]["_featureOverColumns"];
    var data = blockFeatureEvent.data;
    var content = Object.keys(data)
      .filter(d => allowed.includes(d) && data[d])
      .map(d => {
        return `<div class="popupHeaderStyle">${d.replace(
          /_/g,
          " "
        )}</div><div class="popupEntryStyle">${data[d]}</div>`;
      })
      .join("");

    featureHover.setContent(`${content}`);
    featureHover.openOn(map);
  });

  nationLayer[nation].on(carto.layer.events.FEATURE_OUT, function(
    blockFeatureEvent
  ) {
    // featureHover.removeFrom(map);
  });

  client.addLayer(nationLayer[nation]);
});

client
  .getLeafletLayer()
  .bringToFront()
  .addTo(map);

document.querySelector("#query").addEventListener("keyup", function() {
  if (featureHover.isOpen()) featureHover.removeFrom(map);

  var q = document.querySelector("#query").value;
  var filterArray = [];

  Object.keys(nations).forEach(nation => {
    var columnArray = nationLayer[nation]["_featureOverColumns"];

    columnArray = columnArray.filter(ca => ca !== "date_of_occupation"); //exclude numeric data

    columnArray.forEach(function(c) {
      filterArray.push(capital(c, q), lower(c, q), upper(c, q));
    });

    var filters = new carto.filter.OR(filterArray);

    nationSQL[nation].getFilters().forEach(function(f) {
      return nationSQL[nation].removeFilter(f);
    });

    nationSQL[nation].addFilter(filters);
  });
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

  Object.keys(nations).forEach(nation => {
    nationSQL[nation].getFilters().forEach(function(f) {
      return nationSQL[nation].removeFilter(f);
    });
  });
});

document.querySelector(".occupiers").addEventListener("click", e => {
  featureHover.removeFrom(map);

  var checkbox = e.target.type === "checkbox" ? e.target : undefined;
  if (checkbox && checkbox.checked) {
    nationStyle[checkbox.name].setContent(`
      #layer {
        marker-file: ramp([status],(url(${svgUrL}/low_tide.svg),url(${svgUrL}/rock.svg),url(${svgUrL}/submerged.svg)),("Low-tide elevation","Rock","Submerged"),"=");
        marker-width: ramp([status],(15,12,15),("Low-tide elevation","Rock","Submerged"),"=");
        marker-fill: ${nations[checkbox.name]};
        marker-line-color: #ffffff;
        marker-line-width: 1;
        marker-allow-overlap: true;
      }
    `);
  } else if (checkbox) {
    nationStyle[checkbox.name].setContent(`
        #layer {}
          `);
  }
});

document.querySelector(".statuses").addEventListener("click", e => {
  if (featureHover.isOpen()) featureHover.removeFrom(map);

  var checkbox = e.target.type === "checkbox" ? e.target : undefined;
  if (checkbox) {
    var checkboxes = Array.from(
      document.querySelectorAll(".statuses input:checked")
    );

    var names = checkboxes.map(c => `'${c.name}'`).join(",");
    names = names ? names : `' '`;

    Object.keys(nations).forEach(nation => {
      nationSQL[nation].setQuery(
        `SELECT * FROM ${nation}_scs_islands WHERE status IN (${names})`
      );
    });
  }
});

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
        makeGroups(_this);

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

      widgets.forEach((w, x) => {
        if (w.legendReferenceSheetId) {
          fetch(
            dataURL +
              spreadsheetID +
              "/" +
              w.legendReferenceSheetId +
              "/public/values?alt=json"
          )
            .then(function(response) {
              return response.json();
            })
            .then(function(json) {
              var legendData = parseLegendData(json.feed.entry, w.style);
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

                  var dropdownOptions = {
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
                            '<svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg"><g fill="#000" fill-rule="evenodd"><path d="M2.592.044l18.364 18.364-2.548 2.548L.044 2.592z"/><path d="M0 18.364L18.364 0l2.548 2.548L2.548 20.912z"/><path d="M0 18.364L18.364 0l2.548 2.548L2.548 20.912z"/><path d="M0 18.364L18.364 0l2.548 2.548L2.548 20.912z"/>';

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
                            '")><path d="M0 18.364L18.364 0l2.548 2.548L2.548 20.912z"/> ' +
                            data.label +
                            '<button style="border-left: 1px solid ' +
                            color +
                            "; background-image: url('data:image/svg+xml;base64," +
                            window.btoa(remove) +
                            '\')" type="button" class="choices__button" data-button="" aria-label="Remove item">Remove item<path d="M0 18.364L18.364 0l2.548 2.548L2.548 20.912z"/><path d="M0 18.364L18.364 0l2.548 2.548L2.548 20.912z"/>';
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
                            "' /><path d="M0 18.364L18.364 0l2.548 2.548L2.548 20.912z"/>";

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
                            '")><path d="M0 18.364L18.364 0l2.548 2.548L2.548 20.912z"/> ' +
                            data.label +
                            " <path d="M0 18.364L18.364 0l2.548 2.548L2.548 20.912z"/> ";

                          return template(markup);
                        }
                      };
                    }
                  };

                  break;
                case "checkbox":
                  Object.keys(widgets[x].keys).forEach((key, y) => {
                    var svg =
                      "<svg  xmlns='http://www.w3.org/2000/svg'><circle cx='6' cy='6' r='5' stroke='" +
                      defaultColor +
                      "'  fill='" +
                      defaultColor +
                      "' /><path d="M0 18.364L18.364 0l2.548 2.548L2.548 20.912z"/>";

                    boxContent +=
                      '<li><label for="' +
                      widgets[x].keys[key].value +
                      '"><input class="widget ' +
                      widgets[x].type +
                      '" type="checkbox" name="' +
                      widgets[x].keys[key].value +
   ...</label></li>

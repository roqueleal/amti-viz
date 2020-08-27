"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}

_asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var map;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            _context.next = 2;
            return makeMap({
              mapID: "chinapower",
              googleSheet: "1YIL0jtAK3Btc5JfbgHX0pGV-L4Bgxo6YtUfEX2vvryQ",
              mapboxStyle:
                lang && lang.indexOf("zh-") > -1
                  ? "citui3waw00162jo1zcsf1urj"
                  : "cj84s9bet10f52ro2lrna50yg",
              onEachFeature: {
                mouseover: function mouseover(e) {
                  this.openPopup(e.latlng);
                },
              },
              formatPopupContent: function formatPopupContent(feature, map) {
                var suffix = lang ? "_" + lang : "";
                suffix = suffix.replace("-", "_");
                var name = feature.properties["name" + suffix];
                var description = feature.properties["description" + suffix];
                var outpost = feature.properties.chinese_outposts;

                return (
                  '<div class="popupEntryStyle">' +
                  (!lang ? outpost : "") +
                  (name && outpost && !lang ? "" : "") +
                  (name !== outpost ? name : "") +
                  "</div>" +
                  '<div class="popupEntryStyle">' +
                  description +
                  "</div>"
                );
              },
            });

          case 2:
            map = _context.sent;

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })
)();

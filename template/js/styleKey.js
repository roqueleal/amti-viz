function styleKey(options) {
  var keyColor;
  var dashArray;
  var colors;
  switch (options.key.form) {
    case "line":
      keyColor = options.key.color ? options.key.color : options.color;

      if (options.forms) {
        var svg;
        switch (options.index) {
          case 0:
            colors = [
              keyColor ? keyColor : chroma(defaultColor).darken(),
              color ? color : chroma(defaultColor).darken()
            ];
            break;
          case 1:
            colors = [
              keyColor ? keyColor : chroma(defaultColor).darken(),
              "#ffffff"
            ];
            break;
          case 2:
            colors = ["#000000", keyColor ? keyColor : defaultColor];
            break;
          case 3:
            colors = [
              "#ffffff",
              keyColor ? keyColor : chroma(defaultColor).darken()
            ];
            break;
          default:
            colors = [
              keyColor ? keyColor : chroma(defaultColor).darken(),
              keyColor ? keyColor : chroma(defaultColor).darken()
            ];
            break;
        }

        svg =
          "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 12'><line x1='0' x2='48' y1='50%' y2='50%' stroke='" +
          colors[0] +
          "' stroke-width='" +
          lineWeights[i][0] +
          "' stroke-linecap='square' stroke-dasharray='" +
          (i === 4 ? "18,12" : lineDashArrays[i][0]) +
          "'/><line x1='0' x2='48' y1='50%' y2='50%' stroke='" +
          colors[1] +
          "' stroke-width='" +
          lineWeights[i][1] +
          "' stroke-linecap='square' stroke-dasharray='" +
          (i === 4 ? "18,12" : lineDashArrays[i][1]) +
          "'/></svg>";
      } else {
        svg =
          "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 12'><line x1='0' x2='48' y1='50%' y2='50%' stroke='" +
          keyColor +
          "' stroke-width='" +
          3 +
          "' stroke-linecap='square' stroke-dasharray='" +
          "7,3" +
          "'/></svg>";
      }
      return {
        svg: "data:image/svg+xml;base64," + window.btoa(svg),
        class: "line"
      };
    case "icon":
      keyColor = options.key.color;
      var svg = options.key.icon
        ? options.key.icon
        : "data:image/svg+xml;base64," +
          window.btoa(
            '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="6" r="5" fill="' +
              keyColor +
              '"/></svg>'
          );

      return {
        svg: svg,
        class: options.key.icon ? "icon" : "color"
      };
    case "shape":
      if (options.feature) {
        var colorKeyWidget = options.map.widgets.find(function(w) {
          return w.type === "color";
        });

        var colorKey = colorKeyWidget.keys.find(function(k) {
          return (
            k.value.toLowerCase() ===
            options.feature.properties[colorKeyWidget.field].toLowerCase()
          );
        });

        keyColor = colorKey
          ? colorKey.color
          : options.color
            ? options.color
            : null;
      }

      var svg;
      switch (options.index) {
        case 0:
          svg =
            '<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rainbow"  y1="4.5" x2="9" y2="4.5" gradientUnits="userSpaceOnUse" gradientTransform="translate(4.5 -4.5) rotate(135)"><stop offset="0" stop-color="#7f3c8d"/><stop offset="0.325" stop-color="#e73f74"/><stop offset="0.5" stop-color="#f2b701"/><stop offset="0.675" stop-color="#11a579"/><stop offset="1" stop-color="#3969ac"/></linearGradient></defs><rect x="3.25" y="1.75" width="9" height="9" transform="translate(4.5 -4.5) rotate(45)" ' +
            (keyColor ? 'paint-order="stroke" stroke="#ffffff"' : "") +
            ' fill="' +
            (keyColor ? keyColor : "url(#rainbow)") +
            '" /></svg>';
          break;
        case 1:
          svg =
            '<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rainbow" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3969ac"/><stop offset="0.25" stop-color="#11a579"/><stop offset="0.5" stop-color="#f2b701"/><stop offset="0.75" stop-color="#e73f74"/><stop offset="1" stop-color="#7f3c8d"/></linearGradient></defs><rect width="10" height="10" ' +
            (keyColor ? 'stroke="#ffffff"' : "") +
            ' fill="' +
            (keyColor ? keyColor : "url(#rainbow)") +
            '"/></svg>';
          break;
        case 2:
          svg =
            '<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rainbow" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3969ac"/><stop offset="0.325" stop-color="#11a579"/><stop offset="0.5" stop-color="#f2b701"/><stop offset="0.675" stop-color="#e73f74"/><stop offset="1" stop-color="#7f3c8d"/></linearGradient></defs><polygon points="6 10.39 0 10.39 3 5.2 6 0 9 5.2 12 10.39 6 10.39" ' +
            (keyColor ? 'paint-order="stroke" stroke="#ffffff"' : "") +
            ' fill="' +
            (keyColor ? keyColor : "url(#rainbow)") +
            '" /></svg>';
          break;
        default:
          svg =
            '<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rainbow" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3969ac"/><stop offset="0.25" stop-color="#11a579"/><stop offset="0.5" stop-color="#f2b701"/><stop offset="0.75" stop-color="#e73f74"/><stop offset="1" stop-color="#7f3c8d"/></linearGradient></defs><circle cx="6" cy="6" r="5" ' +
            (keyColor ? 'stroke="#ffffff"' : "") +
            ' fill="' +
            (keyColor ? keyColor : "url(#rainbow)") +
            '"/></svg>';
      }

      return {
        svg: "data:image/svg+xml;base64," + window.btoa(svg),
        class: "shape"
      };

    default:
      keyColor = options.key.color;
      var svg =
        "data:image/svg+xml;base64," +
        window.btoa(
          '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="6" r="5" fill="' +
            keyColor +
            '"/></svg>'
        );

      return {
        svg: svg,
        class: "color"
      };
  }
}

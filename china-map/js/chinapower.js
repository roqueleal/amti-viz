;(async function() {
  var map = await makeMap({
    googleSheet: '1R9J3haGLDsRPhtT1P1JvQL_XzaPZZsa33vBFO6xs6g4',
    mapID: 'chinapower',
    mapboxStyle:
      lang && lang.indexOf('zh-') > -1
        ? (mapboxStyle = 'citui3waw00162jo1zcsf1urj')
        : (mapboxStyle = 'cj84s9bet10f52ro2lrna50yg'),
    formatPopupContent: function(feature, map) {
      var prefix = lang ? '_' + lang : ''

      var name = feature.properties['name' + prefix]

      var description = feature.properties['description' + prefix]
        .replace(/<a href=/gi, '<a target="_blank" href=')
        .replace(/<\/a>/gi, externalLink + '</a>')

      var outpost = feature.properties.chinese_outposts
      return (
        '<div class="popupEntryStyle">' +
        outpost +
        (name && outpost ? '<br/>' : '') +
        (name !== outpost ? name : '') +
        (feature.properties.observed
          ? '<br/>(expected)'
          : feature.properties.observed === false
            ? '<br />(observed)'
            : '') +
        '</div>' +
        '<div class="popupEntryStyle">' +
        description +
        '</div>'
      )
    }
  })
  map.json[map.json.length - 1].features.forEach(json => {
    var myLines = json.geometry

    var myStyle = {
      color: 'red',
      weight: 5,
      opacity: 0.65
    }

    L.geoJSON(myLines, {
      style: myStyle
    }).addTo(map.leaflet)
  })
})()

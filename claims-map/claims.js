var mapboxStyle =
  lang && lang.indexOf('zh-') > -1
    ? (mapboxStyle = 'citui3waw00162jo1zcsf1urj')
    : (mapboxStyle = 'cj84s9bet10f52ro2lrna50yg')

makeMap({
  mapID: 'claims-map',
  googleSheet: '14MvucMac-lYCu0-2vD5tcxfCUqIJog2h4-REFkpH3Kw',
  'mapbox style': mapboxStyle,
  'ocean color': '#cad2d3',

  formatPopupContent: function(feature, map) {
    var prefix = lang ? '_' + lang : ''

    var name = feature.properties['name' + prefix]

    var description = feature.properties['description' + prefix]
      .replace(/<a href=/gi, '<a target="_blank" href=')
      .replace(/<\/a>/gi, externalLink + '</a>')

    return (
      '<div class="popupHeaderStyle">' +
      name +
      '</div><div class="popupEntryStyle">' +
      description +
      '</div>'
    )
  }
})

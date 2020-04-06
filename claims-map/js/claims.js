var mapboxStyle =
  lang && lang.indexOf('zh-') > -1
    ? (mapboxStyle = 'citui3waw00162jo1zcsf1urj')
    : (mapboxStyle = 'cj84s9bet10f52ro2lrna50yg')

makeMap({
  mapID: 'claims-map',
  googleSheet: '14MvucMac-lYCu0-2vD5tcxfCUqIJog2h4-REFkpH3Kw',
  'mapbox style': mapboxStyle,
  'ocean color': '#cad2d3',

  // makeDropdownOptions: function (options, x) {
  //   console.log(options)

  // },

  formatPopupContent: function (feature, map) {
    var suffix = lang ? '_' + lang.replace(/-/, '_') : ''

    var name = feature.properties['name' + suffix]

    var description = feature.properties['description' + suffix]
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

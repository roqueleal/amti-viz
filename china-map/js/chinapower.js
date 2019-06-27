;(async function() {
  var map = await makeMap({
    googleSheet: '1R9J3haGLDsRPhtT1P1JvQL_XzaPZZsa33vBFO6xs6g4',
    mapID: 'chinapower',
    mapboxStyle:
      lang && lang.indexOf('zh-') > -1
        ? (mapboxStyle = 'citui3waw00162jo1zcsf1urj')
        : (mapboxStyle = 'cj84s9bet10f52ro2lrna50yg'),
    onEachFeature: {
      mouseover: function mouseover(e) {
        this.openPopup(e.latlng)
      },
      mouseout: function mouseover(e) {
        // this.closePopup()
      }
    },
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
        '</div>' +
        '<div class="popupEntryStyle">' +
        description +
        '</div>'
      )
    }
  })
})()

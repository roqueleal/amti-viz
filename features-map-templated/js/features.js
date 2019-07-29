var mapboxStyle =
  lang && lang.indexOf('zh-') > -1
    ? (mapboxStyle = 'citui3waw00162jo1zcsf1urj')
    : (mapboxStyle = 'cj84s9bet10f52ro2lrna50yg')

makeMap({
  mapID: 'features-map',
  externalLinkText: 'View on the Island Tracker',
  googleSheet: '1REFNJ8WZ9fOzShYC8SpUJ7pZQEMkWlqzC2KpMb-wSyc',
  mapboxstyle: mapboxStyle,
  formatPopupContent: function(feature, map) {
    var content

    var ignoredHeaders = [
      'cartodb_id',
      'latitude',
      'longitude',
      'occupier',
      'hyperlink',
      'status',
      'picture',
      'date_of_occupation',
      'occupation_status',
      'type'
    ]

    var description = Object.keys(feature.properties)
      .map(function(p) {
        if (feature.properties[p])
          return ignoredHeaders.indexOf(p) < 0
            ? '<div class="popupHeaderStyle">' +
                p.replace(/_/g, ' ') +
                '</div><div class="popupEntryStyle">' +
                feature.properties[p] +
                '</div>'
            : ''
      })
      .filter(function(p) {
        return p
      })
      .join('')

    var link = feature.properties.hyperlink

    var islandTracker =
      feature.properties.hyperlink.trim().length > 1
        ? '<div class="separator"></div><div class="islandTracker popupEntryStyle"><a href=' +
          link +
          ' target="_blank">' +
          'View on the Island Tracker' +
          '</a>' +
          externalLink +
          '</div>'
        : ''

    content = description + islandTracker
    if (lang) {
      var translatableStrings = Object.keys(translations).sort(function(a, b) {
        return b.length - a.length
      })
      translatableStrings.forEach(function(t) {
        var re = new RegExp('\\b(' + RegExp.escape(t) + ')', 'gi')
        content = content.replace(re, translations[t])
      })
    }

    return content
  }
})

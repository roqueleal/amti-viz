var mapboxStyle =
  lang && lang.indexOf('zh-') > -1
    ? (mapboxStyle = 'citui3waw00162jo1zcsf1urj')
    : (mapboxStyle = 'cj84s9bet10f52ro2lrna50yg')

  makeMap({
    mapID: 'ior-features',
    googleSheet: '1Ufl17XKxYYY7fz9PtwMAAvVXwASzwJG4EF5ojImIxMU',
    mapboxstyle: mapboxStyle,
    formatPopupContent: function(feature, map) {
      var content

      var ignoredHeaders = [
        'cartodb_id',
        'latitude',
        'longitude'
      ]

      var description = Object.keys(feature.properties)
        // .map(function(p) {
          // if (feature.properties[p])
          //   return ignoredHeaders.indexOf(p) < 0
          //     ? '<div class="popupHeaderStyle">' +
          //         p.replace(/_/g, ' ') +
          //         '</div><div class="popupEntryStyle">' +
          //         feature.properties[p] +
          //         '</div>'
          //     : ''
        // })
        // .filter(function(p) {
        //   return p
        // })
        // .join('')

      // content = description 
      // if (lang) {
      //   var translatableStrings = Object.keys(translations).sort(function(a, b) {
      //     return b.length - a.length
      //   })
      //   translatableStrings.forEach(function(t) {
      //     var re = new RegExp('\\b(' + RegExp.escape(t) + ')', 'gi')
      //     content = content.replace(re, translations[t])
      //   })
      // }

      return content
    }
  })


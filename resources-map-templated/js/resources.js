var mapboxStyle =
  lang && lang.indexOf('zh-') > -1
    ? (mapboxStyle = 'citui3waw00162jo1zcsf1urj')
    : (mapboxStyle = 'cj84s9bet10f52ro2lrna50yg')

makeMap({
  mapID: 'resources-map',
  googleSheet: '11rUaoISSkqakEKZ6hi4xeVbbiEnfPi1qsRoq4r0SrPA',
  mapboxstyle: mapboxStyle,
  onEachFeature: {
    click: function click(e) {
      var allowed = [
        'name',
        'resource_type',
        'license_status',
        'production_status',
        'operator'
      ]

      var stakeHolders = formatStakeholders(e.target.feature.properties)
      var content = Object.keys(e.target.feature.properties)
        .filter(function(d) {
          return allowed.includes(d)
        })
        .map(function(d) {
          return e.target.feature.properties[d].trim()
            ? '<div class="popupHeaderStyle">' +
                d.replace(/_/g, ' ') +
                '</div><div class="popupEntryStyle">' +
                e.target.feature.properties[d] +
                '</div>'
            : ''
        })
        .join('')

      content += '' + stakeHolders

      if (lang) {
        var translatableStrings = Object.keys(translations).sort(function(
          a,
          b
        ) {
          return b.length - a.length
        })
        translatableStrings.forEach(function(t) {
          var re = new RegExp('\\b(' + RegExp.escape(t) + ')', 'gi')
          content = content.replace(re, translations[t])
        })
      }

      this.bindPopup(content)

      this.openPopup()
    },
    mouseover:
      window.innerWidth > 768
        ? function mouseover(e) {
            var content =
              '<div class="popupHeaderStyle">name</div><div class="popupEntryStyle">' +
              e.target.feature.properties.name +
              '</div>'

            if (lang) {
              var translatableStrings = Object.keys(translations).sort(function(
                a,
                b
              ) {
                return b.length - a.length
              })
              translatableStrings.forEach(function(t) {
                var re = new RegExp('\\b(' + RegExp.escape(t) + ')', 'gi')
                content = content.replace(re, translations[t])
              })
            }

            this.bindPopup(content)

            this.openPopup()
          }
        : null
  }
})

function formatStakeholders(data) {
  var partnerColKeys = Object.keys(data).filter(function(k) {
    return k.indexOf('partner') > -1
  })

  var stakeholderArray = []

  partnerColKeys.forEach(function(k) {
    stakeholderArray.push(data[k])
  })

  var stakeholderString = ''

  stakeholderArray = stakeholderArray.filter(function(s) {
    return typeof s === 'string' && !!s.trim()
  })

  switch (true) {
    case stakeholderArray.length === 1:
      return (
        '<div class="popupHeaderStyle">Stakeholders</div>\n      <div class="popupEntryStyle">' +
        stakeholderArray[0] +
        '</div>'
      )
      break
    case stakeholderArray.length > 1:
      stakeholderLIs = stakeholderArray.map(function(s) {
        return '<li>' + s + '</li>'
      })
      return (
        '<div class="popupHeaderStyle">Stakeholders</div>\n      <div class="popupEntryStyle">\n      <ul>' +
        stakeholderLIs.join('') +
        '</ul>\n      </div>'
      )

      break
    default:
      return ''
  }
}

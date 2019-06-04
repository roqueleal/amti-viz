function _typeof(obj) {
  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    _typeof = function _typeof(obj) {
      return typeof obj
    }
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === 'function' &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? 'symbol'
        : typeof obj
    }
  }
  return _typeof(obj)
}

if (typeof window.CustomEvent !== 'function') {
  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined }
    var evt = document.createEvent('CustomEvent')
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
    return evt
  }

  CustomEvent.prototype = window.Event.prototype

  window.CustomEvent = CustomEvent
}

var url =
  window.location != window.parent.location
    ? document.referrer
    : document.location.href
var href = /lang=([^&]+)/.exec(url)
var lang = href ? href[1] : null
var mapId = 0

function CustomMap(container, properties) {
  this.id = mapId++
  this.filters = []
  this.groups = []
  this.json = []
  this.leaflet

  var _this = this

  Object.keys(properties).forEach(function(property) {
    _this[property.toLowerCase().replace(/ /g, '')] = properties[property]
  })
  _this.popupcontent =
    _this.popupcontent && typeof _this.popupcontent === 'string'
      ? _this.popupcontent.split(',')
      : _this.popupcontent && _typeof(_this.popupcontent) === 'object'
        ? _this.popupcontent
        : []
  _this.popupheaders =
    _this.popupheaders && typeof _this.popupheaders === 'string'
      ? _this.popupheaders.split(',')
      : _this.popupheaders && _typeof(_this.popupheaders) === 'object'
        ? _this.popupheaders
        : []
  CustomMap.all = CustomMap.all || []
  CustomMap.all.push(this)

  _this.resetFilters = function() {
    _this.filters = []
  }

  _this.removeGroups = function() {
    _this.groups.forEach(function(group) {
      _this.leaflet.removeLayer(group)
    })

    _this.groups = []
  }

  this.render = function() {
    _this.leaflet = L.map(container, {
      minZoom: _this.minzoom || null,
      maxZoom: _this.maxzoom || 20,
      maxBounds: _this.maxbounds || [_this.swbounds, _this.nebounds],
      scrollWheelZoom: window.innerWidth < 768 ? false : true,
      zoomControl:
        !_this.hasOwnProperty('zoomslider') || _this.zoomslider ? false : true,
      attributionControl: false
    })

    if (_this.loadEvent) _this.leaflet.on('load', _this.loadevent)
    if (_this.addEvent) _this.leaflet.on('layeradd', _this.addevent)
    this.leaflet.setView(_this.center, _this.zoom || 2)
    L.tileLayer(
      'https://api.mapbox.com/styles/v1/ilabmedia/' +
        _this.mapboxstyle +
        '/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaWxhYm1lZGlhIiwiYSI6ImNpbHYycXZ2bTAxajZ1c2tzdWU1b3gydnYifQ.AHxl8pPZsjsqoz95-604nw',
      {}
    ).addTo(_this.leaflet)

    if (!_this.hasOwnProperty('zoomslider') || _this.zoomslider) {
      L.control.zoomslider().addTo(_this.leaflet)
    }

    if (!_this.hasOwnProperty('fullscreen') || _this.fullscreen) {
      window.fullscreen = new L.Control.Fullscreen()

      _this.leaflet.addControl(window.fullscreen)
    }

    L.control
      .attribution({
        position: 'bottomleft'
      })
      .setPrefix(_this.attribution)
      .addTo(_this.leaflet)

    _this.resetFilters()

    return _this
  }
}

var leafletLoaded = 0

var primaryJsFiles = [
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
  'https://unpkg.com/whatwg-fetch@3.0.0/dist/fetch.umd.js'
]

var secondaryJsFiles = [
  'https://unpkg.com/leaflet.zoomslider@0.7.1/src/L.Control.Zoomslider.js',
  'https://unpkg.com/leaflet-fullscreen@1.0.2/dist/Leaflet.fullscreen.min.js',
  'https://unpkg.com/chroma-js@2.0.3/chroma.min.js',
  'https://csis-ilab.github.io/map-templates/dist/js/vendor/A11y-Dialog.js',
  'https://unpkg.com/choices.js@7.0.0/public/assets/scripts/choices.min.js',
  'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js',
  'https://csis-ilab.github.io/map-templates/dist/js/vendor/patterns.js',
  'https://csis-ilab.github.io/map-templates/dist/js/vendor/latinize.js'
]

function handleLoadLeaflet() {
  return new Promise(function(resolve, reject) {
    secondaryJsFiles.forEach(function(file) {
      var head = document.head
      var jsLink = document.createElement('script')
      jsLink.src = file
      head.appendChild(jsLink)

      jsLink.onload = function() {
        leafletLoaded++

        if (leafletLoaded === secondaryJsFiles.length + primaryJsFiles.length) {
          resolve(leafletLoaded)
          return leafletLoaded
        }
      }
    })
  })
}

async function importFiles() {
  return new Promise(function(resolve, reject) {
    var cssFiles = [
      'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600',
      'https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,700',
      'https://csis-ilab.github.io/map-templates/dist/css/vendor.css',
      'https://csis-ilab.github.io/map-templates/dist/css/style.css'
    ]
    cssFiles.forEach(function(file) {
      var head = document.head
      var cssLink = document.createElement('link')
      cssLink.rel = 'stylesheet'
      cssLink.href = file
      head.insertBefore(cssLink, Array.from(head.childNodes)[0])
    })

    primaryJsFiles.forEach(function(file) {
      var head = document.head
      var jsLink = document.createElement('script')
      jsLink.src = file
      jsLink.onload = function() {
        leafletLoaded++

        if (leafletLoaded === primaryJsFiles.length) {
          handleLoadLeaflet()
          resolve(leafletLoaded)
          return leafletLoaded
        }
      }
      head.appendChild(jsLink)
    })
  })
}

async function makeMap(options) {
  if (!leafletLoaded) {
    return await importFiles().then(async function(scriptsLoaded) {
      return await init(options)
    })
  } else {
    return await init(options)
  }
}

async function init(options) {
  var dataURL = 'https://spreadsheets.google.com/feeds/list/'
  window.defaultColor =
    options.oceancolor || options.oceanColor || options['ocean color']
  var translations

  if (lang) {
    fetch(dataURL + options.googleSheet + '/' + 3 + '/public/values?alt=json')
      .then(function(response) {
        return response.json()
      })
      .then(async function(json) {
        translations = parseLanguageData(json.feed.entry)
        return await initWithSpreadsheet(dataURL, options, translations)
      })
  } else if (options.googleSheet) {
    return await initWithSpreadsheet(dataURL, options)
  } else {
    return await initWithoutSpreadsheet(options)
  }
}

async function initWithoutSpreadsheet(options, translations) {
  options.slug = options.mapID.toLowerCase().replace(/ /g, '-')
  options.translations = translations
  makeNodes(options)
  var container = document.querySelector('#' + options.slug + '__map.map')

  if (options.formatToolbox) {
    var map = new CustomMap(container, options).render()
    return new Promise(function(resolve, reject) {
      return fetch(
        'https://csis.carto.com/api/v2/sql?api_key=' +
          map.apikey +
          '&format=geojson&q=SELECT%20*%20FROM%20' +
          map.table
      )
        .then(function(resp) {
          return resp.json()
        })
        .then(function(json) {
          map.json = [json]
          var box = document.querySelector('#' + options.slug + ' #controls')
          map.formatToolbox(box)
          makeGroups(map)
          resolve(map)
        })
    })
  } else {
    return new Promise(function(resolve, reject) {
      return fetch(
        'https://csis.carto.com/api/v2/sql?api_key=' +
          (options.apikey || options.apiKey || options['api key']) +
          '&format=geojson&q=SELECT%20*%20FROM%20' +
          options.table
      )
        .then(function(resp) {
          return resp.json()
        })
        .then(async function(json) {
          options.json = [json]
          var box = document.querySelector('#' + options.slug + ' #controls')
          var boxContent = ''
          var map

          if (options.widgets) {
            map = await makeWidgets(null, options, boxContent)
          } else {
            var map = new CustomMap(container, options).render()
            makeGroups(map)
            var box = document.querySelector('#' + options.slug + ' #controls')
            box.innerHTML = ''
          }

          if (options.footer && options.footer.trim()) {
            var footerNode = document.createElement('footer')
            footerNode.innerHTML =
              options.footer + '  <div class="hidden"></div>'
            var penUltimateNode =
              document.querySelector('#' + options.slug + ' #controls') ||
              document.querySelector('#' + options.slug + 'header')
            penUltimateNode.parentNode.insertBefore(
              footerNode,
              penUltimateNode.nextSibling
            )
          }

          resolve(map)
        })
    })
  }
}

async function initWithSpreadsheet(dataURL, options, translations) {
  var map
  return new Promise(function(resolve, reject) {
    return fetch(
      dataURL + options.googleSheet + '/' + 2 + '/public/values?alt=json'
    )
      .then(function(response) {
        return response.json()
      })
      .then(function(json) {
        var metaData = parseMetaData(json.feed.entry)
        var widgets = getWidgets(metaData)
        var properties = {}
        Object.keys(metaData).forEach(function(data) {
          properties[data] = metaData[data]
        })
        Object.keys(options).forEach(function(data) {
          properties[data] = options[data]
        })
        properties.center =
          typeof properties.center === 'string'
            ? properties.center.split(',')
            : properties.center
              ? properties.center
              : [0, 0]
        properties.swbounds =
          typeof properties.swbounds === 'string'
            ? properties.swbounds.split(',')
            : properties.swbounds
              ? properties.swbounds
              : [-90, -180]
        properties.nebounds =
          typeof properties.nebounds === 'string'
            ? properties.nebounds.split(',')
            : properties.nebounds
              ? properties.nebounds
              : [90, 180]
        properties.slug = properties.mapID.toLowerCase().replace(/ /g, '-')
        properties.translations = translations
        properties.widgets = widgets
        makeNodes(properties)
        var referenceSheets = widgets.filter(function(w) {
          return w.reference
        })

        if (referenceSheets) {
          var boxContent = ''
          var referenceSheetURLS = widgets
            .map(function(w) {
              if (w.reference) {
                return (
                  dataURL +
                  options.googleSheet +
                  '/' +
                  w.reference +
                  '/public/values?alt=json'
                )
              }
            })
            .filter(function(u) {
              return u
            })
          Promise.all(
            referenceSheetURLS.map(function(url) {
              return fetch(url)
            })
          )
            .then(function(responses) {
              return Promise.all(
                responses.map(function(response) {
                  return response.json()
                })
              )
            })
            .then(async function(jsons) {
              map = await makeWidgets(jsons, properties, boxContent)

              if (properties.footer && properties.footer.trim()) {
                var footerNode = document.createElement('footer')
                footerNode.innerHTML =
                  properties.footer + '  <div class="hidden"></div>'
                var penUltimateNode =
                  document.querySelector(
                    '#' + properties.slug + ' #controls'
                  ) || document.querySelector('#' + properties.slug + 'header')
                penUltimateNode.parentNode.insertBefore(
                  footerNode,
                  penUltimateNode.nextSibling
                )
              }

              resolve(map)
            })
        } else {
          resolve(map)
        }
      })
  })
}

function getWidgets(metaData) {
  var widgets = []

  function process(k, index, property) {
    if (k.toLowerCase().indexOf(property) > -1)
      widgets[index - 1][property] = convertType(metaData[k])
  }

  var properties = [
    'input',
    'field',
    'grouping',
    'instructions',
    'maximum',
    'type',
    'reference',
    'style'
  ]
  Object.keys(metaData)
    .filter(function(k) {
      return k.toLowerCase().indexOf('widget') > -1
    })
    .forEach(function(k) {
      var index = k.match(/\d+/)[0]
      widgets[index - 1] = widgets[index - 1] || {}
      properties.forEach(function(property) {
        process(k, index, property)
      })
    })
  widgets.forEach(function(w, i) {
    w.field = w.field.replace(/ /g, '_')
    w.id = i
  })
  return widgets
}

function makeNodes(options) {
  var newSectionHTML = ''
  newSectionHTML += '<section id="' + options.slug + '">'
  newSectionHTML += '<div id="' + options.slug + '__map" class="map"></div>'
  newSectionHTML += '<aside class="toolbox">'
  newSectionHTML += options.title
    ? '<input type="checkbox" checked class="ui mobile-only"><div class="hamburger mobile-only"><div class="icon"> <span></span> <span></span> <span></span></div><div class="menu translate"></div></div>'
    : ''
  newSectionHTML += '<div class="box">'
  newSectionHTML +=
    options.title || options.logo || options.description
      ? '<header  class="translate"> <h1><a target="_blank" id="logo"></a></h1>  <p class="translate"></p></header>'
      : ''
  newSectionHTML +=
    (options.instructions
      ? '<p class="translate">' + options.instructions + '</p>'
      : '') +
    '<div id="controls"><div class="loader"></div></div><footer><div class="hidden"></div></footer></div></aside>'
  newSectionHTML += options.titlecardcontent
    ? '<button id="' +
      options.slug +
      '__about" class="about-trigger">ABOUT THIS MAP</button>'
    : ''
  newSectionHTML += '</section>'
  document.body.innerHTML += newSectionHTML

  if (options.titlecardcontent) {
    var newDialogHTML = ''
    newDialogHTML += '<div class="dialog" id="' + options.slug + '__dialog">'
    newDialogHTML +=
      '<div class="dialog-overlay" tabindex="-1" data-a11y-dialog-hide></div>'
    newDialogHTML +=
      '<dialog class="dialog-content" aria-labelledby="dialogTitle" aria-describedby="dialogContent">'
    newDialogHTML +=
      '<button data-a11y-dialog-hide class="dialog-close" aria-label="Close this dialog window">&times;</button>'
    newDialogHTML += options.titlecardtitle
      ? '<h1 id="dialogTitle">' + options.titlecardtitle + '</h1>'
      : ''
    newDialogHTML +=
      '<div id="dialogContent">' + options.titlecardcontent + '</div>'
    newDialogHTML += '</dialog>'
    newDialogHTML += '</div>'
    document.body.innerHTML += newDialogHTML
    document.body.style.overflow = 'hidden'
    var dialogEl = document.getElementById(options.slug + '__dialog')
    var mainEl = document.getElementById('options.slug')
    var dialogTrigger = document.getElementById(options.slug + '__about')
    var dialogBox = new window.A11yDialog(dialogEl, mainEl)
    var dialog = dialogBox.dialog
    dialogBox.show()
    dialogBox.on('hide', function(dialogEl) {
      dialogTrigger.style.display = 'block'
    })
    dialogBox.on('show', function(dialogEl) {
      dialogTrigger.style.display = 'none'
    })
    dialogTrigger.addEventListener('click', function() {
      dialogBox.show()
    })
  }

  document.title = options.title + ' | CSIS ' + options.program
  var metaLocaleOG = document.createElement('meta')
  metaLocaleOG.setAttribute('property', 'og:locale')
  metaLocaleOG.setAttribute('content', 'en_US')
  document.head.appendChild(metaLocaleOG)
  var metaTypeOG = document.createElement('meta')
  metaTypeOG.setAttribute('property', 'og:type')
  metaTypeOG.setAttribute('content', 'article')
  document.head.appendChild(metaTypeOG)
  var metaWidthOG = document.createElement('meta')
  metaWidthOG.setAttribute('property', 'og:image:width')
  metaWidthOG.setAttribute('content', '2000')
  document.head.appendChild(metaWidthOG)
  var metaHeightOG = document.createElement('meta')
  metaHeightOG.setAttribute('property', 'og:image:height')
  metaHeightOG.setAttribute('content', '1333')
  document.head.appendChild(metaHeightOG)
  var metaTwitterCardOG = document.createElement('meta')
  metaTwitterCardOG.setAttribute('property', 'twitter:card')
  metaTwitterCardOG.setAttribute('content', 'summary')
  document.head.appendChild(metaTwitterCardOG)
  var metaTitleOG = document.createElement('meta')
  metaTitleOG.setAttribute('property', 'og:title')
  metaTitleOG.setAttribute(
    'content',
    options.title + ' | CSIS ' + options.program
  )
  document.head.appendChild(metaTitleOG)
  var metaTitleTwitter = document.createElement('meta')
  metaTitleTwitter.setAttribute('property', 'twitter:title')
  metaTitleTwitter.setAttribute(
    'content',
    options.title + ' | CSIS ' + options.program
  )
  document.head.appendChild(metaTitleTwitter)
  var metaDescriptionOG = document.createElement('meta')
  metaDescriptionOG.setAttribute('property', 'og:description')
  metaDescriptionOG.setAttribute('content', options.description)
  document.head.appendChild(metaDescriptionOG)
  var metaDescriptionTwitter = document.createElement('meta')
  metaDescriptionTwitter.setAttribute('property', 'twitter:description')
  metaDescriptionTwitter.setAttribute('content', options.description)
  document.head.appendChild(metaDescriptionTwitter)
  var metaImageOG = document.createElement('meta')
  metaImageOG.setAttribute('property', 'og:image')
  metaImageOG.setAttribute('content', options.screenshot)
  document.head.appendChild(metaImageOG)
  var metaImageTwitter = document.createElement('meta')
  metaImageTwitter.setAttribute('property', 'twitter:image')
  metaImageTwitter.setAttribute('content', options.screenshot)
  document.head.appendChild(metaImageTwitter)

  if (document.querySelector('#' + options.slug + ' header')) {
    document.querySelector('#' + options.slug + ' .menu').innerText =
      options.title
    document.querySelector('#' + options.slug + ' header h1').innerHTML +=
      options.title
    document.querySelector(
      '#' + options.slug + ' header a'
    ).style.backgroundImage = options.logo ? 'url(' + options.logo + ')' : ''
    document.querySelector(
      '#' + options.slug + ' header a'
    ).href = options.website ? options.website : ''
    document.querySelector(
      '#' + options.slug + ' header p'
    ).innerText = options.description ? options.description : ''
  }
}

function makeWidgetContent(options, x) {
  var widgetNodes = ''
  var dropdownOptions

  switch (options.widgets[x].input) {
    case 'toggle':
      widgetNodes +=
        '<label for="toggle_' +
        options.widgets[x].field +
        '" class="translate"><input type="radio" name="' +
        options.widgets[x].field +
        '" id="toggle_' +
        options.widgets[x].field +
        '"  value="1" checked>Show</label>'
      widgetNodes +=
        '<label for="$toggle_' +
        options.widgets[x].field +
        '" class="translate"><input type="radio" name="' +
        options.widgets[x].field +
        '" id="toggle_' +
        options.widgets[x].field +
        '" value="0" >Hide</label>'
      break

    case 'search':
      widgetNodes +=
        '<input type="text" id="search_' +
        options.widgets[x].field +
        '" placeholder="' +
        options.widgets[x].instructions +
        '" size="10" />'
      widgetNodes +=
        '<button type="button" id="resetButton" class="translate">Reset</button>'
      break

    case 'dropdown':
      widgetNodes +=
        '<select id="dropdown_' +
        options.widgets[x].field +
        '" placeholder="' +
        options.widgets[x].instructions +
        '" multiple=""></select>'
      dropdownOptions = makeDropdownOptions(options, x)
      break

    case 'checkbox':
      widgetNodes += '<ul>'
      var keyStyle
      var legendItems = options.widgets[x].grouping
        ? options.widgets[x].keys.groupBy('group')
        : options.widgets[x].keys.groupBy('label')
      Object.keys(legendItems).forEach(function(group, i) {
        switch (options.widgets[x].type) {
          case 'form':
            var forms = options.widgets[x].keys.map(function(f) {
              return f.value
            })
            var styleOptions = {
              group: legendItems[group],
              index: i,
              forms: forms,
              map: options
            }
            keyStyle = styleKey(styleOptions)
            break

          case 'color':
            var styleOptions = {
              map: options,
              group: legendItems[group]
            }
            keyStyle = styleKey(styleOptions)
            break
        }

        widgetNodes +=
          '<li><label for="' +
          group +
          '"><input class="widget ' +
          options.widgets[x].input +
          '" type="checkbox" name="' +
          (options.widgets[x].grouping ? group : legendItems[group][0].value) +
          '" id="' +
          group +
          '" ' +
          (legendItems[group][0].selected ? 'checked' : '') +
          ' ><span class="' +
          keyStyle.class +
          'Key" ' +
          'style="background-image: url(\'' +
          keyStyle.svg +
          '")></span><span class="itemText">' +
          capitalize(group) +
          '</span></label></li>'
      })
      widgetNodes += '</ul>'
      break

    default:
      widgetNodes += '<ul>'
      var keyStyle
      var legendItems = options.widgets[x].grouping
        ? options.widgets[x].keys.groupBy('group')
        : options.widgets[x].keys.groupBy('label')
      Object.keys(legendItems).forEach(function(group, i) {
        switch (options.widgets[x].type) {
          case 'form':
            var forms = options.widgets[x].keys.map(function(f) {
              return f.value
            })
            var styleOptions = {
              group: legendItems[group],
              index: i,
              forms: forms,
              map: options
            }
            keyStyle = styleKey(styleOptions)
            break

          case 'color':
            var styleOptions = {
              map: options,
              group: legendItems[group]
            }
            keyStyle = styleKey(styleOptions)
            break
        }

        widgetNodes +=
          '<li><span class="' +
          keyStyle.class +
          'Key" ' +
          'style="background-image: url(\'' +
          keyStyle.svg +
          '")></span><span class="itemText">' +
          capitalize(group) +
          '</span></li>'
      })
      widgetNodes += '</ul>'
      break
  }

  var widgetTitle =
    options.widgets[x].field === 'all'
      ? 'Search'
      : options.widgets[x].field.replace(/_/g, ' ')
  return {
    nodes: widgetNodes,
    title: widgetTitle,
    options: dropdownOptions
  }
}

function makeWidgets(jsons, options, boxContent) {
  var widgetContent = []
  options.widgets.forEach(function(w, x) {
    if (!w.hasOwnProperty('id')) w.id = x
    var legendData = w.reference
      ? parseLegendData(options, jsons[x].feed.entry, w.type)
      : w.keys
    options.widgets[x].keys = legendData
    widgetContent.push(makeWidgetContent(options, x))
    boxContent +=
      '<section class="widget ' +
      options.widgets[x].field +
      '"><h3 class="translate">' +
      widgetContent[x].title +
      '</h3>'
    boxContent += widgetContent[x].nodes
    boxContent += '</section>'
    var box = document.querySelector('#' + options.slug + ' #controls')
    box.innerHTML = boxContent
    var labelText = document.querySelectorAll('#' + options.slug + ' .itemText')
    Array.from(labelText).forEach(function(itemText) {
      var height = itemText.offsetHeight
      var fontSize = window.getComputedStyle(itemText)['font-size']
      var offset = height / parseInt(fontSize.replace('px', ''), 10)
      itemText.style.transform = 'translateY(' + offset * 10 + '%)'
    })
  })
  var container = document.querySelector('#' + options.slug + ' .map')
  var map = new CustomMap(container, options).render()
  return new Promise(function(resolve, reject) {
    return fetch(
      'https://csis.carto.com/api/v2/sql?api_key=' +
        map.apikey +
        '&format=geojson&q=SELECT%20*%20FROM%20' +
        map.table
    )
      .then(function(resp) {
        return resp.json()
      })
      .then(function(json) {
        var colorKeyWidget = map.widgets.find(function(w) {
          return w.type === 'color'
        })
        map.json = [json]

        if (colorKeyWidget) {
          map.json = []
          var featureGroups = json.features.groupBy(
            colorKeyWidget.field,
            'properties'
          )
          Object.keys(featureGroups)
            .sort(function(a, b) {
              return featureGroups[b][0].properties[
                colorKeyWidget.field
              ].localeCompare(
                featureGroups[a][0].properties[colorKeyWidget.field]
              )
            })
            .map(function(feature) {
              map.json.push({
                type: 'FeatureCollection',
                features: featureGroups[feature]
              })
            })
        }

        if (!options.widgets.length) {
          makeGroups(map)
          var box = document.querySelector('#' + options.slug + ' #controls')
          box.innerHTML = ''
        }

        options.widgets.forEach(function(w, x) {
          var element = document.querySelector(
            '#' + options.slug + ' .widget.' + options.widgets[x].field
          )

          if (element.querySelector('select') && widgetContent[x].options) {
            new Choices(
              element.querySelector('select'),
              widgetContent[x].options
            )
          }

          if (element.querySelector("input[id^='search']")) {
            element
              .querySelector('#resetButton')
              .addEventListener('click', function() {
                handleReset(element, map, x)
              })
          }

          var selects = Array.from(element.querySelectorAll('select'))
          var checks = Array.from(
            element.querySelectorAll("input[type='checkbox']")
          )
          var search = Array.from(
            element.querySelectorAll("input[type='text']:not(.choices__input)")
          )
          var toggle = Array.from(
            element.querySelectorAll("input[type='radio']")
          )
          var inputs = selects
            .concat(checks)
            .concat(search)
            .concat(toggle) // if (!inputs.length) makeGroups(map)

          var initialized = 0

          var count = inputs.length
          inputs.forEach(function(input) {
            if (input.type === 'text') {
              input.addEventListener('keyup', function() {
                handleChange(
                  map,
                  element,
                  options.widgets,
                  x,
                  count,
                  ++initialized
                )
              })
            } else {
              input.addEventListener('change', function() {
                handleChange(
                  map,
                  element,
                  options.widgets,
                  x,
                  count,
                  ++initialized
                )
              })
            }

            if ('createEvent' in document) {
              var evt = document.createEvent('HTMLEvents')
              evt.initEvent('change', false, true)
              input.dispatchEvent(evt)
            } else {
              input.fireEvent('onchange')
            }

            w.map_id = map.id
          })
        })

        if (map.translations) {
          var translatableNodes = Array.from(
            document.querySelectorAll('.translate')
          )
          var translatableStrings = Object.keys(map.translations).sort(function(
            a,
            b
          ) {
            return b.length - a.length
          })
          translatableNodes.forEach(function(el, i) {
            translatableStrings.forEach(function(t) {
              if (Object.keys(map.translations[t]).length) {
                var re = new RegExp('\\b(' + RegExp.escape(t) + ')', 'gi')
                el.innerHTML = el.innerHTML.replace(re, map.translations[t])
              }
            })
          })
        }

        resolve(map)
      })
  })
}

function handleReset(element, map, x) {
  element.querySelector("input[type='text']").value = ''
  if (map.groups.length) map.removeGroups()

  map.filters[x] = function() {
    return true
  }

  makeGroups(map)
}

function handleChange(map, element, widgets, x, count, initialized) {
  var options = element.querySelector('select')
    ? Array.from(element.querySelector('select').options)
    : element.querySelector("input[type='text']")
      ? Array.from(element.querySelectorAll("input[type='text']"))
      : Array.from(element.querySelectorAll('input'))
  var selections = element.querySelector('select')
    ? Array.from(element.querySelector('select').options)
    : element.querySelector("input[type='text']")
      ? Array.from(element.querySelectorAll("input[type='text']"))
      : Array.from(element.querySelectorAll('input:checked'))
  var possibleChecks = Array.from(element.querySelectorAll('input')).map(
    function(o) {
      return o.name.toLowerCase()
    }
  )
  var possibleOptions = widgets[x].keys.map(function(key) {
    return key.value.toLowerCase()
  })

  var possibleQueries = possibleChecks.concat(possibleOptions)
  var query = Array.from(selections).map(function(o) {
    return element.querySelector("input[type='checkbox']")
      ? o.name.toLowerCase()
      : o.value.toLowerCase()
  })
  map.filters[widgets[x].id] =
    widgets[x].input === 'toggle'
      ? function(feature) {
          var bool = true

          if (feature.properties.toggle) {
            bool = convertType(query[0]) ? true : false
          } else {
            bool = true
          }

          return bool
        }
      : widgets[x].field === 'all'
        ? function(feature) {
            var bool = true
            var withDiacritics = Object.values(feature.properties)
              .join('')
              .toLowerCase()
            var withoutDiacritics = Object.values(feature.properties)
              .join('')
              .toLowerCase()
              .latinise()

            if (
              withDiacritics.indexOf(query[0]) < 0 &&
              withoutDiacritics.indexOf(query[0]) < 0
            ) {
              bool = false
            }

            return bool
          }
        : function(feature, layers) {
            var bool = true
            var field = widgets[x].grouping
              ? widgets[x].grouping
              : widgets[x].field

            if (
              possibleQueries.indexOf(feature.properties[field].toLowerCase()) >
                -1 &&
              query.indexOf(feature.properties[field].toLowerCase()) < 0
            ) {
              bool = false
            }
            return bool
          }

  if (initialized >= count) map.removeGroups()
  if (widgets.length >= x + 1 && initialized >= count) makeGroups(map)
}

function makeDropdownOptions(options, x) {
  var groups = options.widgets[x].keys.groupBy('group')
  var choices = Object.keys(groups).map(function(g, z) {
    return {
      id: z,
      label: g.trim() && parseInt(g, 10) === NaN ? g : '',
      disabled: false,
      choices: groups[g]
    }
  })
  return {
    choices: choices,
    removeItemButton: true,
    maxItemCount: options.widgets[x].maximum,
    callbackOnCreateTemplates: function callbackOnCreateTemplates(template) {
      var _this = this

      return {
        item: function item(classNames, data) {
          var key = options.widgets[x].keys.find(function(v) {
            return v.value.toLowerCase() === data.value.toLowerCase()
          })
          var keyStyle

          switch (options.widgets[x].type) {
            case 'form':
              var forms = options.widgets[x].keys.map(function(k) {
                return k.value.toLowerCase()
              })

              var i = forms.indexOf(key.value.toLowerCase())

              var styleOptions = {
                key: key,
                index: i,
                forms: forms,
                map: options
              }
              keyStyle = styleKey(styleOptions)
              break

            case 'color':
              var styleOptions = {
                key: key,
                map: options
              }
              keyStyle = styleKey(styleOptions)
              break
          }

          var markup =
            '<div style="border-color:' +
            key.color +
            '" class="' +
            classNames.item +
            '" data-item data-id="' +
            data.id +
            '" data-value="' +
            data.value +
            '" ' +
            (data.active ? 'aria-selected="true"' : '') +
            ' ' +
            (data.disabled ? 'aria-disabled="true"' : '') +
            '><span class="' +
            keyStyle.class +
            'Key" ' +
            'style="background-image: url(\'' +
            keyStyle.svg +
            '")></span> ' +
            capitalize(data.label) +
            '<button style="border-left: 1px solid ' +
            key.color +
            "; background-image: url('data:image/svg+xml;base64," +
            window.btoa(remove) +
            '\')" type="button" class="choices__button" data-button="" aria-label="Remove item">Remove item</button></div>'
          return template(markup)
        },
        choice: function choice(classNames, data) {
          var key = options.widgets[x].keys.find(function(v) {
            return v.value.toLowerCase() === data.value.toLowerCase()
          })
          var keyStyle

          switch (options.widgets[x].type) {
            case 'form':
              var forms = options.widgets[x].keys.map(function(k) {
                return k.value.toLowerCase()
              })
              var styleOptions = {
                key: key,
                // index: i,
                forms: forms,
                map: options
              }
              keyStyle = styleKey(styleOptions)
              break

            case 'color':
              var styleOptions = {
                key: key,
                map: options
              }
              keyStyle = styleKey(styleOptions)
              break
          }

          var markup =
            ' <div class="' +
            classNames.item +
            ' ' +
            classNames.itemChoice +
            ' ' +
            (data.disabled
              ? classNames.itemDisabled
              : classNames.itemSelectable) +
            '" data-select-text="' +
            _this.config.itemSelectText +
            '" data-choice ' +
            (data.disabled
              ? 'data-choice-disabled aria-disabled="true"'
              : 'data-choice-selectable') +
            ' data-id="' +
            data.id +
            '" data-value="' +
            data.value +
            '" ' +
            (data.groupId > 0 ? 'role="treeitem"' : 'role="option"') +
            '> <span class="' +
            keyStyle.class +
            'Key" ' +
            'style="background-image: url(\'' +
            keyStyle.svg +
            '")></span> ' +
            capitalize(data.label) +
            ' </div> '
          return template(markup)
        }
      }
    }
  }
}

function parseLanguageData(data) {
  var languageData = {}
  data.forEach(function(row) {
    var key
    Object.keys(row).forEach(function(column, i) {
      if (column.indexOf('gsx$') > -1) {
        var columnName = column.replace('gsx$', '')

        if (columnName === 'en') {
          key = row[column]['$t']
          languageData[key] = {}
        }

        if (columnName === lang) {
          languageData[key] = row[column]['$t']
        }
      }
    })
  })
  return languageData
}

function parseLegendData(options, json, style) {
  var colorScale = createColorScale(json.length)
  var legendItems = []
  json.forEach(function(row, x) {
    var data = {}
    Object.keys(row).forEach(function(column, y) {
      if (column.indexOf('gsx$') > -1) {
        var columnName = column.replace('gsx$', '')

        if (columnName === 'label') {
          var key = row[column]['$t'].toLowerCase()
          data.key = key
          data.label = row[Object.keys(row)[y + 0]]['$t']
          data.value = row[Object.keys(row)[y + 1]]['$t']
          data.group = convertType(row[Object.keys(row)[y + 2]]['$t'])
          data.selected = convertType(row[Object.keys(row)[y + 3]]['$t'])
          var colorVal = row[Object.keys(row)[y + 4]]['$t']
          data.form = row[Object.keys(row)[y + 5]]['$t']
          data.color = colorVal
            ? colorVal
            : data.form === 'line'
              ? defaultColor
              : colorScale[x]
          data.icon = row[Object.keys(row)[y + 6]]['$t']
          data.pattern = row[Object.keys(row)[y + 7]]['$t'].split(',')

          if (options.translations) {
            data.label = options.translations[data.label]
            data.group = options.translations[data.group]
          }
          legendItems.push(data)
        }
      }
    })
  })
  return legendItems
}

function parseMetaData(json) {
  var data = {}
  json.forEach(function(row, x) {
    Object.keys(row).forEach(function(column, y) {
      if (column.indexOf('gsx$') > -1) {
        var columnName = column.replace('gsx$', '')

        if (columnName === 'property') {
          var key = row[column]['$t'].toLowerCase().replace(/ /g, '')
          data[key] = data[key] || {}
          data[key] = convertType(row[Object.keys(row)[y + 1]]['$t'])
        }
      }
    })
  })
  return data
}

function stylePoint(feature, latlng, map, colorKeyWidget, formKeyWidget) {
  var CustomIcon = L.Icon.extend({
    options: {
      iconSize: map.iconsize || [20, 20]
    }
  })
  var pointStyle

  var key, styleOptions

  if (formKeyWidget && feature.properties[formKeyWidget.field]) {
    var forms = formKeyWidget.keys.map(function(k) {
      return k.value.toLowerCase()
    })
    var i = forms.indexOf(feature.properties[formKeyWidget.field].toLowerCase())

    key = formKeyWidget.keys.find(function(k) {
      return (
        k.value.toLowerCase() ===
        feature.properties[formKeyWidget.field].toLowerCase()
      )
    })

    styleOptions = key
      ? {
          key: key,
          index: i,
          forms: forms,
          color: key.color,
          map: map,
          feature: feature
        }
      : null
  } else if (colorKeyWidget && feature.properties[colorKeyWidget.field]) {
    var key = colorKeyWidget.keys.find(function(k) {
      return (
        k.value.toLowerCase() ===
        feature.properties[colorKeyWidget.field].toLowerCase()
      )
    })
    styleOptions = key
      ? {
          key: key,
          color: key.color,
          map: map,
          feature: feature
        }
      : null
  }

  if (styleOptions) {
    pointStyle = styleKey(styleOptions)
  } else {
    colorKeyWidget2 = map.widgets.filter(function(w) {
      return w.type === 'color'
    })[1]

    formKeyWidget2 = map.widgets.filter(function(w) {
      return w.type === 'form'
    })[1]

    if (formKeyWidget2 && feature.properties[formKeyWidget2.field]) {
      var forms = formKeyWidget2.keys.map(function(k) {
        return k.value.toLowerCase()
      })
      var i = forms.indexOf(
        feature.properties[formKeyWidget2.field].toLowerCase()
      )

      key = formKeyWidget2.keys.find(function(k) {
        return (
          k.value.toLowerCase() ===
          feature.properties[formKeyWidget2.field].toLowerCase()
        )
      })

      styleOptions = key
        ? {
            key: key,
            index: i,
            forms: forms,
            color: key.color,
            map: map,
            feature: feature
          }
        : null
    } else if (colorKeyWidget2 && feature.properties[colorKeyWidget2.field]) {
      var key = colorKeyWidget2.keys.find(function(k) {
        return (
          k.value.toLowerCase() ===
          feature.properties[colorKeyWidget2.field].toLowerCase()
        )
      })
      styleOptions = key
        ? {
            key: key,
            color: key.color,
            map: map,
            feature: feature
          }
        : null
    }

    if (styleOptions) {
      pointStyle = styleKey(styleOptions)
    } else {
      var svg =
        '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="6" r="5" fill="' +
        '#38f' +
        '"/></svg>'
      pointStyle = {
        class: 'default',
        svg: encodeURI('data:image/svg+xml;base64,' + window.btoa(svg))
      }
    }
  }

  var iconUrl = pointStyle.svg
  var icon = new CustomIcon({
    iconUrl: iconUrl
  })
  return L.marker(latlng, {
    icon: icon
  })
}

function makeGeoJsonOptions(map, colorKeyWidget, formKeyWidget) {
  function filter(feature) {
    return map.filters
      .map(function(f) {
        return f(feature)
      })
      .every(function(f) {
        return f !== false
      })
  }

  function onEachFeature(feature, layer) {
    handleFeatureEvents(feature, layer, map)
  }

  var form = formKeyWidget
    ? formKeyWidget.keys.reduce(function(a, c) {
        return c.form
      })
    : null

  if (formKeyWidget && form === 'line') {
    var colors = []
    var forms = []
    forms = formKeyWidget.keys.map(function(f) {
      return f.value
    })
    forms.forEach(function(f, i) {
      switch (i) {
        case 0:
          colors.push([null, null])
          break

        case 1:
          colors.push([null, defaultColor])
          break

        case 2:
          colors.push(['#000000', null])
          break

        case 3:
          colors.push(['#ffffff', null])
          break

        default:
          colors.push([null, null])
          break
      }
    })
    var styleOptions = {
      map: map,
      formKeyWidget: formKeyWidget,
      colorKeyWidget: colorKeyWidget,
      colors: colors,
      forms: forms
    }
    var backgroundOptions = {
      filter: filter,
      onEachFeature: onEachFeature,
      pointToLayer:
        map.pointStyle ||
        function(feature, latlng) {
          return stylePoint(feature, latlng, map, colorKeyWidget, formKeyWidget)
        },
      style:
        map.nonPointStyle ||
        function(feature) {
          return styleNonPoint(feature, styleOptions, 0)
        }
    }
    var foregroundOptions = {
      filter: filter,
      onEachFeature: onEachFeature,
      pointToLayer:
        map.pointStyle ||
        function(feature, latlng) {
          return stylePoint(feature, latlng, map, colorKeyWidget, formKeyWidget)
        },
      style:
        map.nonPointStyle ||
        function(feature) {
          return styleNonPoint(feature, styleOptions, 1)
        }
    }
    return [backgroundOptions, foregroundOptions]
  } else {
    var styleOptions = {
      map: map,
      formKeyWidget: formKeyWidget,
      colorKeyWidget: colorKeyWidget
    }
    return [
      {
        filter: filter,
        onEachFeature: onEachFeature,
        pointToLayer:
          map.pointStyle ||
          function(feature, latlng) {
            return stylePoint(
              feature,
              latlng,
              map,
              colorKeyWidget,
              formKeyWidget
            )
          },
        style:
          map.nonPointStyle ||
          function(feature) {
            return styleNonPoint(feature, styleOptions)
          }
      }
    ]
  }
}

function makeGroups(map) {
  var colorKeyWidget, formKeyWidget

  if (map.widgets) {
    colorKeyWidget = map.widgets.find(function(w) {
      return w.type === 'color'
    })
    formKeyWidget = map.widgets.find(function(w) {
      return w.type === 'form'
    })
  }

  var geoJsonOptions = map.geoJsonOptions
    ? map.geoJsonOptions(map, colorKeyWidget, formKeyWidget)
    : makeGeoJsonOptions(map, colorKeyWidget, formKeyWidget)
  map.json.forEach(function(json, i) {
    var color

    if (colorKeyWidget) {
      var collectionName = json.features[0].properties[colorKeyWidget.field]
      var colorKey = colorKeyWidget.keys.find(function(key) {
        return key.value.toLowerCase() === collectionName.toLowerCase()
      })
      color = colorKey ? colorKey.color : '#000000'
    } else {
      color = '#000000'
    }

    var allPoints = json.features.every(function(feature) {
      return feature.geometry && feature.geometry.type.toLowerCase() === 'point'
    })
    map.groups.push(
      new L.MarkerClusterGroup({
        showCoverageOnHover: false,
        zoomToBoundsOnClick: false,
        maxClusterRadius:
          allPoints && map.clusterdistance ? map.clusterdistance : NaN,
        iconCreateFunction: function iconCreateFunction(cluster) {
          return L.divIcon({
            className: 'icon-group',
            html:
              '<span class="text" style="border: 2px solid' +
              color +
              '; color:' +
              color +
              '">' +
              cluster.getChildCount() +
              '</span>'
          })
        }
      })
    )
    geoJsonOptions.forEach(function(option) {
      if (colorKeyWidget) {
        json.features = json.features.sort(function(a, b) {
          return b.properties[colorKeyWidget.field].localeCompare(
            a.properties[colorKeyWidget.field]
          )
        })
      }

      var geoJson = L.geoJson(json, _extends({}, option))
      map.groups[i].addLayer(geoJson)
    })
    map.leaflet.addLayer(map.groups[i])
    map.groups[i].on('clusterclick', function(e) {
      handleClusterClick(e, map, i)
    })
  })
}

function handleFeatureEvents(feature, layer, map) {
  var eventOptions = map.onEachFeature
    ? map.onEachFeature
    : {
        click: function click() {
          handleLayerClick(feature, layer, map)
        }
      }
  layer.on(eventOptions)
  var popupContent =
    typeof map.formatpopupcontent === 'function'
      ? map.formatpopupcontent(feature, map)
      : formatPopupContent(feature, map)
  layer.bindPopup(popupContent)
}

function formatPopupContent(feature, map) {
  var content
  content = Object.keys(feature.properties)
    .map(function(p) {
      if (feature.properties[p]) {
        if (map.popupheaders.length && map.popupcontent.length) {
          return map.popupheaders.indexOf(p) > -1 &&
            map.popupcontent.indexOf(p) > -1
            ? '<div class="popupHeaderStyle">' +
                p.toUpperCase().replace(/_/g, ' ') +
                '</div><div class="popupEntryStyle">' +
                feature.properties[p] +
                '</div>'
            : map.popupcontent.indexOf(p) > -1
              ? '<div class="popupEntryStyle">' +
                feature.properties[p] +
                '</div>'
              : ''
        } else if (map.popupheaders.length) {
          return map.popupheaders.indexOf(p) > -1
            ? '<div class="popupHeaderStyle">' +
                p.toUpperCase().replace(/_/g, ' ') +
                '</div><div class="popupEntryStyle">' +
                feature.properties[p] +
                '</div>'
            : ''
        } else if (map.popupcontent.length) {
          return map.popupcontent.indexOf(p) > -1
            ? '<div class="popupEntryStyle">' + feature.properties[p] + '</div>'
            : ''
        } else {
          return (
            '<div class="popupHeaderStyle">' +
            p.toUpperCase().replace(/_/g, ' ') +
            '</div><div class="popupEntryStyle">' +
            feature.properties[p] +
            '</div>'
          )
        }
      }
    })
    .filter(function(p) {
      return p
    })
    .join('')
  var link = feature.properties.hyperlink || feature.properties.link
  var externalLinkContent =
    link && link.trim()
      ? '<div class="separator"></div><div class="hyperlink popupEntryStyle"><a class="translate" href=' +
        link.trim() +
        ' target="_blank">' +
        map.externalLinkText +
        '</a>' +
        externalLink +
        '</div>'
      : ''
  content += externalLinkContent

  if (lang) {
    var translatableStrings = Object.keys(map.translations).sort(function(
      a,
      b
    ) {
      return b.length - a.length
    })
    translatableStrings.forEach(function(t) {
      var re = new RegExp('\\b(' + RegExp.escape(t) + ')', 'gi')
      content = content.replace(re, map.translations[t])
    })
  }

  return content
}

function handleLayerClick(feature, layer, map) {
  var isSpiderfied = false

  if (!layer._preSpiderfyLatlng) {
    Object.keys(map.leaflet._layers).forEach(function(l, i) {
      if (map.leaflet._layers[l].unspiderfy) map.leaflet._layers[l].unspiderfy()
    })

    if (layer.__parent) {
      Object.values(layer.__parent._group._featureGroup._layers).forEach(
        function(v) {
          if (v._group && v._group._spiderfied) isSpiderfied = true
        }
      )
      Array.from(document.querySelectorAll('div.leaflet-marker-icon')).forEach(
        function(d) {
          return (d.style.opacity = isSpiderfied ? 0.33 : 1)
        }
      )
      Array.from(document.querySelectorAll('img.leaflet-marker-icon')).forEach(
        function(d) {
          return (d.style.opacity = isSpiderfied ? 0.33 : 1)
        }
      )
    }
  }
}

function handleClusterClick(e, map, i) {
  map.leaflet._layers[e.layer._leaflet_id].spiderfy()

  Object.keys(map.leaflet._layers).forEach(function(layer, i) {
    if (parseInt(layer, 10) !== e.layer._leaflet_id) {
      if (map.leaflet._layers[layer].unspiderfy)
        map.leaflet._layers[layer].unspiderfy()
    }
  })
  var isSpiderfied = false
  Object.values(map.groups[i]._featureGroup._layers).forEach(function(v) {
    if (v._group && v._group._spiderfied) isSpiderfied = true
  })
  Array.from(document.querySelectorAll('div.leaflet-marker-icon')).forEach(
    function(d) {
      return (d.style.opacity = isSpiderfied ? 0.33 : 1)
    }
  )
  Array.from(document.querySelectorAll('img.leaflet-marker-icon')).forEach(
    function(d) {
      return (d.style.opacity = isSpiderfied ? 0.33 : 1)
    }
  )
  Object.values(map.groups[i]._featureGroup._layers).filter(function(v) {
    e.layer
      .getAllChildMarkers()
      .map(function(m) {
        return m.getElement()
      })
      .filter(function(m) {
        return m
      })
      .forEach(function(m) {
        return (m.style.opacity = 1)
      })
  })
}

function styleNonPoint(feature, options, index) {
  var leaflet = options.leaflet,
    formKeyWidget = options.formKeyWidget,
    colorKeyWidget = options.colorKeyWidget,
    colors = options.colors,
    forms = options.forms
  var colorKey = colorKeyWidget
    ? colorKeyWidget.keys.find(function(k) {
        return (
          k.value.toLowerCase() ===
          feature.properties[colorKeyWidget.field].toLowerCase()
        )
      })
    : null
  var formKey = formKeyWidget
    ? formKeyWidget.keys.find(function(k) {
        return (
          k.value.toLowerCase() ===
          feature.properties[formKeyWidget.field].toLowerCase()
        )
      })
    : null

  if (!colorKey && !formKey) {
    return {
      opacity: 0,
      fillOpacity: 0
    }
  }

  var color = colorKey ? colorKey.color : formKey ? formKey.color : null
  var formKeyForm = formKeyWidget
    ? formKeyWidget.keys.reduce(function(a, c) {
        return c.form
      })
    : null
  var colorKeyForm = colorKeyWidget
    ? colorKeyWidget.keys.reduce(function(a, c) {
        return c.form
      })
    : null

  if ((forms && formKeyForm === 'line') || (forms && colorKeyForm === 'line')) {
    var i = forms.indexOf(feature.properties[formKeyWidget.field])

    if (i > -1) {
      console.log(feature.properties.capabilities, colors[i][index])
      return {
        color:
          colors[i][index] === undefined
            ? '#cad2d3'
            : colors[i][index] !== null
              ? colors[i][index]
              : color,
        weight: lineWeights[i][index],
        lineCap: 'square',
        dashArray: lineDashArrays[i] ? lineDashArrays[i][index] : null
      }
    }
  } else if (formKeyForm === 'line' || colorKeyForm === 'line') {
    return {
      color: color,
      weight: 2,
      lineCap: 'square',
      dashArray: '3,7'
    }
  } else {
    if (colorKey && colorKey.form === 'pattern') {
      var pattern

      switch (true) {
        case colorKey.pattern[0].indexOf('stripe') > -1:
          var patternOptions = {
            weight: 3,
            spaceWeight: 3,
            color: colorKey.pattern[1],
            spaceColor: colorKey.pattern[colorKey.pattern.length - 1],
            spaceOpacity: 1,
            angle: 45
          }
          pattern = new L.StripePattern(patternOptions)
          break

        case colorKey.pattern[0].indexOf('dot') > -1:
          var shapeOptions = {
            x: 4,
            y: 4,
            radius: 2,
            fill: true,
            stroke: false,
            fillColor: colorKey.pattern[colorKey.pattern.length - 1],
            fillOpacity: 1
          }
          var shape = new L.PatternCircle(shapeOptions)
          var patternOptions = {
            width: 8,
            height: 8
          }
          pattern = new L.Pattern(patternOptions)
          pattern.addShape(shape)
          break
      }

      pattern.addTo(options.map.leaflet)
      return {
        fillPattern: pattern ? pattern : null,
        fillColor: color,
        color: defaultColor,
        fillOpacity: 0.7,
        opacity: 0.5,
        weight: 2,
        lineCap: 'square'
      }
    }

    var lineColor
    var lineWeight
    var lineOpacity

    switch (true) {
      case feature.geometry.type.toLowerCase().indexOf('line') > -1:
        lineColor = chroma(color)
          .brighten()
          .hex()
        lineOpacity = 1
        lineWeight = 4
        break

      case feature.geometry.type.toLowerCase().indexOf('polygon') > -1:
        lineColor = defaultColor
        lineOpacity = 0.5
        lineWeight = 2
        break
    }

    return {
      fillPattern: pattern,
      fillColor: color,
      color: lineColor,
      fillOpacity: 0.7,
      opacity: lineOpacity,
      weight: lineWeight
    }
  }
}

function styleKey(options) {
  var map = options.map,
    feature = options.feature,
    group = options.group,
    key = options.key,
    index = options.index,
    forms = options.forms
  var keyColor
  var dashArray
  var colors
  var key = group ? group[0] : key

  var formKeyWidget = map.widgets.find(function(w) {
    return w.type === 'form'
  })

  var colorKeyWidget = map.widgets.find(function(w) {
    return w.type === 'color'
  })
  if (colorKeyWidget && colorKeyWidget.keys && feature)
    colorKey = colorKeyWidget.keys.find(function(k) {
      return (
        k.value.toLowerCase() ===
        feature.properties[colorKeyWidget.field].toLowerCase()
      )
    })
  if (colorKey) keyColor = colorKey.color

  key.color =
    group &&
    group.every(function(g) {
      return g.color
    })
      ? chroma.average(
          group.map(function(g) {
            return g.color
          })
        )
      : key.color

  switch (key.form) {
    case 'line':
      keyColor = key.color
        ? key.color
        : options.map.oceancolor
          ? options.map.oceancolor
          : null

      if (forms) {
        var svg
        switch (index) {
          case 0:
            colors = [
              keyColor ? keyColor : chroma(defaultColor).darken(),
              keyColor ? keyColor : chroma(defaultColor).darken()
            ]
            break

          case 1:
            colors = [
              keyColor ? keyColor : chroma(defaultColor).darken(),
              '#ffffff'
            ]
            break

          case 2:
            colors = ['#000000', keyColor ? keyColor : defaultColor]
            break

          case 3:
            colors = [
              '#ffffff',
              keyColor ? keyColor : chroma(defaultColor).darken()
            ]
            break

          default:
            colors = [
              keyColor ? keyColor : chroma(defaultColor).darken(),
              keyColor ? keyColor : chroma(defaultColor).darken()
            ]
            break
        }

        svg =
          "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 12'><line x1='0' x2='48' y1='50%' y2='50%' stroke='" +
          colors[0] +
          "' stroke-width='" +
          lineWeights[index][0] +
          "' stroke-linecap='square' stroke-dasharray='" +
          (index === 4 ? '18,12' : lineDashArrays[index][0]) +
          "'/><line x1='0' x2='48' y1='50%' y2='50%' stroke='" +
          colors[1] +
          "' stroke-width='" +
          lineWeights[index][1] +
          "' stroke-linecap='square' stroke-dasharray='" +
          (index === 4 ? '18,12' : lineDashArrays[index][1]) +
          "'/></svg>"
      } else {
        svg =
          "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 12'><line x1='0' x2='48' y1='50%' y2='50%' stroke='" +
          keyColor +
          "' stroke-width='" +
          3 +
          "' stroke-linecap='square' stroke-dasharray='" +
          '3,7' +
          "'/></svg>"
      }

      return {
        svg: 'data:image/svg+xml;base64,' + window.btoa(svg),
        class: 'line'
      }

    case 'icon':
      if (key.icon) {
        var slug = key.value.replace(/ /g, '-')
        load(key.icon, document.querySelector('.hidden'))
        var svgContent = document.querySelector('.hidden').innerHTML

        if (colorKeyWidget && keyColor) {
          svgContent = svgContent.replace(
            /((\bfill="#)(([0-a-fA-F]{2}){3}|([0-9a-fA-F]){3})")/gi,
            ''
          )
          svgContent = svgContent.replace(
            /(<circle |<rectangle |<ellipse |<polygon |<path )/g,
            function(match, p1, p2, p3) {
              return match.replace(match, match + 'fill="' + keyColor + '" ')
            }
          )
        }

        svg = 'data:image/svg+xml;base64,' + window.btoa(svgContent)
      } else {
        svg =
          'data:image/svg+xml;base64,' +
          window.btoa(
            '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="6" r="5" fill="' +
              (keyColor || key.color) +
              '"/></svg>'
          )
      }

      return {
        svg: svg,
        class: key.icon ? 'icon' : 'color'
      }

    case 'pattern':
      keyColor = key.color
      var svg

      switch (true) {
        case key.pattern[0].indexOf('stripe') > -1:
          var colorTwo = key.pattern[1]
          var colorOne = key.pattern[key.pattern.length - 1]
          svg =
            'data:image/svg+xml;base64,' +
            window.btoa(
              '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><polygon points="5.73 0 4.67 0 0 4.66 0 5.71 5.73 0" fill="' +
                colorOne +
                '"/><polygon points="2.28 0 1.22 0 0 1.22 0 2.27 2.28 0" fill="' +
                colorTwo +
                '"/><polygon points="8.85 0 7.79 0 0 7.77 0 8.82 8.85 0" fill="' +
                colorTwo +
                '"/><polygon points="12 0 11.24 0 0 11.2 0 12 0.26 12 12 0.3 12 0" fill="' +
                colorOne +
                '"/><polygon points="12 10.12 12 9.06 9.05 12 10.11 12 12 10.12" fill="' +
                colorTwo +
                '"/><polygon points="12 3.52 12 2.46 2.43 12 3.49 12 12 3.52" fill="' +
                colorTwo +
                '"/><polygon points="12 6.96 12 5.9 5.88 12 6.94 12 12 6.96" fill="' +
                colorOne +
                '"/></svg>'
            )
          break

        case key.pattern[0].indexOf('dot') > -1:
          svg =
            'data:image/svg+xml;base64,' +
            window.btoa(
              '<svg xmlns="http://www.w3.org/2000/svg" width="13.06" height="15.1" viewBox="0 0 12 12"><title>stripes</title><path d="M5.49,1A1.16,1.16,0,1,1,4.33-.16,1.16,1.16,0,0,1,5.49,1ZM4.33,3.77A1.16,1.16,0,1,0,5.49,4.93,1.15,1.15,0,0,0,4.33,3.77Zm0,3.93A1.16,1.16,0,1,0,5.49,8.86,1.15,1.15,0,0,0,4.33,7.7Zm0,3.93a1.16,1.16,0,1,0,1.16,1.16A1.15,1.15,0,0,0,4.33,11.63ZM11.5-.16A1.16,1.16,0,1,0,12.66,1,1.16,1.16,0,0,0,11.5-.16Zm0,3.93a1.16,1.16,0,1,0,1.16,1.16A1.16,1.16,0,0,0,11.5,3.77Zm0,3.93a1.16,1.16,0,1,0,1.16,1.16A1.16,1.16,0,0,0,11.5,7.7Zm0,3.93a1.16,1.16,0,1,0,1.16,1.16A1.16,1.16,0,0,0,11.5,11.63ZM7.92-1.16A1.16,1.16,0,0,0,6.76,0,1.16,1.16,0,0,0,7.92,1.16,1.16,1.16,0,0,0,9.07,0,1.16,1.16,0,0,0,7.92-1.16Zm0,3.93A1.16,1.16,0,1,0,9.07,3.93,1.16,1.16,0,0,0,7.92,2.77Zm0,3.93A1.16,1.16,0,1,0,9.07,7.86,1.16,1.16,0,0,0,7.92,6.7Zm0,3.93a1.16,1.16,0,1,0,1.15,1.16A1.16,1.16,0,0,0,7.92,10.63ZM.75-1.16A1.16,1.16,0,0,0-.41,0,1.16,1.16,0,0,0,.75,1.16,1.16,1.16,0,0,0,1.91,0,1.16,1.16,0,0,0,.75-1.16Zm0,3.93A1.16,1.16,0,1,0,1.91,3.93,1.16,1.16,0,0,0,.75,2.77Zm0,3.93A1.16,1.16,0,0,0-.41,7.86,1.15,1.15,0,0,0,.75,9,1.15,1.15,0,0,0,1.91,7.86,1.16,1.16,0,0,0,.75,6.7Zm0,3.93a1.16,1.16,0,1,0,1.16,1.16A1.16,1.16,0,0,0,.75,10.63Z" transform="translate(0.7 2)" fill="' +
                colorOne +
                '"/></svg>'
            )
          break

        default:
          svg =
            'data:image/svg+xml;base64,' +
            window.btoa(
              '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="6" r="5" fill="' +
                keyColor +
                '"/></svg>'
            )
      }

      return {
        svg: svg,
        class: key.pattern ? 'pattern' : 'color'
      }

    case 'shape':
      if (feature) {
        var colorKeyWidget = map.widgets.find(function(w) {
          return w.type === 'color'
        })
        var colorKey = colorKeyWidget.keys.find(function(k) {
          return (
            k.value.toLowerCase() ===
            feature.properties[colorKeyWidget.field].toLowerCase()
          )
        })
        keyColor = colorKey ? colorKey.color : color ? color : null
      }

      var svg

      switch (index) {
        case 0:
          svg =
            '<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rainbow"  y1="4.5" x2="9" y2="4.5" gradientUnits="userSpaceOnUse" gradientTransform="translate(4.5 -4.5) rotate(135)"><stop offset="0" stop-color="#7f3c8d"/><stop offset="0.325" stop-color="#e73f74"/><stop offset="0.5" stop-color="#f2b701"/><stop offset="0.675" stop-color="#11a579"/><stop offset="1" stop-color="#3969ac"/></linearGradient></defs><rect x="3.25" y="1.75" width="9" height="9" transform="translate(4.5 -4.5) rotate(45)" ' +
            (keyColor ? 'paint-order="stroke" stroke="#ffffff"' : '') +
            ' fill="' +
            (keyColor ? keyColor : 'url(#rainbow)') +
            '" /></svg>'
          break

        case 1:
          svg =
            '<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rainbow" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3969ac"/><stop offset="0.25" stop-color="#11a579"/><stop offset="0.5" stop-color="#f2b701"/><stop offset="0.75" stop-color="#e73f74"/><stop offset="1" stop-color="#7f3c8d"/></linearGradient></defs><rect width="10" height="10" ' +
            (keyColor ? 'stroke="#ffffff"' : '') +
            ' fill="' +
            (keyColor ? keyColor : 'url(#rainbow)') +
            '"/></svg>'
          break

        case 2:
          svg =
            '<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rainbow" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3969ac"/><stop offset="0.325" stop-color="#11a579"/><stop offset="0.5" stop-color="#f2b701"/><stop offset="0.675" stop-color="#e73f74"/><stop offset="1" stop-color="#7f3c8d"/></linearGradient></defs><polygon points="6 10.39 0 10.39 3 5.2 6 0 9 5.2 12 10.39 6 10.39" ' +
            (keyColor ? 'paint-order="stroke" stroke="#ffffff"' : '') +
            ' fill="' +
            (keyColor ? keyColor : 'url(#rainbow)') +
            '" /></svg>'
          break

        default:
          svg =
            '<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rainbow" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3969ac"/><stop offset="0.25" stop-color="#11a579"/><stop offset="0.5" stop-color="#f2b701"/><stop offset="0.75" stop-color="#e73f74"/><stop offset="1" stop-color="#7f3c8d"/></linearGradient></defs><circle cx="6" cy="6" r="5" ' +
            (keyColor ? 'stroke="#ffffff"' : '') +
            ' fill="' +
            (keyColor ? keyColor : 'url(#rainbow)') +
            '"/></svg>'
      }

      return {
        svg: 'data:image/svg+xml;base64,' + window.btoa(svg),
        class: 'shape'
      }

    default:
      keyColor = key.color
      var svg =
        'data:image/svg+xml;base64,' +
        window.btoa(
          '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="6" r="5" fill="' +
            keyColor +
            '"/></svg>'
        )
      return {
        svg: svg,
        class: 'color'
      }
  }
}

function createColorScale(count, index) {
  var scaleOne = chroma
    .cubehelix()
    .hue(0.5)
    .lightness([0.4, 0.6])
    .scale()
    .colors(count * 2)
  var scaleTwo = chroma
    .cubehelix()
    .hue(1)
    .gamma(0.5)
    .scale()
    .colors(count * 2)
    .reverse()
  var scale = []

  for (var i = 0; i < count; i++) {
    var color = i % 2 === 0 ? scaleOne[i * 2] : scaleTwo[i * 2]
    color = chroma(color)
      .saturate()
      .hex()
    scale.push(color)
  }

  return scale
}

var lineWeights = [[3, 3], [5, 2], [4, 3.5], [7, 3], [4, 4]]
var lineDashArrays = [
  ['6,9', '6,9'],
  [null, null],
  [null, '6,12'],
  [null, null],
  ['18,24', '18,24']
]
var externalLink =
  '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"><path d="M7.49,0V1.67H1.68V13.32H13.32V7.52H15v5.72a1.76,1.76,0,0,1-.42,1.19,1.64,1.64,0,0,1-1.13.56H1.74a1.67,1.67,0,0,1-1.16-.41A1.61,1.61,0,0,1,0,13.48v-.27C0,9.4,0,5.6,0,1.8A1.83,1.83,0,0,1,.58.4a1.53,1.53,0,0,1,1-.39h6Z" transform="translate(0 0)"/><path d="M9.17,1.67V0H15V5.84H13.34v-3h0c-.05.05-.11.1-.16.16l-.45.46-1.3,1.29-.84.84-.89.9-.88.87-.89.9c-.28.29-.57.57-.86.86L6.16,10l-.88.87a1.83,1.83,0,0,1-.13.16L4,9.86l0,0L5.36,8.47l.95-1,.75-.75,1-1L8.87,5l1-.94.85-.86.92-.91.56-.58Z" transform="translate(0 0)"/></svg>'
var remove =
  '<svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg"><g fill="#000" fill-rule="evenodd"><path d="M2.592.044l18.364 18.364-2.548 2.548L.044 2.592z"/><path d="M0 18.364L18.364 0l2.548 2.548L2.548 20.912z"/></g></svg>'

function convertType(value) {
  var v = Number(value)
  return !isNaN(v)
    ? v
    : value.toLowerCase() === 'undefined'
      ? undefined
      : value.toLowerCase() === 'null'
        ? null
        : value.toLowerCase() === 'true'
          ? true
          : value.toLowerCase() === 'false'
            ? false
            : value
}

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i]

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key]
        }
      }
    }

    return target
  }

Array.prototype.groupBy = function(property1, property2) {
  return property2
    ? this.reduce(function(groups, item) {
        var val = item[property2][property1]
        groups[val] = groups[val] || []
        groups[val].push(item)
        return groups
      }, {})
    : this.reduce(function(groups, item) {
        var val = item[property1]
        groups[val] = groups[val] || []
        groups[val].push(item)
        return groups
      }, {})
}

RegExp.escape = function(s) {
  return s.replace(/[\/\\^$*+?.()|[\]{}]/g, '\\$&')
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function load(url, element) {
  var req = new XMLHttpRequest()
  req.open('GET', url, false)
  req.send(null)
  element.innerHTML = req.responseText
}
var url =
  window.location != window.parent.location
    ? document.referrer
    : document.location.href
var href = /lang=([^&]+)/.exec(url)
window.lang = href ? href[1].split('#')[0] : 'en'

console.log(window.lang)
let i = 0

const translations = {
  'Pacific Military Powers': {
    en: 'Pacific Military Powers',
    'zh-hans': '太平洋军事力量',
    'zh-hant': '太平洋軍事力量',
    ms: 'Kuasa Ketenteraan Pasifik',
    vi: 'Các Thế lực Quân sự trên Thái Bình Dương'
  },
  'Free Assoc. with NZ': {
    en: 'Free Assoc. with NZ',
    'zh-hans': '新西兰自由联系国自由联盟',
    'zh-hant': '紐西蘭自由聯盟',
    ms: 'Persatuan Bebas dengan New Zealand',
    vi: 'Liên hợp Tự do với Niu Di-lân'
  },
  'Free Assoc. with US': {
    en: 'Free Assoc. with US',
    'zh-hans': '美国自由联系国',
    'zh-hant': '美國自由聯盟',
    ms: 'Persatuan Bebas dengan Amerika Syarikat',
    vi: 'Liên hợp Tự do với Hoa Kỳ'
  },
  Australia: {
    en: 'Australia',
    'zh-hans': '澳大利亚',
    'zh-hant': '澳洲',
    ms: 'Australia',
    vi: 'Úc'
  },
  France: {
    en: 'France',
    'zh-hans': '法国',
    'zh-hant': '法國',
    ms: 'Perancis',
    vi: 'Pháp'
  },
  'New Zealand': {
    'zh-hans': '新西兰',
    'zh-hant': '紐西蘭',
    ms: 'New Zealand',
    vi: 'Niu Di-lân'
  },
  'United States': {
    en: 'United States',
    'zh-hans': '美国',
    'zh-hant': '美國',
    ms: 'Amerika Syarikat',
    vi: 'Hoa Kỳ'
  },
  Previous: {
    en: 'Previous',
    'zh-hans': 'zh-hans',
    'zh-hant': 'zh-hant',
    ms: 'ms',
    vi: 'vi'
  },
  Next: {
    en: 'Next',
    'zh-hans': 'zh-hans',
    'zh-hant': 'zh-hant',
    ms: 'ms',
    vi: 'vi'
  },
  'Scroll Up': {
    en: 'Scroll Up',
    'zh-hans': 'zh-hans',
    'zh-hant': 'zh-hant',
    ms: 'ms',
    vi: 'vi'
  },
  'Scroll Down': {
    en: 'Scroll Down',
    'zh-hans': 'zh-hans',
    'zh-hant': 'zh-hant',
    ms: 'ms',
    vi: 'vi'
  }
}

function interactiveSetup({ container, initialDesc, steps }) {
  let cssFiles = [
    'https://api.mapbox.com/mapbox.js/v3.1.1/mapbox.css',
    'https://csis-ilab.github.io/mapbox-custom/amti-pacific-islands/dist/main.css'
  ]

  cssFiles.forEach(file => {
    let head = document.head
    let cssLink = document.createElement('link')

    cssLink.rel = 'stylesheet'
    cssLink.href = file

    head.appendChild(cssLink)
  })

  let HTML = ''

  HTML += `<section id="scroll">
  <div class="scroll__graphic sticky">
    <div id="legend">
    <div class="popupHeaderStyle">${
      translations['Pacific Military Powers'][window.lang]
    }</div>
      <div class="legend-label label-base base-au">${
        translations['Australia'][window.lang]
      }</div>
      <div class="legend-label label-base base-fr">${
        translations['France'][window.lang]
      }</div>
      <div class="legend-label label-base base-nz">${
        translations['New Zealand'][window.lang]
      }</div>
      <div class="legend-label label-base base-us">${
        translations['United States'][window.lang]
      }</div>
      <div class="legend-label label-pact pact-nz">${
        translations['Free Assoc. with NZ'][window.lang]
      }</div>
      <div class="legend-label label-pact pact-us">${
        translations['Free Assoc. with US'][window.lang]
      }</div>
    </div>


      <figure id="map" class="map chart chart-primary" style="height:100vh"></figure>


      <div id="scroll-progress">
        <a href="#1">
          <span class="scroll-icon"></span>
          <span class="scroll-current-page"></span>
          <span class="scroll-total-page"></span>
        </a>
      </div>

    </div>
`

  let lastStep = 0
  if ((!window.useLeaflet && window.isMobile) || window.useLeaflet) {
    lastStep = steps.length - 1
    HTML += '<div class="scroll__text">'
    steps.forEach((step, i) => {
      let content = ''
      if (step.text) {
        content = `<div class="prose">
        ${
          i > 0
            ? `<div id="chevWrapper">
          <a href="#step${i - 1}">
             <span id="chevron-up">»</span>
            &nbsp;<span></span>
          </a>
          </div>`
            : ``
        }

                    ${i === 0 ? `${step.text}` : step.text}
                    ${
                      i !== lastStep
                        ? `<div id="chevWrapper">
                      <a href="#step${i + 1}">
                         <span id="chevron-down">»</span>
                        &nbsp;<span>${
                          translations['Scroll down'][window.lang]
                        }</span>
                      </a>
                      </div>`
                        : ``
                    }
                  </div>`
      }
      HTML += `<div class="step" data-step="${i}" id="step${i}">${content}</div>`
    })
    HTML += '</div>'
  } else if (!window.useLeaflet && !window.isMobile) {
    HTML += '<div class="scroll__text">'

    let content = `<div class="prose">
        <div class="text">
          ${steps[i].text}
        </div>

            <div class="navigator">
              ${
                !i === 0
                  ? `<button class="scroll-up" aria-label="scroll-up"><span class="symbol"></span></button>`
                  : ``
              }
              ${
                i !== steps.length - 1
                  ? `<button class="scroll-down" aria-label="scroll-down"><span class="symbol">${
                      translations['Next'][window.lang]
                    }</span></button>`
                  : ``
              }
            </div>

    </div>`

    HTML += `<div class="step" data-step="${i}" id="step${i}">${content}</div>`

    HTML += '</div>'
  }

  HTML += '</section>'
  HTML +=
    '<div class="phone-landscape-disclaimer">To view our interactive visualization please reorient your device or view on a desktop computer.</div>'
  container.innerHTML = HTML

  let scrollText = document.querySelector('.scroll__text'),
    step = scrollText.querySelector('.step'),
    windowHeight = window.innerHeight

  if (!window.useLeaflet && !window.isMobile) {
    step.classList.add('is-active')
    scrollText.style.top = `-${windowHeight / 4}px`
    scrollText.style.overflow = `hidden`
    scrollText.style.position = `absolute`
    scrollText.style.right = `calc(100vw - 100%)`
    document.querySelector('#scroll').style.overflow = `hidden`

    document.querySelector('.navigator').addEventListener('click', e => {
      if (
        e.target.classList.contains('scroll-up') ||
        e.target.parentNode.classList.contains('scroll-up')
      ) {
        window.stepActions[--i].fly()
        window.currentStep--
      } else if (
        e.target.classList.contains('scroll-down') ||
        e.target.parentNode.classList.contains('scroll-down')
      ) {
        window.stepActions[++i].fly()
        window.currentStep++
      }

      if (!window.useLeaflet && window.map.getSource('point')) {
        window.animateMarker(0)
      }

      step.querySelector('.text').innerHTML = window.stepActions[i].text

      let first = i === 0

      let last = i == steps.length - 1

      step.querySelector('.navigator').innerHTML = `${
        first
          ? `<button class="scroll-down" aria-label="scroll-down"><span class="symbol">${
              translations['Next'][window.lang]
            }</span></button>`
          : ``
      }
        ${
          last
            ? `<button class="scroll-up" aria-label="scroll-up"><span class="symbol">${
                translations['Previous'][window.lang]
              }</span></button>`
            : ``
        }

        ${
          !first && !last
            ? `<button class="scroll-up" aria-label="scroll-up"><span class="symbol">${
                translations['Previous'][window.lang]
              }</span></button>
            <button class="scroll-down" aria-label="scroll-down"><span class="symbol">${
              translations['Next'][window.lang]
            }</span></button>`
            : ``
        }
      `
    })
  } else {
    scrollText.style.top = `-${windowHeight}px`
    document.querySelector('#legend').style.position = 'relative'

    if (!window.isMobile) {
      scrollText.style.right = `calc(100vw - 160%)`
    }
  }

  load()
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
RegExp.escape = function(s) {
  return s.replace(/[\/\\^$*+?.()|[\]{}]/g, '\\$&')
}

import mapboxgl from 'mapbox-gl'
import L from 'mapbox.js'
import Stickyfill from 'stickyfilljs'
import { polyfill } from 'es6-promise'
polyfill()

const load = () => {
  if (window.useLeaflet) {
    L.mapbox.accessToken =
      'pk.eyJ1IjoiaWxhYm1lZGlhIiwiYSI6ImNqcHZvemptYzAzYnI0N3BodDg4NXBlOTUifQ.BbL7RBI4fzWi8Yi4t3imxg'

    window.map = L.mapbox.map('map', null, {
      accessToken: L.mapbox.accessToken,
      scrollWheelZoom: false
    })

    L.mapbox
      .styleLayer('mapbox://styles/ilabmedia/cjp1vsq4012qc2smt2prznr0i')
      .addTo(window.map)

    let elements = document.querySelectorAll('.sticky')
    Stickyfill.add(elements)
  } else {
    mapboxgl.accessToken =
      'pk.eyJ1IjoiaWxhYm1lZGlhIiwiYSI6ImNpbHYycXZ2bTAxajZ1c2tzdWU1b3gydnYifQ.AHxl8pPZsjsqoz95-604nw'

    window.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/ilabmedia/cjp1vsq4012qc2smt2prznr0i',
      center: [195, -11.9602541],
      zoom: 2,
      bearing: 0,
      pitch: 0,
      scrollZoom: false,
      attributionControl: false,
      dragPan: window.isMobile ? false : true
    })
  }

  var legend = document.querySelector('#legend')
  legend.addEventListener('mousedown', () => {
    console.log('Center', map.getCenter())
    console.log('Pitch', map.getPitch())
    console.log('Zoom', map.getZoom())
  })

  let resizeEvent = window.document.createEvent('UIEvents')
  resizeEvent.initUIEvent('resize', true, false, window, 0)
  window.dispatchEvent(resizeEvent)
}
export default interactiveSetup

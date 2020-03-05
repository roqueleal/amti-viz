Highcharts.chart('hcContainer', {
    // Load Data in from Google Sheets
    data: {
      googleSpreadsheetKey: '1StrugkUfqaWP-VGFOSKXAhbCrft7H5RZvJ5uwrwXstA',
      googleSpreadsheetWorksheet: 1
    },
    // General Chart Options
    chart: {
      zoomType: 'x',
      type: 'line'
    },
    // Chart Title and Subtitle
    title: {
      text: "Chinese Ships Near Thitu Island"
    },
    subtitle: {
      text: "Click and drag to zoom in"
    },

    colors: ['#0078b2'],

    // Credits
    credits: {
      useHTML: true,
      enabled: true,
      href: false,
      text: "CSIS AMTI | Source: AMTI/Planet Labs",
      position: {
        y: -5
      }
    },
    // Chart Legend
    legend: {
      enabled: false
    //   title: {
    //     text: 'Legend Title<br/><span style="font-size: 12px; color: #808080; font-weight: normal">(Click to hide)</span>'
    //   },
    //   align: 'center',
    //   verticalAlign: 'bottom',
    //   layout: 'horizontal'
    },
    // Y Axis
    yAxis: {
      title: {
        text: "Ship Count"
      }
    },
    // Additional Plot Options
    plotOptions:
    {
      line: {
        marker: {
          enabled: false,
          symbol: "circle",
          radius: 3
        },
        lineWidth: 3
      }
    }
  })

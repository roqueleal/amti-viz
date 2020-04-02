Highcharts.chart('hcContainer', {
    // Load Data in from Google Sheets
    data: {
      googleSpreadsheetKey: '1Vmq1FhTzmhriH9OYygQYHwjV-hTZikH4z5WGFlIGPOA',
      googleSpreadsheetWorksheet: 1
    },
    // General Chart Options
    chart: {
      type: 'column'
    },
    // Chart Title and Subtitle
    title: {
      text: "Research Ships in the South China Sea"
    },
    subtitle: {
      text: "Some explainer text goes here"
    },
    // Credits
    credits: {
      enabled: true,
      href: false,
      text: "Source: Asia Maritime Transparency Initiative | CSIS"
    },
    // Chart Legend
    //legend: {
    //  title: {
    //    text: 'Ships<br/><span style="font-size: 12px; color: #808080; font-weight: normal">(Click to hide)</span>'
    //  },
    //  align: 'center',
    //  verticalAlign: 'bottom',
    //  layout: 'horizontal'
    //},
    // Y Axis
    yAxis: {
      title: {
        text: "Number of Ships (Per Country)"
      },
    },
    // Additional Plot Options
    plotOptions:
    {
      column: {
        //stacking: null, // Normal bar graph
        stacking: "normal", // Stacked bar graph
        dataLabels: {
            enabled: true,
        }
      }
    }
  })

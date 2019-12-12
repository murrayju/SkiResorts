export default {
  snowbird: {
    url: 'https://www.snowbird.com/lifts-trails/',
    selectors: {
      openLifts: $ =>
        $('.snow-report-lifts .listings .open .title')
          .map((i, item) => $(item).text())
          .get(),
      closedLifts: $ =>
        $('.snow-report-lifts .listings .closed .title')
          .map((i, item) => $(item).text())
          .get(),
      openRuns: $ =>
        $('.snow-report-trails .listings .open .title')
          .map((i, item) => $(item).text())
          .get()
          .filter(item => item !== 'Alpine Trail'),
      closedRuns: $ =>
        $('.snow-report-trails .listings .closed .title')
          .map((i, item) => $(item).text())
          .get()
          .filter(item => item !== 'Alpine Trail'),
    },
  },
  alta: {
    url: 'https://www.alta.com/conditions/daily-mountain-report/snow-report',
    selectors: {
      openLifts: $ =>
        $('#lift-status ~ .table-weather td:has(.fa-open)')
          .map(
            (i, item) =>
              $(item)
                .prev()
                .text()
                .trim()
                .split('\n')[0],
          )
          .get()
          .filter(item => item !== 'OPEN'),
      closedLifts: $ =>
        $('#lift-status ~ .table-weather td:has(.fa-closed)')
          .map(
            (i, item) =>
              $(item)
                .prev()
                .text()
                .trim()
                .split('\n')[0],
          )
          .get()
          .filter(item => item !== 'CLOSED'),
      openRuns: $ =>
        $('#expected-openings ~ .table-weather td:has(.open-status-open)')
          .map((i, item) =>
            $(item)
              .prev()
              .text(),
          )
          .get()
          .filter(item => item !== 'OPEN'),
      closedRuns: $ =>
        $('#expected-openings ~ .table-weather td:has(.open-status-closed)')
          .map((i, item) =>
            $(item)
              .prev()
              .text(),
          )
          .get()
          .filter(item => item !== 'CLOSED'),
    },
  },
};

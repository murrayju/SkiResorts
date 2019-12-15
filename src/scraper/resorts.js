export default {
  snowbird: [
    {
      url: 'https://www.snowbird.com/mountain-report/',
      selectors: {
        areas_open: $ =>
          $('.snow-report-gates .listings .open .title')
            .map((i, item) => $(item).text())
            .get(),
        areas_closed: $ =>
          $('.snow-report-gates .listings .closed .title')
            .map((i, item) => $(item).text())
            .get(),
        areas_pending: $ =>
          $('.snow-report-gates .listings .pending .title')
            .map((i, item) => $(item).text())
            .get(),
      },
    },
    {
      url: 'https://www.snowbird.com/lifts-trails/',
      selectors: {
        lifts_open: $ =>
          $('.snow-report-lifts .listings .open .title')
            .map((i, item) => $(item).text())
            .get(),
        lifts_closed: $ =>
          $('.snow-report-lifts .listings .closed .title')
            .map((i, item) => $(item).text())
            .get(),
        runs_open: $ =>
          $('.snow-report-trails .listings .open .title')
            .map((i, item) => $(item).text())
            .get()
            .filter(item => item !== 'Alpine Trail'),
        runs_closed: $ =>
          $('.snow-report-trails .listings .closed .title')
            .map((i, item) => $(item).text())
            .get()
            .filter(item => item !== 'Alpine Trail'),
      },
    },
  ],
  alta: [
    {
      url: 'https://www.alta.com/conditions/daily-mountain-report/snow-report',
      selectors: {
        lifts_open: $ =>
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
        lifts_closed: $ =>
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
        areas_open: $ =>
          $('#expected-openings ~ .table-weather td:has(.open-status-open)')
            .map((i, item) =>
              $(item)
                .prev()
                .text(),
            )
            .get()
            .filter(item => item !== 'OPEN'),
        areas_closed: $ =>
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
  ],
};

// @flow
import React, { useContext, useState, useEffect } from 'react';
import randomColor from 'randomcolor';
import { flow, map, filter, orderBy, sortBy } from 'lodash/fp';
import moment from 'moment';

import AppContext from '../contexts/AppContext';
import { Container } from './flex';
import Loading from './Loading';
import Paper from './Paper';
import LineGraph from './LineGraph';

const Areas = () => {
  const { fetch } = useContext(AppContext);
  const [data, setData] = useState([]);
  const [colors, setColors] = useState([]);

  useEffect(() => {
    fetch('/api/stats/areas', {
      method: 'GET',
    })
      .then(r => r.json())
      .then(setData);
  }, [fetch]);

  const numLines = Math.max(...data.map(r => r.data.length));
  useEffect(() => {
    if (numLines > 0) {
      setColors(
        randomColor({
          count: numLines,
          luminosity: 'dark',
          format: 'rgba',
          alpha: 0.4,
        }),
      );
    } else {
      setColors([]);
    }
  }, [numLines]);

  const now = moment();
  const lastWeek = moment(now).subtract(10, 'days');
  const lastYear = moment(now).subtract(1, 'year');

  return (
    <Container>
      {data ? (
        flow(
          sortBy(['_id']),
          map(resort => {
            const resortData = flow(
              sortBy(['name']),
              map(({ lastOpen, lastPending, lastClosed, status, transitions, ...rest }) => ({
                ...rest,
                status,
                transitions,
                lastOpen: lastOpen || lastYear,
                lastClosed: lastClosed || lastYear,
                lastPending: lastPending || lastYear,
                ...(status === 'open'
                  ? { openSince: transitions[transitions.length - 1].timestamp }
                  : null),
              })),
            )(resort.data);
            const closed = flow(
              filter(a => a.status === 'closed'),
              orderBy(['lastOpen', 'lastPending', 'lastClosed'], ['desc', 'desc', 'desc']),
            )(resortData);
            const pending = flow(
              filter(a => a.status === 'pending'),
              orderBy(['lastOpen', 'lastClosed'], ['desc', 'desc']),
            )(resortData);
            const open = flow(
              filter(a => a.status === 'open'),
              orderBy(['openSince', 'lastPending', 'lastClosed'], ['desc', 'desc', 'desc']),
            )(resortData);
            return (
              <Paper key={resort._id}>
                <h1>{resort._id}</h1>
                <LineGraph
                  data={{
                    datasets: resortData.map((area, i) => ({
                      label: area.name,
                      steppedLine: true,
                      lineTension: 0,
                      borderColor: colors[i],
                      hoverBorderWidth: 3,
                      pointRadius: 5,
                      pointHitRadius: 5,
                      data: [
                        ...flow(
                          filter(t => moment(t.timestamp).isAfter(lastWeek)),
                          map(t => ({
                            x: t.timestamp,
                            y: t.status,
                          })),
                        )(area.transitions),
                        {
                          x: area.updated || now,
                          y: area.status || 'unknown',
                        },
                      ],
                    })),
                  }}
                  options={{
                    scales: {
                      yAxes: [
                        {
                          type: 'category',
                          labels: ['closed', 'pending', 'open'],
                        },
                      ],
                      xAxes: [
                        {
                          type: 'time',
                          time: {
                            unit: 'day',
                          },
                        },
                      ],
                    },
                  }}
                />
                {pending.length ? (
                  <div>
                    <h3>pending</h3>
                    {pending.map(a => (
                      <div>
                        {a.name}: last open{' '}
                        {a.lastOpen ? moment(a.lastOpen).fromNow() : 'last year'}
                      </div>
                    ))}
                  </div>
                ) : null}
                {open.length ? (
                  <div>
                    <h3>open</h3>
                    {open.map(a => (
                      <div>
                        {a.name}: has been open{' '}
                        {a.openSince ? moment(a.openSince).fromNow(true) : 'all season'}
                      </div>
                    ))}
                  </div>
                ) : null}
                {closed.length ? (
                  <div>
                    <h3>closed</h3>
                    {closed.map(a => (
                      <div>
                        {a.name}: last open{' '}
                        {a.lastOpen ? moment(a.lastOpen).fromNow() : 'last year'}
                      </div>
                    ))}
                  </div>
                ) : null}
              </Paper>
            );
          }),
        )(data)
      ) : (
        <Loading what="ski area statistics" />
      )}
    </Container>
  );
};

export default Areas;

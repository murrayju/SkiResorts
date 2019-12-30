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

  const numLines = Math.max(...data.map(r => r.areas.length));
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

  return (
    <Container>
      {data ? (
        sortBy(['_id'])(data).map(resort => {
          const closed = flow(
            filter(a => a.status === 'closed'),
            orderBy(['lastOpen', 'lastClosed'], ['desc', 'desc']),
          )(resort.areas);
          const pending = flow(
            filter(a => a.status === 'pending'),
            orderBy(['lastOpen', 'lastClosed'], ['desc', 'desc']),
          )(resort.areas);
          const open = flow(
            filter(a => a.status === 'open'),
            orderBy(['lastClosed'], ['desc']),
          )(resort.areas);
          return (
            <Paper key={resort._id}>
              <h1>{resort._id}</h1>
              <LineGraph
                data={{
                  datasets: resort.areas.map((area, i) => ({
                    label: area.name,
                    // steppedLine: true,
                    lineTension: 0,
                    // backgroundColor: 'transparent',
                    borderColor: colors[i],
                    hoverBorderColor:
                      area.status === 'open'
                        ? 'green'
                        : area.status === 'pending'
                        ? 'orange'
                        : area.status === 'closed'
                        ? 'red'
                        : 'black',
                    hoverBorderWidth: 3,
                    pointRadius: 5,
                    pointHitRadius: 5,
                    data: [
                      ...area.transitions.map(t => ({
                        x: t.timestamp,
                        y: t.status,
                      })),
                      {
                        x: Date.now(),
                        y: area.status,
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
                      {a.name}: last open {a.lastOpen ? moment(a.lastOpen).fromNow() : 'last year'}
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
                      {a.lastClosed ? moment(a.lastClosed).fromNow(true) : 'all season'}
                    </div>
                  ))}
                </div>
              ) : null}
              {closed.length ? (
                <div>
                  <h3>closed</h3>
                  {closed.map(a => (
                    <div>
                      {a.name}: last open {a.lastOpen ? moment(a.lastOpen).fromNow() : 'last year'}
                    </div>
                  ))}
                </div>
              ) : null}
            </Paper>
          );
        })
      ) : (
        <Loading what="ski area statistics" />
      )}
    </Container>
  );
};

export default Areas;

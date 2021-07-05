// @flow
import { filter, flow, map, orderBy, sortBy } from 'lodash/fp';
import moment from 'moment';
import randomColor from 'randomcolor';
import React, { useEffect, useState } from 'react';

import LineGraph from './LineGraph';
import Paper from './Paper';

type ResortStatus = 'open' | 'closed' | 'pending';

type StatusSnap = {
  timestamp: string,
  status: ResortStatus,
};

type ResortStatsData = {
  name: string,
  status: ResortStatus,
  transitions: StatusSnap[],
  updated?: string,
  lastOpen?: string,
  lastClosed?: string,
  lastPending?: string,
};

type ResortStats = {
  _id: string,
  data: ResortStatsData[],
};

type Props = {
  resort: ResortStats,
  graphHeight?: number,
};

const ResortStatsCard = ({ resort, graphHeight }: Props) => {
  const [colors, setColors] = useState([]);

  const numLines = resort.data.length;
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
  const lastYear = moment(now).subtract(1, 'year');

  const resortData = flow(
    sortBy(['name']),
    map(({ lastOpen, lastPending, lastClosed, status, transitions, ...rest }) => ({
      ...rest,
      status,
      transitions,
      lastOpen: lastOpen || lastYear,
      lastClosed: lastClosed || lastYear,
      lastPending: lastPending || lastYear,
      ...(status === 'open' ? { openSince: transitions[transitions.length - 1].timestamp } : null),
    })),
  )(resort.data);
  const closed = flow(
    filter((a) => a.status === 'closed'),
    orderBy(['lastOpen', 'lastPending', 'lastClosed'], ['asc', 'desc', 'desc']),
  )(resortData);
  const pending = flow(
    filter((a) => a.status === 'pending'),
    orderBy(['lastOpen', 'lastClosed'], ['asc', 'desc']),
  )(resortData);
  const open = flow(
    filter((a) => a.status === 'open'),
    orderBy(['openSince', 'lastPending', 'lastClosed'], ['desc', 'desc', 'desc']),
  )(resortData);
  const primary = pending[0] || open[0] || closed[0];
  return (
    <Paper>
      <h2>{resort._id}</h2>
      <LineGraph
        height={graphHeight}
        data={{
          datasets: resortData.map((area, i) => ({
            label: area.name || '<empty>',
            steppedLine: true,
            lineTension: 0,
            borderColor: colors[i],
            hoverBorderWidth: 3,
            pointRadius: 5,
            pointHitRadius: 5,
            hidden: area !== primary,
            data: [
              ...flow(
                map((t) => ({
                  x: moment(t.timestamp),
                  y: t.status,
                })),
              )(area.transitions),
              {
                x: moment(area.updated || now),
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
                  unit: 'hour',
                  unitStepSize: 6,
                  displayFormats: {
                    hour: 'hA ddd',
                  },
                },
              },
            ],
          },
          legend: {
            onClick(e, item) {
              const { chart } = this;
              const { datasetIndex: index } = item;
              const { datasets } = chart.data;
              const { length } = datasets;
              const metas = Array.from({ length }).map((x, i) => chart.getDatasetMeta(i));
              const isHidden = (i) =>
                metas[i].hidden == null ? datasets[i].hidden : metas[i].hidden;
              const hideStates = Array.from({ length }).map((x, i) => isHidden(i));

              if (hideStates.every((h) => !h)) {
                // nothing hidden, hide all but the one clicked
                metas.forEach((m, i) => {
                  // eslint-disable-next-line no-param-reassign
                  m.hidden = i !== index;
                });
              } else if (hideStates.filter((h) => !h).length === 1) {
                // only one thing is currently shown
                if (index === hideStates.findIndex((h) => !h)) {
                  // it's the one that was clicked, toggle showing all
                  metas.forEach((m) => {
                    // eslint-disable-next-line no-param-reassign
                    m.hidden = false;
                  });
                } else {
                  // toggle only the one clicked
                  metas[index].hidden = false;
                }
              } else {
                // toggle only the one clicked
                metas[index].hidden = !hideStates[index];
              }
              chart.update();
            },
          },
        }}
      />
      {pending.length ? (
        <div>
          <h3>pending</h3>
          {pending.map((a) => (
            <div key={a.name}>
              {a.name}: last open {a.lastOpen ? moment(a.lastOpen).fromNow() : 'last year'}
            </div>
          ))}
        </div>
      ) : null}
      {open.length ? (
        <div>
          <h3>open</h3>
          {open.map((a) => (
            <div key={a.name}>
              {a.name}: has been open{' '}
              {a.openSince ? moment(a.openSince).fromNow(true) : 'all season'}
            </div>
          ))}
        </div>
      ) : null}
      {closed.length ? (
        <div>
          <h3>closed</h3>
          {closed.map((a) => (
            <div key={a.name}>
              {a.name}: last open {a.lastOpen ? moment(a.lastOpen).fromNow() : 'last year'}
            </div>
          ))}
        </div>
      ) : null}
    </Paper>
  );
};
ResortStatsCard.defaultProps = {
  graphHeight: 400,
};

export default ResortStatsCard;

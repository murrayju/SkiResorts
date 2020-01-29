// @flow
import React, { useState, useEffect } from 'react';
import randomColor from 'randomcolor';
import { flow, map, filter } from 'lodash/fp';
import moment from 'moment';

import Paper from './Paper';
import LineGraph from './LineGraph';
import { FormGroupFlowBox } from './flex';

type WeatherData = {
  lastUpdated: string,
  snowSince4amInches?: ?number,
  snowSince4pmYesterdayInches?: ?number,
  snowSince4amYesterdayInches?: ?number,
  stormTotalInches?: ?number,
  seasonTotalInches?: ?number,
  baseDepthInches?: ?number,
  tempF?: ?number,
  skyCover?: ?string,
  windSpeed?: ?string,
  windSpeedMph?: ?number,
  windGustMph?: ?number,
  windDirection?: ?(string | number),
  hourlyWaterInches?: ?number,
  waterSince4amInches?: ?number,
  '12hrSnowInches'?: ?number,
  '24hrSnowInches'?: ?number,
  '48hrSnowInches'?: ?number,
  hourlySnowInches?: ?number,
  snowSince4amInches?: ?number,
  humidity?: ?number,
};

type ResortWeather = {
  _id: string,
  summary: WeatherData[],
  base: WeatherData[],
  mid: WeatherData[],
  top: WeatherData[],
};

type Props = {
  resort: ResortWeather,
  graphHeight?: number,
};

type GraphLine = {
  label: string,
  src: WeatherData[],
  prop: string,
  axis?: string,
  ownAxis?: boolean,
};

type Graph = {
  name: string,
  data: GraphLine[],
};

const timeChoices = {
  '10d': { value: 10, unit: 'day', unitStepSize: 1 },
  '5d': { value: 5, unit: 'day', unitStepSize: 1 },
  '48h': { value: 48, unit: 'hour', unitStepSize: 2 },
  '24h': { value: 24, unit: 'hour', unitStepSize: 2 },
  '12h': { value: 12, unit: 'hour', unitStepSize: 1 },
};

const ResortWeatherCard = ({ resort, graphHeight }: Props) => {
  const [colors, setColors] = useState([]);
  const [timeChoice, setTimeChoice] = useState('48h');

  const { value: timeValue, unit, unitStepSize } = timeChoices[timeChoice];
  const timeLimit = moment().subtract(timeValue, unit);

  const numLines = 20;
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

  const { summary, base, mid, top } = resort;

  const graphs: Graph[] = [
    {
      name: 'Recent Snow',
      data: [
        { label: 'storm total', src: summary, prop: 'stormTotalInches' },
        { label: '12hr snow', src: summary, prop: '12hrSnowInches' },
        { label: '12hr snow (mid-mtn)', src: mid, prop: '12hrSnowInches' },
        { label: '24hr snow', src: summary, prop: '24hrSnowInches' },
        { label: '48hr snow', src: summary, prop: '48hrSnowInches' },
        { label: 'since 4am', src: summary, prop: 'snowSince4amInches' },
        { label: 'since 4pm yesterday', src: summary, prop: 'snowSince4pmYesterdayInches' },
        { label: 'since 4am yesterday', src: summary, prop: 'snowSince4amYesterdayInches' },
      ],
    },
    {
      name: 'Total Snow',
      data: [
        { label: 'base depth', src: summary, prop: 'baseDepthInches' },
        { label: 'season total', src: summary, prop: 'seasonTotalInches', ownAxis: true },
      ],
    },
    {
      name: 'Temperature',
      data: [
        { label: 'base temp', src: base, prop: 'tempF' },
        { label: 'mid-mtn temp', src: mid, prop: 'tempF' },
        { label: 'peak temp', src: top, prop: 'tempF' },
      ],
    },
    {
      name: 'Wind',
      data: [
        { label: 'base wind speed', src: base, prop: 'windSpeedMph' },
        { label: 'mid-mtn wind speed', src: mid, prop: 'windSpeedMph' },
        { label: 'peak wind speed', src: top, prop: 'windSpeedMph' },
        { label: 'base wind gusts', src: base, prop: 'windGustMph' },
        { label: 'mid-mtn wind gusts', src: mid, prop: 'windGustMph' },
        { label: 'peak wind gusts', src: top, prop: 'windGustMph' },
      ],
    },
  ];

  return (
    <Paper>
      <h2>{resort._id}</h2>
      <FormGroupFlowBox>
        {Object.keys(timeChoices).map(k => (
          <label key={k} htmlFor={k} css="padding-left: 10px;">
            <input
              css="&& { margin-right: 5px; }"
              type="radio"
              id={k}
              value={k}
              checked={timeChoice === k}
              onChange={({ currentTarget: { value } }) => {
                setTimeChoice(value);
              }}
            />
            {k}
          </label>
        ))}
      </FormGroupFlowBox>
      {graphs.map(graph => (
        <LineGraph
          key={graph.name}
          height={graphHeight}
          data={{
            datasets: graph.data
              .filter(({ src, prop }) => src?.some(d => d[prop] != null))
              .map(({ label, src, prop, axis, ownAxis }, i) => ({
                label,
                borderColor: colors[i],
                yAxisID: axis || (ownAxis ? prop : 'default'),
                data: flow(
                  filter(t => t[prop] != null && moment(t.lastUpdated).isAfter(timeLimit)),
                  map(t => ({
                    x: moment(t.lastUpdated),
                    y: t[prop],
                  })),
                )(src),
              })),
          }}
          options={{
            scales: {
              xAxes: [
                {
                  type: 'time',
                  time: {
                    unit,
                    unitStepSize,
                    displayFormats: {
                      hour: 'hA ddd',
                    },
                  },
                },
              ],
              yAxes: [
                { id: 'default', type: 'linear', display: 'auto' },
                ...graph.data.map(({ prop, axis }) => ({
                  id: axis || prop,
                  type: 'linear',
                  display: 'auto',
                })),
              ],
            },
          }}
        />
      ))}
    </Paper>
  );
};
ResortWeatherCard.defaultProps = {
  graphHeight: 400,
};

export default ResortWeatherCard;

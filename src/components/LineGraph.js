// @flow
import type { ChartOptions } from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';

const ChartBox = styled.div`
  position: relative;
`;

type DefaultProps = {|
  height: number,
  options: ?ChartOptions,
|};

type Props = {
  ...DefaultProps,
};

const LineGraph = ({ height, options, ...props }: Props) => {
  return (
    <ChartBox>
      <Line
        height={height || 400}
        options={{
          maintainAspectRatio: false,
          ...options,
          scales: {
            yAxes: [
              {
                type: 'linear',
              },
            ],
            xAxes: [
              {
                type: 'time',
                time: {
                  unit: 'second',
                },
              },
            ],
            ...options?.scales,
          },
          layout: {
            padding: 6,
            ...options?.layout,
          },
        }}
        // $FlowFixMe
        {...props}
      />
    </ChartBox>
  );
};
LineGraph.defaultProps = ({
  height: 400,
  options: null,
}: DefaultProps);

export default LineGraph;

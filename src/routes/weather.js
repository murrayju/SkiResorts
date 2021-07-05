// @flow
import React from 'react';

import ResortWeatherPage from '../components/ResortWeatherPage';

export default async function action() {
  return {
    title: 'Weather',
    chunks: ['weather'],
    component: <ResortWeatherPage />,
  };
}

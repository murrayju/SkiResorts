// @flow
import React from 'react';

import ResortStatsPage from '../components/ResortStatsPage';

export default async function action() {
  return {
    title: 'Runs',
    chunks: ['runs'],
    component: <ResortStatsPage stat="runs" title="Resort Runs" graphHeight={1000} />,
  };
}

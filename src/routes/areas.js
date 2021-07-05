// @flow
import React from 'react';

import ResortStatsPage from '../components/ResortStatsPage';

export default async function action() {
  return {
    title: 'Areas',
    chunks: ['areas'],
    component: <ResortStatsPage stat="areas" title="Resort Areas" />,
  };
}

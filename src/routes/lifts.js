// @flow
import React from 'react';
import ResortStatsPage from '../components/ResortStatsPage';

export default async function action() {
  return {
    title: 'Lifts',
    chunks: ['lifts'],
    component: <ResortStatsPage stat="lifts" title="Resort Lifts" />,
  };
}

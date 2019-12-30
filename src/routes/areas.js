import React from 'react';
import Areas from '../components/Areas';

export default async function action() {
  return {
    title: 'Areas',
    chunks: ['areas'],
    component: <Areas />,
  };
}

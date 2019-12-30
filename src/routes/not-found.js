import React from 'react';
import NotFound from '../components/NotFound';

const title = 'Page Not Found';

export default function action() {
  return {
    chunks: ['not-found'],
    title,
    component: <NotFound title={title} />,
    status: 404,
  };
}

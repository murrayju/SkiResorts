import React from 'react';
import ErrorPage from '../components/ErrorPage';

export default function action() {
  return {
    title: 'Error',
    component: <ErrorPage />,
  };
}

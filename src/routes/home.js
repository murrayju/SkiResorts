import React from 'react';
import Home from '../components/Home';

export default async function action() {
  return {
    title: 'Home',
    chunks: ['home'],
    component: <Home />,
  };
}

// @flow
import { flow, map, sortBy } from 'lodash/fp';
import React, { useContext, useEffect, useState } from 'react';

import AppContext from '../contexts/AppContext';

import { Container } from './flex';
import Loading from './Loading';
import ResortWeatherCard from './ResortWeatherCard';

type Props = {
  graphHeight?: number,
};
const ResortWeatherPage = ({ graphHeight }: Props) => {
  const { fetch } = useContext(AppContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(null);
    fetch('/api/stats/weather', {
      method: 'GET',
    })
      .then((r) => r.json())
      .then(setData);
  }, [fetch]);

  return (
    <Container>
      <h1>Weather</h1>
      {data ? (
        flow(
          sortBy(['_id']),
          map((resort) => (
            <ResortWeatherCard resort={resort} graphHeight={graphHeight} key={resort._id} />
          )),
        )(data)
      ) : (
        <Loading what="weather statistics" />
      )}
    </Container>
  );
};
ResortWeatherPage.defaultProps = {
  graphHeight: 400,
};

export default ResortWeatherPage;

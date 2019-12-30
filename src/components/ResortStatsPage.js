// @flow
import React, { useContext, useState, useEffect } from 'react';
import { flow, map, sortBy } from 'lodash/fp';

import AppContext from '../contexts/AppContext';
import { Container } from './flex';
import Loading from './Loading';
import ResortStatsCard from './ResortStatsCard';

type Props = {
  stat: string,
  title: string,
  graphHeight?: number,
};
const ResortStatsPage = ({ stat, title, graphHeight }: Props) => {
  const { fetch } = useContext(AppContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(null);
    fetch(`/api/stats/${stat}`, {
      method: 'GET',
    })
      .then(r => r.json())
      .then(setData);
  }, [stat, fetch]);

  return (
    <Container>
      <h1>{title}</h1>
      {data ? (
        flow(
          sortBy(['_id']),
          map(resort => <ResortStatsCard resort={resort} graphHeight={graphHeight} />),
        )(data)
      ) : (
        <Loading what="ski statistics" />
      )}
    </Container>
  );
};
ResortStatsPage.defaultProps = {
  graphHeight: 400,
};

export default ResortStatsPage;

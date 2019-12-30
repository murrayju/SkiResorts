// @flow
import React, { useContext, useState, useEffect } from 'react';
import AppContext from '../contexts/AppContext';
import { Container } from './flex';
import Loading from './Loading';
import Paper from './Paper';

const Home = () => {
  const { fetch } = useContext(AppContext);
  const [data, setData] = useState('');

  useEffect(() => {
    fetch('/api/stats/areas', {
      method: 'GET',
    })
      .then(r => r.json())
      .then(setData);
  }, [fetch]);

  return (
    <Container>
      {data ? (
        data.map(resort => (
          <Paper>
            <h1>{resort._id}</h1>
            <div>
              {resort.areas.map(area => (
                <div>
                  {area.name}: {area.status}
                </div>
              ))}
            </div>
          </Paper>
        ))
      ) : (
        <Loading what="ski area statistics" />
      )}
    </Container>
  );
};

export default Home;

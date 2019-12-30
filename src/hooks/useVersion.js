// @flow
import { useContext, useState, useEffect } from 'react';
import AppContext from '../contexts/AppContext';

const useVersion = () => {
  const { fetch } = useContext(AppContext);
  const [version, setVersion] = useState('');

  useEffect(() => {
    fetch('/api/version', {
      method: 'GET',
    })
      .then(r => r.json())
      .then(({ version: v }) => setVersion(v));
  }, [fetch]);

  return [version];
};

export default useVersion;

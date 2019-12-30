// @flow
import React from 'react';
import type { Node as ReactNode } from 'react';

import Layout from './Layout';

type Props = {
  children: ReactNode,
};
const App = ({ children }: Props) => <Layout container>{children}</Layout>;
export default App;

// @flow
import styled from 'styled-components';
import type { ComponentType } from 'react';

type Props = {
  row?: boolean,
  alignItems?: string,
};

const MainContainer: ComponentType<Props> = styled.div`
  flex: 1 1;
  width: 100%;
  position: relative;
  overflow: auto;
  padding: 10px;
  display: flex;
  flex-flow: ${({ row }) => (row ? 'row' : 'column')} nowrap;
  align-items: ${({ alignItems }) => alignItems};

  > .container {
    padding: 0;
  }
`;

export default MainContainer;

// @flow
import { position } from 'polished';
import React, { useState } from 'react';
import type { Node as ReactNode } from 'react';
import styled, { ThemeProvider } from 'styled-components';

// external-global styles must be imported in your JS.
import Header from './Header';
import MainContainer from './MainContainer';
import Sidebar from './Sidebar';

// used by styled-components
// this should match the values in aura
const bsTheme = {
  brand: {
    primary: '#337ab7', // DMA Light blue
    primaryDark: '#0962ac', // DMA Dark blue
    success: '#5cb85c', // DMA A green we use sometimes, subject to change.
    info: '#5bc0de',
    warning: '#f0ad4e', // DMA Orange
    danger: '#d9534f', // DMA Red
    black: '#000', // Used for text and other elements
    gray1: '#222', // Used for icons and secondary text
    gray2: '#333', // Used for watermarks and dark borders
    gray3: '#555', // Used for light borders
    gray4: '#777', // Used for off-white backgrounds
    gray5: '#eee', // Used for button gradients and almost white objects
    white: '#fff',
  },
  primaryGradient: {
    start: '#0962ac',
    mid: '#71a3cc',
    end: '#e2eaf0',
  },
  screen: {
    xsMax: '767.98px',
    smMin: '768px',
    smMax: '991.98px',
    mdMin: '992px',
    mdMax: '1199.98px',
    lgMin: '1200px',
  },
};

const ContentRoot = styled.div`
  ${position('fixed', '40px', 0, 0, 0)}
  display: flex;
  background-color: ${({ theme }) => theme.brand.gray5};
  overflow: auto;

  th {
    background-color: #f5f5f5;
  }
`;

type Props = {
  container?: boolean,
  row?: boolean,
  children: ReactNode,
  alignItems?: string,
};

const Layout = ({ container, children, ...props }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <ThemeProvider theme={bsTheme}>
      <>
        <Header menuActive={menuOpen} onMenuClick={() => setMenuOpen((o) => !o)} />
        <ContentRoot>
          {menuOpen ? <Sidebar /> : null}
          {container ? <MainContainer {...props}>{children}</MainContainer> : children}
        </ContentRoot>
      </>
    </ThemeProvider>
  );
};
Layout.defaultProps = {
  container: false,
  row: false,
  alignItems: 'center',
};

export default Layout;

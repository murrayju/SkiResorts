// @flow
import React from 'react';
import { Navbar } from 'react-bootstrap';
import styled from 'styled-components';

import useVersion from '../hooks/useVersion';

import Icon from './Icon';
import Link from './Link';

const StyledNavbar = styled(Navbar)`
  && {
    box-shadow: none;
  }
`;

const Title = styled(Link)`
  && {
    font-size: 20px;
    font-weight: bold;
    line-height: 20px;

    > i {
      padding-right: 7px;
    }
  }
`;

const MenuBtn = styled(Navbar.Brand)`
  && {
    padding: 10px 15px;
    margin-right: 15px;
    cursor: pointer;
    width: 45px;
    height: 40px;
    &,
    &&:hover {
      background-color: ${({ active }) => (active ? '#000' : null)};
    }
  }
`;

type Props = {
  onMenuClick?: ?Function,
  menuActive?: boolean,
};
const Header = ({ onMenuClick, menuActive }: Props) => {
  const [version] = useVersion();

  return (
    <StyledNavbar fixedTop fluid inverse>
      <Navbar.Header>
        <MenuBtn active={menuActive}>
          <Icon onClick={onMenuClick} name="bars" />
        </MenuBtn>
        <Navbar.Brand>
          <Title to="/">
            <Icon name="skiing" />
            SkiReports
          </Title>
        </Navbar.Brand>
      </Navbar.Header>
      <Navbar.Collapse>{version ? <Navbar.Text>v{version}</Navbar.Text> : null}</Navbar.Collapse>
    </StyledNavbar>
  );
};
Header.defaultProps = {
  onMenuClick: null,
  menuActive: false,
};

export default Header;

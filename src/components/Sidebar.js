// @flow
import React, { useContext } from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import styled from 'styled-components';

import AppContext from '../contexts/AppContext';

import Icon from './Icon';
import { withLink } from './Link';

const NavItemLinkStyled = styled(withLink()(NavItem))`
  font-size: 16px;
`;

type NavItemLinkProps = {
  to: string,
};
const NavItemLink = ({ to, ...props }: NavItemLinkProps) => {
  const { pathname } = useContext(AppContext);
  return <NavItemLinkStyled {...props} to={to} active={pathname === to} />;
};

const SidebarStyled = styled.div`
  width: 200px;
  background-color: rgba(0, 0, 0, 0.05);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  padding: 5px;
  overflow-y: auto;
`;

const Sidebar = () => (
  <SidebarStyled>
    <Nav stacked className="nav-pills">
      <NavItemLink to="/">
        <Icon name="mountain" pad="md" fw /> Areas
      </NavItemLink>
      <NavItemLink to="/lifts">
        <Icon name="tram" pad="md" fw /> Lifts
      </NavItemLink>
      <NavItemLink to="/runs">
        <Icon name="road" pad="md" fw /> Runs
      </NavItemLink>
      <NavItemLink to="/weather">
        <Icon name="snowflake" pad="md" fw /> Weather
      </NavItemLink>
    </Nav>
  </SidebarStyled>
);
export default Sidebar;

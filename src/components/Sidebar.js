// @flow
import React, { useContext } from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import styled from 'styled-components';

import Icon from './Icon';
import { withLink } from './Link';
import useVersion from '../hooks/useVersion';
import AppContext from '../contexts/AppContext';

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

const Sidebar = () => {
  const [version] = useVersion();

  return (
    <SidebarStyled>
      <Nav stacked className="nav-pills">
        <NavItemLink to="/">
          <Icon name="home" pad="md" /> Areas
        </NavItemLink>
        {version ? <NavItem disabled>v{version}</NavItem> : null}
      </Nav>
    </SidebarStyled>
  );
};

export default Sidebar;

import React from 'react';

import {
  Header, Container, FooterMenu, SideMenu,
} from './styles';

import { useOrientation } from '../../helper/useOrientation';

const Whiteboard = () => {
  const orientation = useOrientation();

  return (
    <Container>
      <Header />
      {orientation === 'PORTRAIT' && <FooterMenu />}
      {orientation === 'LANDSCAPE' && <SideMenu />}
    </Container>
  );
};

export default Whiteboard;

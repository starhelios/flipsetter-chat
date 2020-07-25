import React, { useState } from 'react';

import {
  Header, Container, FooterMenu,
} from './styles';

import { useOrientation } from '../../helper/useOrientation';

const Whiteboard = () => {
  const [openLeftMenu, updateLeftMenu] = useState(false);

  const handleToggleLeftMenu = (toggle) => {
    updateLeftMenu(toggle || !openLeftMenu);
  };

  const orientation = useOrientation();

  return (
    <Container>
      <Header />
      {orientation === 'PORTRAIT' && <FooterMenu />}
      {/*{orientation === 'LANDSCAPE' && <RightMenu />}*/}
    </Container>
  );
};

export default Whiteboard;

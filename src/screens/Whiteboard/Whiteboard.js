import React, { useState } from 'react';

import {
  Header, Container, MenuLeft, RightMenu,
} from './styles';

import { useOrientation } from '../../helper/useOrientation';

const Whiteboard = () => {
  const [openLeftMenu, updateLeftMenu] = useState(false);

  const handleToggleLeftMenu = (toggle) => {
    updateLeftMenu(toggle || !openLeftMenu);
  };

  const orientation = useOrientation();

  return (
    <MenuLeft isOpen={openLeftMenu} onChange={handleToggleLeftMenu}>
      <Container>
        <Header
          onToggleMenu={handleToggleLeftMenu}
          isOpenedMenu={openLeftMenu}
        />
        {orientation === 'PORTRAIT' && <RightMenu />}
      </Container>
    </MenuLeft>
  );
};

export default Whiteboard;

import React, { useState } from 'react';
import Animated from 'react-native-reanimated';
import { mix, useTransition } from 'react-native-redash';

import {
  Container, Icon, BackgroundColorMenu, MenuWrapper, InsertFileMenu,
} from './style';

import {
  magicPointerIcon, uploadImageIcon, pencilIcon, eraserIcon, palitraIcon, fillIcon,
} from '../../../images';

import { useOrientation } from '../../../helper/useOrientation';

export const FooterMenu = () => {
  const [isBackgroundColorMenuOpen, onToggleBackgroundColorMenu] = useState(false);
  const [isInsertFileMenuOpen, onToggleInsertFileMenuMenu] = useState(false);
  const closeMenus = () => {
    onToggleBackgroundColorMenu(false);
    onToggleInsertFileMenuMenu(false);
  };
  const orientation = useOrientation(closeMenus);

  const transitionBackgroundColor = useTransition((orientation === 'PORTRAIT') && isBackgroundColorMenuOpen, {
    duration: 200,
  });

  const transitionInsertFileMenu = useTransition((orientation === 'PORTRAIT') && isInsertFileMenuOpen, {
    duration: 200,
  });

  const heightBackgroundColorMenu = mix(transitionBackgroundColor, 0, 350);
  const heightInsertFileMenu = mix(transitionInsertFileMenu, 0, 240);

  return (
    <>
      <Container isHorizontal>
        <Icon iconSource={magicPointerIcon} onPress={closeMenus} />
        <Icon iconSource={pencilIcon} onPress={closeMenus} />
        <Icon iconSource={eraserIcon} onPress={closeMenus} />
        <Icon iconSource={palitraIcon} onPress={closeMenus} />
        <Icon
          iconSource={fillIcon}
          onPress={() => {
            closeMenus();
            onToggleBackgroundColorMenu(!isBackgroundColorMenuOpen);
          }}
        />
        <Icon
          iconSource={uploadImageIcon}
          onPress={() => {
            closeMenus();
            onToggleInsertFileMenuMenu(!isInsertFileMenuOpen);
          }}
        />
        <MenuWrapper
          as={Animated.View}
          style={{
            height: heightBackgroundColorMenu,
            borderTopWidth: isBackgroundColorMenuOpen ? 1 : 0,
            borderBottomWidth: isBackgroundColorMenuOpen ? 1 : 0,
          }}
        >
          <BackgroundColorMenu />
        </MenuWrapper>
        <MenuWrapper
          as={Animated.View}
          style={{
            height: heightInsertFileMenu,
            borderTopWidth: isInsertFileMenuOpen ? 1 : 0,
            borderBottomWidth: isInsertFileMenuOpen ? 1 : 0,
          }}
        >
          <InsertFileMenu />
        </MenuWrapper>
      </Container>
    </>
  );
};

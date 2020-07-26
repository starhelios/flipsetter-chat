import React, { useState } from 'react';
import Animated from 'react-native-reanimated';
import { mix, useTransition } from 'react-native-redash';

import {
  Container, Icon, BackgroundColorMenu, MenuWrapper, InsertFileMenu, BrushStyleMenu, EraserSizeMenu, SelectColorMenu
} from './style';

import {
  magicPointerIcon, uploadImageIcon, pencilIcon, eraserIcon, palitraIcon, fillIcon,
} from '../../../images';

import { useOrientation } from '../../../helper/useOrientation';

export const FooterMenu = () => {
  const [isBackgroundColorMenuOpen, onToggleBackgroundColorMenu] = useState(false);
  const [isInsertFileMenuOpen, onToggleInsertFileMenu] = useState(false);
  const [isBrushStyleMenuOpen, onToggleBrushStyleMenu] = useState(false);
  const [isEraserMenuOpen, onToggleEraserMenu] = useState(false);
  const [isSelectColorMenuOpen, onSelectColorMenu] = useState(false);
  const closeMenus = () => {
    onToggleBackgroundColorMenu(false);
    onToggleInsertFileMenu(false);
    onToggleBrushStyleMenu(false);
    onToggleEraserMenu(false);
    onSelectColorMenu(false);
  };
  const orientation = useOrientation(closeMenus);

  const transitionBackgroundColor = useTransition((orientation === 'PORTRAIT') && isBackgroundColorMenuOpen, {
    duration: 200,
  });
  const transitionInsertFileMenu = useTransition((orientation === 'PORTRAIT') && isInsertFileMenuOpen, {
    duration: 200,
  });
  const transitionBrushStyleMenu = useTransition((orientation === 'PORTRAIT') && isBrushStyleMenuOpen, {
    duration: 200,
  });
  const transitionEraserMenu = useTransition((orientation === 'PORTRAIT') && isEraserMenuOpen, {
    duration: 200,
  });
  const transitionSelectColorMenu = useTransition((orientation === 'PORTRAIT') && isSelectColorMenuOpen, {
    duration: 200,
  });

  const heightBackgroundColorMenu = mix(transitionBackgroundColor, 0, 350);
  const heightInsertFileMenu = mix(transitionInsertFileMenu, 0, 240);
  const heightBrushStyleMenu = mix(transitionBrushStyleMenu, 0, 275);
  const heightEraserMenu = mix(transitionEraserMenu, 0, 160);
  const heightSelectColorMenu = mix(transitionSelectColorMenu, 0, 330);

  return (
    <>
      <Container isHorizontal>
        <Icon iconSource={magicPointerIcon} onPress={closeMenus} />
        <Icon
          isChoosen={isBrushStyleMenuOpen}
          iconSource={pencilIcon}
          onPress={() => {
            closeMenus();
            onToggleBrushStyleMenu(!isBrushStyleMenuOpen);
          }}
        />
        <Icon
          isChoosen={isEraserMenuOpen}
          iconSource={eraserIcon}
          onPress={() => {
            closeMenus();
            onToggleEraserMenu(!isEraserMenuOpen);
          }}
        />
        <Icon
          isChoosen={isSelectColorMenuOpen}
          iconSource={palitraIcon}
          onPress={() => {
            closeMenus();
            onSelectColorMenu(!isSelectColorMenuOpen);
          }}
        />
        <Icon
          isChoosen={isBackgroundColorMenuOpen}
          iconSource={fillIcon}
          onPress={() => {
            closeMenus();
            onToggleBackgroundColorMenu(!isBackgroundColorMenuOpen);
          }}
        />
        <Icon
          isChoosen={isInsertFileMenuOpen}
          iconSource={uploadImageIcon}
          onPress={() => {
            closeMenus();
            onToggleInsertFileMenu(!isInsertFileMenuOpen);
          }}
        />
        <MenuWrapper
          as={Animated.View}
          style={{
            height: heightBrushStyleMenu,
            borderTopWidth: isBrushStyleMenuOpen ? 1 : 0,
            borderBottomWidth: isBrushStyleMenuOpen ? 1 : 0,
          }}
        >
          <BrushStyleMenu />
        </MenuWrapper>
        <MenuWrapper
          as={Animated.View}
          style={{
            height: heightEraserMenu,
            borderTopWidth: isEraserMenuOpen ? 1 : 0,
            borderBottomWidth: isEraserMenuOpen ? 1 : 0,
          }}
        >
          <EraserSizeMenu />
        </MenuWrapper>
        <MenuWrapper
          as={Animated.View}
          style={{
            height: heightSelectColorMenu,
            borderTopWidth: isSelectColorMenuOpen ? 1 : 0,
            borderBottomWidth: isSelectColorMenuOpen ? 1 : 0,
          }}
        >
          <SelectColorMenu />
        </MenuWrapper>
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

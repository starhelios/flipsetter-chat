import React, { useState } from 'react';
import Animated from 'react-native-reanimated';
import { mix, useTransition } from 'react-native-redash';

import {
  Container, Icon, BackgroundColorMenu, MenuWrapper,
  InsertFileMenu, BrushStyleMenu, EraserSizeMenu, SelectColorMenu,
} from './style';

import {
  magicPointerIcon, uploadImageIcon, pencilIcon, eraserIcon, palitraIcon, fillIcon,
} from '../../../images';

import { useOrientation } from '../../../helper/useOrientation';

export const SideMenu = () => {
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

  const transitionBackgroundColor = useTransition((orientation === 'LANDSCAPE') && isBackgroundColorMenuOpen, {
    duration: 200,
  });
  const transitionInsertFileMenu = useTransition((orientation === 'LANDSCAPE') && isInsertFileMenuOpen, {
    duration: 200,
  });
  const transitionBrushStyleMenu = useTransition((orientation === 'LANDSCAPE') && isBrushStyleMenuOpen, {
    duration: 200,
  });
  const transitionEraserMenu = useTransition((orientation === 'LANDSCAPE') && isEraserMenuOpen, {
    duration: 200,
  });
  const transitionSelectColorMenu = useTransition((orientation === 'LANDSCAPE') && isSelectColorMenuOpen, {
    duration: 200,
  });

  const widthBackgroundColorMenu = mix(transitionBackgroundColor, 0, 400);
  const widthInsertFileMenu = mix(transitionInsertFileMenu, 0, 400);
  const widthBrushStyleMenu = mix(transitionBrushStyleMenu, 0, 400);
  const widthEraserMenu = mix(transitionEraserMenu, 0, 400);
  const widthSelectColorMenu = mix(transitionSelectColorMenu, 0, 400);

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
            width: widthBrushStyleMenu,
            borderRightWidth: isBrushStyleMenuOpen ? 1 : 0,
            borderLeftWidth: isBrushStyleMenuOpen ? 1 : 0,
          }}
        >
          <BrushStyleMenu />
        </MenuWrapper>
        <MenuWrapper
          as={Animated.View}
          style={{
            width: widthEraserMenu,
            borderRightWidth: isEraserMenuOpen ? 1 : 0,
            borderLeftWidth: isEraserMenuOpen ? 1 : 0,
          }}
        >
          <EraserSizeMenu />
        </MenuWrapper>
        <MenuWrapper
          as={Animated.View}
          style={{
            width: widthSelectColorMenu,
            borderRightWidth: isSelectColorMenuOpen ? 1 : 0,
            borderLeftWidth: isSelectColorMenuOpen ? 1 : 0,
          }}
        >
          <SelectColorMenu />
        </MenuWrapper>
        <MenuWrapper
          as={Animated.View}
          style={{
            width: widthBackgroundColorMenu,
            borderRightWidth: isBackgroundColorMenuOpen ? 1 : 0,
            borderLeftWidth: isBackgroundColorMenuOpen ? 1 : 0,
          }}
        >
          <BackgroundColorMenu />
        </MenuWrapper>
        <MenuWrapper
          as={Animated.View}
          style={{
            width: widthInsertFileMenu,
            borderRightWidth: isInsertFileMenuOpen ? 1 : 0,
            borderLeftWidth: isInsertFileMenuOpen ? 1 : 0,
          }}
        >
          <InsertFileMenu />
        </MenuWrapper>
      </Container>
    </>
  );
};

import React, { useState } from 'react';
import Animated from 'react-native-reanimated';
import { useTransition, mix } from 'react-native-redash';

import { useOrientation } from '../../../helper/useOrientation';

import {
  Container, Logo, RightSide, LeftSide, HeaderText, CameraIcon,
  TrashIcon, RefreshIcon, MoreIcon, BackArrowIcon, ForwardArrowIcon,
  VerticalMenuWrapper, HeaderMenu, HorizontalMenuWrapper, MoreIconWrapper,
} from './styles';

<<<<<<< HEAD
export const Header = () => {
=======
export const Header = (props) => {
>>>>>>> artemBranch
  const [isOpenedMenu, onToggleMenu] = useState(false);
  const closeMenu = () => onToggleMenu(false);
  const orientation = useOrientation(closeMenu);

  const transitionVertical = useTransition((orientation === 'PORTRAIT') && isOpenedMenu, {
    duration: 200,
  });
  const transitionLandscape = useTransition((orientation === 'LANDSCAPE') && isOpenedMenu, {
    duration: 200,
  });

  const height = mix(transitionVertical, 0, 315);
  const width = mix(transitionLandscape, 0, 315);
  const padding = mix(transitionVertical, 0, 15);

  return (
    <>
<<<<<<< HEAD
      <Container>
=======
      <Container landscape={orientation === 'LANDSCAPE'}>
>>>>>>> artemBranch
        <LeftSide>
          <Logo />
          { orientation === 'LANDSCAPE' && <HeaderText>FlipSetter Whiteboard</HeaderText>}
        </LeftSide>
        <RightSide>
          <CameraIcon />
          <BackArrowIcon />
          <ForwardArrowIcon />
          <TrashIcon />
          <RefreshIcon />
          <MoreIconWrapper isPressed={isOpenedMenu}>
            <MoreIcon isPressed={isOpenedMenu} onPress={() => onToggleMenu(!isOpenedMenu)} />
          </MoreIconWrapper>
        </RightSide>
      </Container>
      <VerticalMenuWrapper
        as={Animated.View}
        style={{ height, padding }}
      >
<<<<<<< HEAD
        <HeaderMenu />
=======
        <HeaderMenu {...props} />
>>>>>>> artemBranch
      </VerticalMenuWrapper>
      <HorizontalMenuWrapper
        as={Animated.View}
        style={{ width }}
      >
<<<<<<< HEAD
        <HeaderMenu />
=======
        <HeaderMenu {...props} />
>>>>>>> artemBranch
      </HorizontalMenuWrapper>
    </>
  );
};

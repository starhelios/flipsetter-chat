import React from 'react';
import PT from 'prop-types';
import noop from 'lodash/noop';

import { useOrientation } from '../../../helper/useOrientation';

import {
  Container, Logo, RightSide, LeftSide, HeaderText, CameraIcon,
  TrashIcon, RefreshIcon, MoreIcon, BackArrowIcon, ForwardArrowIcon,
} from './styles';

export const Header = ({ onToggleMenu, isOpenedMenu }) => {
  const closeMenu = () => onToggleMenu(false);
  const orientation = useOrientation(closeMenu);

  return (
    <Container>
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
        <MoreIcon isPressed={isOpenedMenu} onPress={() => onToggleMenu(!isOpenedMenu)} />
      </RightSide>
    </Container>
  );
};

Header.propTypes = {
  onToggleMenu: PT.func,
  isOpenedMenu: PT.bool,
};

Header.defaultProps = {
  onToggleMenu: noop,
  isOpenedMenu: false,
};

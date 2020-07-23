import React from 'react';

import { useOrientation } from '../../../helper/useOrientation';

import {
  Container, Logo, RightSide, LeftSide, HeaderText, CameraIcon, TrashIcon, RefreshIcon, MoreIcon
} from './styles';

export const Header = () => {
  const orientation = useOrientation();

  return (
    <Container>
      <LeftSide>
        <Logo />
        { orientation === 'LANDSCAPE' && <HeaderText>FlipSetter Whiteboard</HeaderText>}
      </LeftSide>
      <RightSide>
        <CameraIcon />
        <TrashIcon />
        <RefreshIcon />
        <MoreIcon />
      </RightSide>
    </Container>
  );
};

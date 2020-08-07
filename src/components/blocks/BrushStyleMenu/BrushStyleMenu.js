import React from 'react';

import {
  Chooser, Container, Text, ButtonWrapper, FatBrush, ThinBrush, ContainerHorizontal,
} from './styles';

import { useOrientation } from '../../../helper/useOrientation';

export default ({ whiteboard, onChangeWidth }) => {
  const orientation = useOrientation();
  const Wrapper = orientation === 'LANDSCAPE' ? ContainerHorizontal : Container;

  return (
    <Wrapper>
      <Text>Brush style</Text>
      <ButtonWrapper>
        <ThinBrush />
        <FatBrush />
      </ButtonWrapper>
      <Text>Brush size</Text>
      <Chooser value={whiteboard.width} onValueChange={(weight) => onChangeWidth({ weight })} />
    </Wrapper>
  );
};

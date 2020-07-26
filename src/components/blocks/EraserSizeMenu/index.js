import React from 'react';

import {
  Chooser, Container, Text, ContainerHorizontal,
} from './styles';

import { useOrientation } from '../../../helper/useOrientation';

export const EraserSizeMenu = () => {
  const orientation = useOrientation();
  const Wrapper = orientation === 'LANDSCAPE' ? ContainerHorizontal : Container;

  return (
    <Wrapper>
      <Text>Eraser size</Text>
      <Chooser />
    </Wrapper>
  );
};

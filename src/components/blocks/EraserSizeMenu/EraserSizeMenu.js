import React from 'react';

import {
  Chooser, Container, Text, ContainerHorizontal,
} from './styles';

import { useOrientation } from '../../../helper/useOrientation';

export default ({ whiteboard, onChangeWidth, onChangeColor }) => {
  const orientation = useOrientation();
  const Wrapper = orientation === 'LANDSCAPE' ? ContainerHorizontal : Container;

  const onChange = (weight) => {
    onChangeWidth({ weight });
    onChangeColor({ color: '#ffffff' });
  };

  return (
    <Wrapper>
      <Text>Eraser size</Text>
      <Chooser
        value={whiteboard.width}
        onValueChange={onChange}
      />
    </Wrapper>
  );
};

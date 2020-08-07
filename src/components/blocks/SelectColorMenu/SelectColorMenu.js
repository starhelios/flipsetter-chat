import React, { useState } from 'react';

import { palitraImg, bluePalitraImg, blackGradientImg } from '../../../images';

import {
  Chooser, Container, Text, ChooserBackground, ChooserWrapper, ChoosenColorInput, ChoosenColorView, ChoosenColorWrapper, ContainerHorizontal,
} from './styles';
import { useOrientation } from '../../../helper/useOrientation';

export default ({ whiteboard, onChangeColor }) => {

  const orientation = useOrientation();
  const Wrapper = orientation === 'LANDSCAPE' ? ContainerHorizontal : Container;

  return (
    <Wrapper>
      <Text>Select color</Text>
      <ChooserWrapper>
        <ChooserBackground source={palitraImg} />
        <Chooser />
      </ChooserWrapper>
      <ChooserWrapper>
        <ChooserBackground source={bluePalitraImg} />
        <Chooser />
      </ChooserWrapper>
      <ChooserWrapper>
        <ChooserBackground source={blackGradientImg} />
        <Chooser />
      </ChooserWrapper>
      <ChoosenColorWrapper>
        <ChoosenColorView color={whiteboard.color} />
        <ChoosenColorInput
          value={whiteboard.color}
          onChangeText={(color) => onChangeColor({ color })}
        />
      </ChoosenColorWrapper>
    </Wrapper>
  );
};

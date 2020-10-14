import React from 'react';
import color from 'color';

import {
  Chooser, Container, Text, ChooserWrapper, ChoosenColorInput, ChoosenColorView,
  ChoosenColorWrapper, ContainerHorizontal, RedBackView, BlueBackView, GreenBackView,
} from './styles';
import { useOrientation } from '../../../helper/useOrientation';

export default ({ whiteboard, onChangeColor }) => {

  const orientation = useOrientation();
  const Wrapper = orientation === 'LANDSCAPE' ? ContainerHorizontal : Container;
  const red = color(whiteboard.color).color[0];
  const green = color(whiteboard.color).color[1];
  const blue = color(whiteboard.color).color[2];

  return (
    <Wrapper>
      <Text>Select color</Text>
      <ChooserWrapper>
        <RedBackView />
        <Chooser
          value={Number(red)}
          onValueChange={(val) => onChangeColor({ color: color(whiteboard.color).red(val).hex() })}
        />
      </ChooserWrapper>
      <ChooserWrapper>
        <BlueBackView />
        <Chooser
          value={Number(blue)}
          onValueChange={(val) => onChangeColor({ color: color(whiteboard.color).blue(val).hex() })}
        />
      </ChooserWrapper>
      <ChooserWrapper>
        <GreenBackView />
        <Chooser
          value={Number(green)}
          onValueChange={(val) => onChangeColor({ color: color(whiteboard.color).green(val).hex() })}
        />
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

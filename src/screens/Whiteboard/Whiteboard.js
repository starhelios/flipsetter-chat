import React from 'react';
import { StatusBar, Platform } from 'react-native';

import {
  Header, ViewContainer, SafeContainer, PortraitBoard, LandscapeBoard,
} from './styles';

import { useOrientation } from '../../helper/useOrientation';

const Whiteboard = () => {
  const orientation = useOrientation();
  const Container = orientation === 'LANDSCAPE' ? ViewContainer : SafeContainer;
  const isAndroid = Platform.OS !== 'ios';

  return (
    <Container>
      <StatusBar hidden={isAndroid} />
      <Header />
      {orientation === 'PORTRAIT' && <PortraitBoard />}
      {orientation === 'LANDSCAPE' && <LandscapeBoard />}
    </Container>
  );
};

export default Whiteboard;

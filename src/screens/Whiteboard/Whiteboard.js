import React from 'react';
import Sound from 'react-native-sound';

import {
  Header, Container, PortraitBoard, LandscapeBoard,
} from './styles';

import { useOrientation } from '../../helper/useOrientation';

const Whiteboard = () => {
  const orientation = useOrientation();

  return (
    <Container>
      <Header />
      {orientation === 'PORTRAIT' && <PortraitBoard />}
      {orientation === 'LANDSCAPE' && <LandscapeBoard />}
    </Container>
  );
};

export default Whiteboard;

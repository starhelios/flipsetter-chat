import React from 'react';
import Sound from 'react-native-sound';

import {
  Header, ViewContainer, SafeContainer, PortraitBoard, LandscapeBoard,
} from './styles';

import { useOrientation } from '../../helper/useOrientation';

const Whiteboard = (props) => {
  const orientation = useOrientation();
  const Container = orientation === 'LANDSCAPE' ? ViewContainer : SafeContainer;

  return (
    <Container>
      <Header {...props} />
      {orientation === 'PORTRAIT' && <PortraitBoard />}
      {orientation === 'LANDSCAPE' && <LandscapeBoard />}
    </Container>
  );
};

export default Whiteboard;

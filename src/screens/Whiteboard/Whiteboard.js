import React from 'react';

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

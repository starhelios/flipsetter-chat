import React from 'react';
import { mix, useTransition } from 'react-native-redash';
import Animated from 'react-native-reanimated';

import { MenuWrapper, DocumentManager } from './styles';

export const DocumentWrapper = ({ isOpen, onClose }) => {
  const transition = useTransition(isOpen, {
    duration: 200,
  });
  const width = mix(transition, 0, 350);
  const paddingHorizontal = mix(transition, 0, 20);
  return (
    <MenuWrapper
      as={Animated.View}
      style={{ width, paddingHorizontal }}
    >
      <DocumentManager onClose={onClose} />
    </MenuWrapper>
  );
};

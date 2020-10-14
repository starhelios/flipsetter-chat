import React from 'react';
import PT from 'prop-types';
import { Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { mix, useTransition } from 'react-native-redash';
import noop from 'lodash/noop';

import { MenuWrapper, DocumentManager } from './styles';

const { height: screenHeight } = Dimensions.get('window');

export const DocumentWrapper = ({ isOpen }) => {
  const transition = useTransition(isOpen, {
    duration: 300,
  });
  const height = mix(transition, 0, screenHeight * 0.75);
  const paddingVertical = mix(transition, 0, 20);
  const borderTopWidth = mix(transition, 0, 1);
  return (
    <MenuWrapper
      as={Animated.View}
      style={{ height, paddingVertical, borderTopWidth }}
    >
      <DocumentManager />
    </MenuWrapper>
  );
};

DocumentWrapper.propTypes = {
  isOpen: PT.bool,
  onClose: PT.func,
};

DocumentWrapper.defaultProps = {
  isOpen: false,
  onClose: noop,
};

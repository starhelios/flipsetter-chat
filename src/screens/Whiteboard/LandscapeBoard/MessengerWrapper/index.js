import React from 'react';
import PT from 'prop-types';
import { mix, useTransition } from 'react-native-redash';
import Animated from 'react-native-reanimated';
import noop from 'lodash/noop';

import {
  man4Img, man3Img, man2Img, man1Img,
} from '../../../../images';

import {
  MenuWrapper, Messenger, CloseMenu, Header, Hr, HeaderContainer, AvatarsWrapper, Avatar,
} from './styles';

export const MessengerWrapper = ({ isOpen, onClose }) => {
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
      <HeaderContainer>
        <CloseMenu onPress={onClose} />
        <Header>Conversation</Header>
        <Hr />
      </HeaderContainer>
      <AvatarsWrapper>
        <Avatar source={man1Img} />
        <Avatar source={man2Img} />
        <Avatar source={man3Img} />
        <Avatar source={man4Img} />
      </AvatarsWrapper>
      <Messenger onClose={onClose} />
    </MenuWrapper>
  );
};

MessengerWrapper.propTypes = {
  isOpen: PT.bool,
  onClose: PT.func,
};

MessengerWrapper.defaultProps = {
  isOpen: false,
  onClose: noop,
};

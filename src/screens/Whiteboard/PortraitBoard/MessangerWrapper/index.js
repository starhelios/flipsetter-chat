import React from 'react';
import PT from 'prop-types';

import {
  man1Img, man2Img, man3Img, man4Img,
} from '../../../../images';

import {
  Container, Messenger, HeaderText, Header, Logo, Modal, CloseButton, Avatar, AvatarsWrapper,
} from './styles';

export const MessangerWrapper = ({ isOpen, onClose }) => {
  return (
    <Modal visible={isOpen} onClose={onClose}>
      <Container>
        <Header>
          <Logo />
          <HeaderText>Conversation</HeaderText>
          <CloseButton onPress={onClose} />
        </Header>
        <AvatarsWrapper>
          <Avatar source={man1Img} />
          <Avatar source={man2Img} />
          <Avatar source={man3Img} />
          <Avatar source={man4Img} />
        </AvatarsWrapper>
        <Messenger />
      </Container>
    </Modal>
  );
};

MessangerWrapper.propTypes = {
  isOpen: PT.bool,
  onClose: PT.func,
};

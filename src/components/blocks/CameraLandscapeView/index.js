import React, { useState } from 'react';
import PT from 'prop-types';
import noop from 'lodash/noop';

import { manImg, womanImg } from '../../../images';

import {
  Container, ButtonContainer, ParticipanstContainer, DedicatedView, MainUserView,
  ParticipantsList, ImageView, UserView, Touch, MicroPhoneButton, CloseButton, FullScreenButton,
} from './styles';

const PEOPLE_LIVE = [{
  id: '234raw23def234rgvwsdc3425asdfa453e63e',
  thumbnail: manImg,
}, {
  id: '234raw23de4rgvwsdc3425asdfa453e63e',
  thumbnail: womanImg,
  isActive: true,
}, {
  id: '234raw23de4rgvwsdc3425asd3fa453e63e',
  thumbnail: manImg,
}, {
  id: '234raw23de4rgvwsdc33425asdfa453e63e',
  thumbnail: womanImg,
}, {
  id: '234raw23de4rgvwsdc3425easdfa453e63e',
  thumbnail: manImg,
}, {
  id: '234raw23de4rgvwsdc342d5asdfa453e63e',
  thumbnail: womanImg,
}, {
  id: '234raw23de4rgvzwsdc3425asdfa453e63e',
  thumbnail: manImg,
}, {
  id: '234raw23de4rgvwvesdc3425asdfa453e63e',
  thumbnail: womanImg,
}, {
  id: '234raw23de4rgvwsdc3425as2e2fa453e63e',
  thumbnail: manImg,
}, {
  id: '234raw23de4rgvwsdc3425asew214dfa453e63e',
  thumbnail: womanImg,
}];

export const CameraLandscapeView = ({ onClose }) => {
  const [selectedUser, chooseUser] = useState(PEOPLE_LIVE[0].id);
  const [fullScreen, toogleFullScreen] = useState(false);

  const renderItem = ({ item }) => (
    <Touch onPress={() => chooseUser(item.id)}>
      <ImageView isActive={item.id === selectedUser}>
        <UserView source={item.thumbnail} />
      </ImageView>
    </Touch>
  );

  return (
    <Container isFullScreen={fullScreen}>
      <DedicatedView isFullScreen={fullScreen}>
        <MainUserView />
      </DedicatedView>
      <ParticipanstContainer>
        <ParticipantsList
          data={PEOPLE_LIVE}
          renderItem={renderItem}
        />
      </ParticipanstContainer>
      <ButtonContainer>
        <MicroPhoneButton />
        <FullScreenButton
          isFullScreen={fullScreen}
          onPress={() => toogleFullScreen(!fullScreen)}
        />
        <CloseButton onPress={onClose} />
      </ButtonContainer>
    </Container>
  );
};

CameraLandscapeView.propTypes = {
  onClose: PT.func,
};

CameraLandscapeView.defaultProps = {
  onClose: noop,
};

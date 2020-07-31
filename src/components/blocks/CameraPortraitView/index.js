import React, { useState } from 'react';

import {man1Img, man2Img, man3Img, man4Img, manImg, womanImg} from '../../../images';

import {
  Container, ButtonContainer, ParticipanstContainer,Avatar, AvatarsWrapper,
  ParticipantsList, ImageView, UserView, Touch, FullScreenButton,
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

export const CameraPortraitView = ({ fullScreen, toogleFullScreen }) => {
  const [selectedUser, chooseUser] = useState(PEOPLE_LIVE[0].id);

  const renderItem = ({ item }) => (
    <Touch onPress={() => chooseUser(item.id)}>
      <ImageView isActive={item.id === selectedUser}>
        <UserView source={item.thumbnail} />
      </ImageView>
    </Touch>
  );

  return (
    <Container>
      <ParticipanstContainer>
        <ParticipantsList
          data={PEOPLE_LIVE}
          renderItem={renderItem}
        />
      </ParticipanstContainer>
      <ButtonContainer>
        <AvatarsWrapper>
          <Avatar source={man1Img} />
          <Avatar source={man2Img} />
          <Avatar source={man3Img} />
          <Avatar source={man4Img} />
        </AvatarsWrapper>
        <FullScreenButton
          isFullScreen={fullScreen}
          onPress={() => toogleFullScreen(!fullScreen)}
        />
      </ButtonContainer>
    </Container>
  );
};

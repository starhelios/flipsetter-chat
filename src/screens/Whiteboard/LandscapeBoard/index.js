import React, { useEffect, useState } from 'react';
import Sound from 'react-native-sound';

import {
  Background, Container, SideMenu, WorkBoard, ShowSideMenuButton, BubbleInfo,
  TopWorkSide, BottomWorkSide, ShowDocManagerMenuButton, ShowChatButton,
  BottomLeftWorkSide, BottomRightWorkSide, ShowMicroPhoneButton, ShowCameraButton,
  DocumentWrapper, CameraLandscapeView, MessengerWrapper,
} from './styles';

const whoosh = new Sound('dingsoundeffect.mp3', Sound.MAIN_BUNDLE);

const LandscapeBoard = () => {
  const [showSideMenu, toogleSideMenu] = useState(false);
  const [showDocManagerMenu, toogleDocManagerMenu] = useState(false);
  const [showChat, toogleChat] = useState(false);
  const [showMicrophone, toogleMicrophone] = useState(false);
  const [showCamera, toogleCamera] = useState(false);

  useEffect(() => {
    if (whoosh.isLoaded()) whoosh.stop(() => whoosh.play());
  }, [showDocManagerMenu, showCamera, showChat, showMicrophone]);

  return (
    <Background>
      <Container>
        {showSideMenu && <SideMenu />}
        <WorkBoard>
          <TopWorkSide>
            <ShowSideMenuButton
              forward={showSideMenu}
              onPress={() => toogleSideMenu(!showSideMenu)}
            />
            <ShowDocManagerMenuButton
              forward={showDocManagerMenu}
              onPress={() => toogleDocManagerMenu(!showDocManagerMenu)}
            />
          </TopWorkSide>
          <BottomWorkSide>
            <BottomLeftWorkSide>
              <ShowChatButton
                forward={showChat}
                onPress={() => toogleChat(!showChat)}
              />
              <BubbleInfo label="Dawson Wellman talking" />
            </BottomLeftWorkSide>
            <BottomRightWorkSide>
              <ShowMicroPhoneButton
                muted={showMicrophone}
                onPress={() => toogleMicrophone(!showMicrophone)}
              />
              <ShowCameraButton
                forward={showCamera}
                onPress={() => toogleCamera(!showCamera)}
              />
            </BottomRightWorkSide>
          </BottomWorkSide>
        </WorkBoard>
        <DocumentWrapper
          isOpen={showDocManagerMenu}
          onClose={() => toogleDocManagerMenu(!showDocManagerMenu)}
        />
        <MessengerWrapper
          isOpen={showChat}
          onClose={() => toogleChat(!showChat)}
        />
        { showCamera && (
        <CameraLandscapeView
          onClose={() => toogleCamera(!showCamera)}
        />
        )}
      </Container>
    </Background>
  );
};

export { LandscapeBoard };

import React, { useState, useEffect } from 'react';
import Sound from 'react-native-sound';

import {
  Background, Container, FooterMenu, WorkBoard, BubbleInfo, BottomLeftWorkSide,
  TopWorkSide, BottomWorkSide, ShowDocManagerMenuButton, ShowChatButton,
  TopLeftWorkSide, BottomRightWorkSide, ShowMicroPhoneButton, ShowCameraButton,
  MessangerWrapper, DocumentWrapper, WebCamBlock,
} from './styles';

const whoosh = new Sound('dingsoundeffect.mp3', Sound.MAIN_BUNDLE);

const PortraitBoard = () => {
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
        <WorkBoard>
          <TopWorkSide>
            <TopLeftWorkSide />
            <BubbleInfo label="Dawson Wellman talking" />
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
        {showCamera && <WebCamBlock />}
        <FooterMenu />
        <MessangerWrapper
          isOpen={showChat}
          onClose={() => toogleChat(!showChat)}
        />
        <DocumentWrapper isOpen={showDocManagerMenu} />
      </Container>
    </Background>
  );
};

export { PortraitBoard };

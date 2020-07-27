import React, { useState } from 'react';

import {
  Background, Container, FooterMenu, WorkBoard, BubbleInfo, BottomLeftWorkSide,
  TopWorkSide, BottomWorkSide, ShowDocManagerMenuButton, ShowChatButton,
  TopLeftWorkSide, BottomRightWorkSide, ShowMicroPhoneButton, ShowCameraButton,
} from './styles';

const PortraitBoard = () => {
  const [showDocManagerMenu, toogleDocManagerMenu] = useState(false);
  const [showChat, toogleChat] = useState(false);
  const [showMicrophone, toogleMicrophone] = useState(false);
  const [showCamera, toogleCamera] = useState(false);

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
        <FooterMenu />
      </Container>
    </Background>
  );
};

export { PortraitBoard };

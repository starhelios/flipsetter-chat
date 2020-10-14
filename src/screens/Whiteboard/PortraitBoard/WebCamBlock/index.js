import React, { useState } from 'react';

import {
  CameraPortraitView, Modal, Container, SafeView, Header, ShowCameraButton, ShowChatButton,
  ShowMicroPhoneButton, TopLeftWorkSide, TopRightWorkSide, MainUserView,
} from './styles';

export const WebCamBlock = () => {
  const [fullScreen, toggleFullScreen] = useState(false);
  return (
    <>
      {!fullScreen && (
        <CameraPortraitView fullScreen={fullScreen} toogleFullScreen={toggleFullScreen} />
      )}
      <Modal visible={fullScreen}>
        <SafeView>
          <Container>
            <Header>
              <TopLeftWorkSide><ShowChatButton /></TopLeftWorkSide>
              <TopRightWorkSide>
                <ShowMicroPhoneButton />
                <ShowCameraButton />
              </TopRightWorkSide>
            </Header>
            <MainUserView />
            <CameraPortraitView fullScreen={fullScreen} toogleFullScreen={toggleFullScreen} />
          </Container>
        </SafeView>
      </Modal>
    </>
  );
};

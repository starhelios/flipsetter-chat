import styled from 'styled-components/native';

import Color from '../../../../config/Colors';
import { IconButton } from '../../../../components/ui';
import {
  chatIcon, manImg, microPhoneIcon, mutedMicroPhoneIcon, webCamIcon
} from '../../../../images';

export { CameraPortraitView } from '../../../../components/blocks';

export const Modal = styled.Modal``;

export const SafeView = styled.SafeAreaView`
  flex: 1;
`;

export const Container = styled.View`
  background-color: ${Color.headerBackgroundColor};
  flex: 1;
`;

export const Header = styled.View`
  background-color: ${Color.headerBackgroundColor};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  paddingHorizontal: 10px;
`;

export const ShowChatButton = styled(IconButton).attrs({
  iconSource: chatIcon,
  iconSize: 25,
  withBorder: true,
})`
  border-color: black;
  border-width: 1px;
  border-radius: 10px;
  background-color: white;
`;

export const ShowMicroPhoneButton = styled(IconButton).attrs((props) => ({
  iconSource: props.muted ? mutedMicroPhoneIcon : microPhoneIcon,
  iconSize: 25,
  withBorder: true,
}))`
  border-color: ${(props) => (props.muted ? Color.muted : Color.black)};
  border-width: 1px;
  margin-right: 10px;
  border-radius: 10px;
  background-color: ${(props) => (props.muted ? Color.muted : Color.white)};
`;

export const ShowCameraButton = styled(IconButton).attrs({
  iconSource: webCamIcon,
  iconSize: 25,
  withBorder: true,
})`
  border-color: black;
  border-width: 1px;
  border-radius: 10px;
  background-color: white;
`;

export const TopRightWorkSide = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  `;

export const TopLeftWorkSide = styled.View`
  flex-direction: row;
`;

export const MainUserView = styled.Image.attrs({
  source: manImg,
  resizeMode: 'cover',
})`
  flex: 1;
`;

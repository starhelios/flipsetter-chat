import styled from 'styled-components/native';

import {
  landscapeBackgroundImg, backArrowIcon, forwardArrowIcon,
  chatIcon, microPhoneIcon, webCamIcon, mutedMicroPhoneIcon,
} from '../../../images';

import { IconButton, InfoBubble } from '../../../components/ui';
import Colors from '../../../config/Colors';

export { DocumentWrapper } from './DocumentWrapper';
export { MessengerWrapper } from './MessengerWrapper';
export { SideMenu, CameraLandscapeView } from '../../../components/blocks';

export const Background = styled.ImageBackground.attrs({
  source: landscapeBackgroundImg,
})`
  flex: 1;
`;

export const Container = styled.View`
  flex: 1;
  flex-direction: row;
`;

export const WorkBoard = styled.View`
  z-index: 2;
  flex: 1;
  margin: 15px;
  justify-content: space-between;
  padding-horizontal: 25px;
`;

export const TopWorkSide = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const BottomWorkSide = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const BottomLeftWorkSide = styled.View`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

export const BottomRightWorkSide = styled.View`
  display: flex;
  flex-direction: row;
`;

export const ShowSideMenuButton = styled(IconButton).attrs((props) => ({
  iconSource: props.forward ? backArrowIcon : forwardArrowIcon,
  iconSize: 36,
  withBorder: true,
}))`
  border-color: black;
  border-width: 1px;
  border-radius: 10px;
  background-color: white;
`;

export const ShowDocManagerMenuButton = styled(IconButton).attrs((props) => ({
  iconSource: props.forward ? forwardArrowIcon : backArrowIcon,
  iconSize: 36,
  withBorder: true,
}))`
  border-color: black;
  border-width: 1px;
  border-radius: 10px;
  background-color: white;
`;

export const ShowChatButton = styled(IconButton).attrs({
  iconSource: chatIcon,
  iconSize: 25,
  withBorder: true,
})`
  margin-top: 15px;
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
  margin-top: 15px;
  border-color: ${(props) => (props.muted ? Colors.muted : Colors.black)};
  border-width: 1px;
  border-radius: 10px;
  background-color: ${(props) => (props.muted ? Colors.muted : Colors.white)};
`;

export const ShowCameraButton = styled(IconButton).attrs({
  iconSource: webCamIcon,
  iconSize: 25,
  withBorder: true,
})`
  margin-top: 15px;
  margin-left: 15px;
  border-color: black;
  border-width: 1px;
  border-radius: 10px;
  background-color: white;
`;

export const BubbleInfo = styled(InfoBubble)`
  margin-left: 15px;
  margin-bottom: 5px;
`;

import styled from 'styled-components/native';

import {
  landscapeBackgroundImg, backArrowIcon, forwardArrowIcon,
  chatIcon, microPhoneIcon, webCamIcon, mutedMicroPhoneIcon,
} from '../../../images';

import { IconButton, InfoBubble } from '../../../components/ui';
import Colors from '../../../config/Colors';

export { MessangerWrapper } from './MessangerWrapper';
export { DocumentWrapper } from './DocumentWrapper';
export { WebCamBlock } from './WebCamBlock';
export { FooterMenu } from '../../../components/blocks';

export const Background = styled.ImageBackground.attrs(props => ({
  source: props.source ? props.source : landscapeBackgroundImg,
}))`
  flex: 1;
`;

export const SVGWrapper = styled.View``;

export const Container = styled.View`
  flex: 1;
  flex-direction: column;
`;

export const WorkBoard = styled.View`
  z-index: 2;
  flex: 1;
  justify-content: space-between;
`;

export const TopWorkSide = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: 15px;
  padding-horizontal: 15px;
  position: absolute;
  top: 0px;
  width: 100%;
  z-index: 90;
`;

export const BottomWorkSide = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 15px;
  padding-horizontal: 15px;
  position: absolute;
  bottom: 0px;
  width: 100%;
  z-index: 4;
`;

export const TopLeftWorkSide = styled.View`
  width: 41px;
`;

export const BottomRightWorkSide = styled.View``;

export const BottomLeftWorkSide = styled.View`
  justify-content: flex-end;
  z-index: 10;
`;

export const ShowDocManagerMenuButton = styled(IconButton).attrs((props) => ({
  iconSource: props.forward ? forwardArrowIcon : backArrowIcon,
  iconSize: 25,
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
  z-index: 95;
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
  z-index: 95;
  background-color: ${(props) => (props.muted ? Colors.muted : Colors.white)};
`;

export const ShowCameraButton = styled(IconButton).attrs({
  iconSource: webCamIcon,
  iconSize: 25,
  withBorder: true,
})`
  margin-top: 15px;
  border-color: black;
  border-width: 1px;
  border-radius: 10px;
  background-color: white;
  z-index: 95;
`;

export const BubbleInfo = styled(InfoBubble)`
  margin-left: 15px;
  margin-bottom: 5px;
`;

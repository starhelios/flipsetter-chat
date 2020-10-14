import styled from 'styled-components/native';

import { IconButton } from '../../ui';
import {
  microPhoneIcon, extFullScreenIcon, fullScreenIcon, closeIcon, womanImg,
} from '../../../images';

import Colors from '../../../config/Colors';

export const Container = styled.View`
  height: 320px;
  background-color: ${Colors.headerMenuBackgroundColor};
  display: flex;
  width: 100%;
  flex-direction: column;
  z-index: 3;
`;

export const ButtonContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-horizontal: 5px;
`;

export const ParticipanstContainer = styled.View`
  height: 265px;
`;

export const ParticipantsList = styled.FlatList.attrs({
  horizontal: true,
})`
  height: 260px;
`;

export const DedicatedView = styled.View`
  flex: ${(props) => (props.isFullScreen ? '1' : '0')};
  overflow: hidden;
`;

export const Touch = styled.TouchableOpacity``;

export const ImageView = styled.View`
  border-width: 2px;
  border-color: ${(props) => (props.isActive ? Colors.choosenGreen : 'transparent')};
  margin-bottom: 5px;
  margin-top: 10px;
  margin-left: 10px;
  
`;

export const UserView = styled.Image`
  width: 250px;
  height: 250px;
`;

export const MainUserView = styled.Image.attrs({
  source: womanImg,
  resizeMode: 'cover',
})`
  margin-left: 10px;
  flex: 1;
`;

export const MicroPhoneButton = styled(IconButton).attrs({
  iconSource: microPhoneIcon,
  tintColor: Colors.black,
  iconSize: 20,
})`
  background-color: ${Colors.white};
  margin-bottom: 10px;
  border-radius: 6px;
`;

export const FullScreenButton = styled(IconButton).attrs((props) => ({
  iconSource: props.isFullScreen ? extFullScreenIcon : fullScreenIcon,
  tintColor: Colors.white,
  iconSize: 20,
}))`
  margin-right: 10px;
  margin-top: 3px;
  border-radius: 6px;
`;

export const CloseButton = styled(IconButton).attrs({
  iconSource: closeIcon,
  tintColor: Colors.black,
  iconSize: 20,
})`
  background-color: ${Colors.white};
  border-radius: 6px;
  margin-bottom: 10px;
`;

export const AvatarsWrapper = styled.View`
  display: flex;
  flex-direction: row;
  padding: 10px;
`;

export const Avatar = styled.Image`
  height: 36px;
  width: 36px;
  margin-right: 6px;
`;

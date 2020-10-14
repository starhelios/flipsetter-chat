import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

import { IconButton } from '../../ui';
import {
  microPhoneIcon, extFullScreenIcon, fullScreenIcon, closeIcon, womanImg,
} from '../../../images';

import Colors from '../../../config/Colors';

const { height, width } = Dimensions.get('window');

const sizeOfContainer = (height > width) ? width : height;

export const Container = styled.View`
  height: ${sizeOfContainer - 50}px;
  background-color: ${Colors.headerMenuBackgroundColor};
  width: ${(props) => (props.isFullScreen ? '100%' : '360px')};
  display: flex;
  max-width: 100%;
  flex-direction: row;
  position: absolute;
  right: 0px;
  padding-right: 40px;
  z-index: 3;
`;

export const ButtonContainer = styled.View`
  width: 40px;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  margin-horizontal: 5px;
`;

export const ParticipanstContainer = styled.View`
  width: 269px;
`;

export const ParticipantsList = styled.FlatList`
  flex: 1;
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
  margin-left: 5px;
  
`;

export const UserView = styled.Image`
  width: 260px;
  height: 100px;
`;

export const MainUserView = styled.Image.attrs({
  source: womanImg,
  resizeMode: 'cover',
})`
  margin-left: 7px;
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
  tintColor: Colors.black,
  iconSize: 20,
}))`
  background-color: ${Colors.white};
  margin-bottom: 10px;
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

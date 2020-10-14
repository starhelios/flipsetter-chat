import styled from 'styled-components/native';
import IconIoniconsUI from 'react-native-vector-icons/Ionicons';
import IconFeatherUI from 'react-native-vector-icons/Feather';
import { Dimensions, Platform } from 'react-native';

import { Text } from '../../ui/Text';
import { Image } from '../../ui/Image';
import { IconButton } from '../../ui/IconButton';

import { logoImg, leftCurvedArrowIcon, rightCurvedArrowIcon } from '../../../images';

import Color from '../../../config/Colors';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const isIphoneX = Platform.OS !== 'android'
  && (deviceHeight === 812
    || deviceWidth === 812
    || deviceHeight === 896
    || deviceWidth === 896);

export { HeaderMenu } from '../HeaderMenu';

export const Container = styled.View`
  background-color: ${Color.headerBackgroundColor};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  paddingHorizontal: ${(props) => (props.landscape ? 50 : 10)}px;
`;

export const LeftSide = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const RightSide = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Logo = styled(Image).attrs({
  source: logoImg,
})`
  height: 40px;
  width: 40px;
`;

export const HeaderText = styled(Text)`
  color: ${Color.white};
  font-weight: bold;
  font-size: 25px;
  padding-left: 5px;
`;

export const CameraIcon = styled(IconIoniconsUI).attrs({
  name: 'camera-outline',
  size: 30,
  color: Color.white,
})`
  padding-right: 15px;
`;

export const TrashIcon = styled(IconIoniconsUI).attrs({
  name: 'trash-outline',
  size: 30,
  color: Color.white,
})`
  padding-right: 15px;`;

export const RefreshIcon = styled(IconFeatherUI).attrs({
  name: 'refresh-cw',
  size: 30,
  color: Color.white,
})`
  padding-right: 15px;`;

export const MoreIconWrapper = styled.View`
  backgroundColor: ${(props) => (props.isPressed ? Color.white : Color.headerBackgroundColor)};
  borderRadius: 8px;
`;

export const MoreIcon = styled(IconFeatherUI).attrs((props) => ({
  name: 'more-horizontal',
  size: 30,
  color: props.isPressed ? Color.headerBackgroundColor : Color.white,
}))`
  padding-horizontal: 2px;
`;

export const BackArrowIcon = styled(IconButton).attrs({
  iconSource: leftCurvedArrowIcon,
  iconSize: 30,
  tintColor: Color.white,
})`
  padding-right: 15px;
`;

export const ForwardArrowIcon = styled(IconButton).attrs({
  iconSource: rightCurvedArrowIcon,
  iconSize: 30,
  tintColor: Color.white,
})`
  padding-right: 15px;
`;

export const VerticalMenuWrapper = styled.View`
  width: 100%;
  borderBottomLeftRadius: 20px;
  borderBottomRightRadius: 20px;
  backgroundColor: ${Color.headerMenuBackgroundColor};
`;

export const HorizontalMenuWrapper = styled.View`
  height: 100%;
  width: 0px;
  borderBottomLeftRadius: 20px;
  borderBottomRightRadius: 20px;
  backgroundColor: ${Color.headerMenuBackgroundColor};
  right: ${isIphoneX ? 44 : 0}px;
  top: 50px;
  position: absolute;
  zIndex: 999;
`;

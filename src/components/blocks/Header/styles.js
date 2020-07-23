import styled from 'styled-components/native';
import IconIoniconsUI from 'react-native-vector-icons/Ionicons';
import IconFeatherUI from 'react-native-vector-icons/Feather';

import { Text } from '../../ui/Text';
import { Image } from '../../ui/Image';

import { logoImg } from '../../../images';

import Color from '../../../config/Colors';

export const Container = styled.View`
  background-color: ${Color.headerBackgroundColor};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  paddingHorizontal: 10px;
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

export const MoreIcon = styled(IconFeatherUI).attrs({
  name: 'more-horizontal',
  size: 30,
  color: Color.white,
})`
  padding-right: 15px;`;

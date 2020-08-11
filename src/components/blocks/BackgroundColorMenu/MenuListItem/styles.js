import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Image } from '../../../ui/Image';
import Colors from '../../../../config/Colors';

import { Text as TextUI } from '../../../ui/Text';

export const Container = styled.View`  
  border-bottom-width: ${(props) => (props.isLast ? '0' : '1')}px;
  padding-vertical: 15px;
  padding-horizontal: 15px;
  border-color: ${Colors.menuSideSeparator};
  flex-direction: row;
`;

export const Icon = styled(Image).attrs({
  resizeMode: 'contain',
  tintColor: Colors.headerBackgroundColor,
})`
  height: 25px;
  width: 25px;
  margin-right: 10px;
`;

export const Text = styled(TextUI)`
  color: ${Colors.headerBackgroundColor};
`;

export const Touch = styled(TouchableOpacity)``;

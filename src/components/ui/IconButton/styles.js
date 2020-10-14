import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Image } from '../Image';

import Colors from '../../../config/Colors';

export const Touch = styled(TouchableOpacity)``;

export const Icon = styled(Image).attrs((props) => ({
  resizeMode: 'contain',
  tintColor: props.isChoosen ? Colors.choosenGreen : props.tintColor,
}))``;

export const IconWrapper = styled.View`
  backgroundColor: ${(props) => (props.isChoosen ? Colors.choosenBackground : 'transparent')};
  padding: 8px;
  borderRadius: 6px;
`;

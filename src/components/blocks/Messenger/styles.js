import styled from 'styled-components/native';

import { GiftedChat } from 'react-native-gifted-chat';
import { Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

const sizeOfContainer = (height > width) ? width : height;

export { InfoBubble } from '../../ui';

export { InputToolbar } from './InputToolbar';

export { Bubble } from './Bubble';

export const Chat = styled(GiftedChat)`
  width: 300px;
  `;

export const Container = styled.View`
  flex: 1;
`;

export const SystemWrapper = styled.View`
  align-items: center;
  margin-bottom: 5px;
  margin-bottom: 15px;
`;

import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/AntDesign'

import { Text } from '../../ui';

import Colors from '../../../config/Colors';

export { File } from './File';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  overflow: hidden;
`;

export const CloseMenu = styled(Icon).attrs({
  name: 'close',
  size: 28,
})`
  position: absolute;
  right: 0;
  top: 0px;
`;

export const Folder = styled.FlatList.attrs({
  numColumns: 2,
})`
  margin-bottom: 15px;
`;

export const Hr = styled.View`
  border-bottom-width: 1px;
  border-color: ${Colors.menuSideSeparator};
  width: 100%;
  margin-vertical: 15px;
`;

export const Header = styled(Text)`
  color: ${Colors.headerBackgroundColor};
  font-size: 22px;
  font-weight: bold;
`;

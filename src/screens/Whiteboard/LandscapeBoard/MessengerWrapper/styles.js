import styled from 'styled-components';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

import Colors from '../../../../config/Colors';
import { Text } from '../../../../components/ui';

export { Messenger } from '../../../../components/blocks';

const { height } = Dimensions.get('screen');

export const MenuWrapper = styled.View`
  padding-vertical: 20px;
  position: absolute;
  left: 0;
  height: ${height - 50}px;
  z-index: 3;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  backgroundColor: ${Colors.white};
  
  shadow-color: #000;
  shadow-offset: 1px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 5px;
  
  border-color: ${Colors.menuSideSeparator};
`;

export const CloseMenu = styled(Icon).attrs({
  name: 'close',
  size: 28,
})`
  position: absolute;
  right: 0;
  top: 1px;
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

export const HeaderContainer = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const AvatarsWrapper = styled.View`
  display: flex;
  flex-direction: row;
  padding-bottom: 4px;
`;

export const Avatar = styled.Image`
  height: 36px;
  width: 36px;
  margin-right: 6px;
`;

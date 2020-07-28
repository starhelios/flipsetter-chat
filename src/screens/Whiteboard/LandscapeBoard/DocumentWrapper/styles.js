import styled from 'styled-components';
import { Dimensions } from 'react-native';

import Colors from '../../../../config/Colors';

export { DocumentManager } from '../../../../components/blocks';

const { height } = Dimensions.get('screen');

export const MenuWrapper = styled.View`
  padding-top: 20px;
  position: absolute;
  right: 0;
  height: ${height - 70}px;
  z-index: 3;
  
  backgroundColor: ${Colors.white};
  
  shadow-color: #000;
  shadow-offset: 1px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 5px;
  
  border-color: ${Colors.menuSideSeparator};
`;

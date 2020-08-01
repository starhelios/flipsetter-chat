import styled from 'styled-components';

import Colors from '../../../../config/Colors';

export { DocumentManager } from '../../../../components/blocks';

export const MenuWrapper = styled.View`
  padding-top: 20px;
  position: absolute;
  right: 0;
  height: 100%;
  z-index: 3;
  
  backgroundColor: ${Colors.white};
  
  shadow-color: #000;
  shadow-offset: 1px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 5px;
  
  border-color: ${Colors.menuSideSeparator};
`;

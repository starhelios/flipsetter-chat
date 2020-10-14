import styled from 'styled-components/native';

import Colors from '../../../../config/Colors';

export { DocumentManager } from '../../../../components/blocks';

export const MenuWrapper = styled.View`
  width: 100%;
  position: absolute;
  bottom: 0;
  z-index: 3;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 24px;
  
  backgroundColor: ${Colors.white};
  
  shadow-color: #000;
  shadow-offset: 2px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 15px;
  
  border-color: ${Colors.menuSideSeparator};
`;

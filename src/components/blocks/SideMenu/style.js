import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

import { IconButton } from '../../ui';
import Colors from '../../../config/Colors';

const { width, height } = Dimensions.get('screen');

export { BackgroundColorMenu } from '../BackgroundColorMenu';
export { InsertFileMenu } from '../InsertFilesMenu';
export { BrushStyleMenu } from '../BrushStyleMenu';
export { EraserSizeMenu } from '../EraserSizeMenu';
export { SelectColorMenu } from '../SelectColorMenu';

const lessSize = height > width ? width : height;

export const Container = styled.View`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
  height: ${lessSize - 50}px;
  width: 50px;
  z-index: 3;
<<<<<<< HEAD
  
=======

>>>>>>> artemBranch
  shadow-color: #000;
  shadow-offset: 1px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 5px;
<<<<<<< HEAD
  
=======

>>>>>>> artemBranch
  border-top-width: 1px;
  border-color: white;
  background-color: white;
`;

export const Icon = styled(IconButton).attrs({
  iconSize: 28,
  tintColor: Colors.headerBackgroundColor,
})``;

export const MenuWrapper = styled.View`
  position: absolute;
  top: 0px;
  left: 50px;
  height: ${lessSize - 50}px;
  
  backgroundColor: ${Colors.white};
  overflow: hidden;
  align-items: center;
  
  shadow-color: #000;
  shadow-offset: 1px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 5px;
  
  border-color: ${Colors.menuSideSeparator};
`;

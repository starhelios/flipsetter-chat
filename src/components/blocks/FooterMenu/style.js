import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

import { IconButton } from '../../ui';
import Colors from '../../../config/Colors';

const { width } = Dimensions.get('screen');

export { BackgroundColorMenu } from '../BackgroundColorMenu';
export { InsertFileMenu } from '../InsertFilesMenu';
export { BrushStyleMenu } from '../BrushStyleMenu';
export { EraserSizeMenu } from '../EraserSizeMenu';
export { SelectColorMenu } from '../SelectColorMenu';

export const Container = styled.View`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: row;
  height: 50px;
  width: 100%;
  padding-horizontal: 15px;
  z-index: 3;
  
  shadow-color: #000;
  shadow-offset: 1px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 5px;
  
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
  bottom: 50px;
  left: 0px;
  width: ${width}px;
  backgroundColor: ${Colors.white};
  overflow: hidden;
  align-items: center;
  
  shadow-color: #000;
  shadow-offset: 1px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 5px;
  
  border-color: ${Colors.menuSideSeparator};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

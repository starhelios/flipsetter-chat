import styled from 'styled-components/native';

import { IconButton } from '../../ui';
import Colors from '../../../config/Colors';

export const Container = styled.View`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: row;
  position: absolute;
  bottom: 50px;
  height: 50px;
  width: 100%;
  padding-horizontal: 15px;
  
  shadow-color: #000;
  shadow-offset: 1px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 5px;
  
  border-top-width: 1px;
  border-color: white;
  background-color: white;
`;

export const Icon = styled(IconButton).attrs({
  iconSize: 34,
  tintColor: Colors.headerBackgroundColor,
})``;

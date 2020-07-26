import styled from 'styled-components/native';

import Colors from '../../../config/Colors';

import { thinBrushIcon, fatBrushIcon } from '../../../images'

import { IconButton, Text as TextUI, Slider } from '../../ui';

export const Container = styled.View`
    position: absolute;
    background-color: ${Colors.white};
    bottom: 0px;
    flex-direction: column;
    align-items: center;
`;

export const ContainerHorizontal = styled.View`
    position: absolute;
    background-color: ${Colors.white};
    padding-top: 20px;
    top: 0px;
    flex-direction: column;
    align-items: center;
`;

export const Chooser = styled(Slider).attrs({
  minimumTrackTintColor: '#eff0f2',
  maximumTrackTintColor: '#eff0f2',
})`
  width: 350px;
  margin-bottom: 25px;
`;

export const Text = styled(TextUI)`
  color: ${Colors.headerBackgroundColor};
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
`;

export const ThinBrush = styled(IconButton).attrs({
  iconSource: thinBrushIcon,
  iconSize: 34,
  isChoosen: true
})``;

export const FatBrush = styled(IconButton).attrs({
  iconSource: fatBrushIcon,
  iconSize: 34,
})``;

export const ButtonWrapper = styled.View`
  flex-direction: row;
  margin-bottom: 35px;
  width: 110px;
  justify-content: space-between;
`;

import styled from 'styled-components/native';

import Colors from '../../../config/Colors';

import { Text as TextUI, Slider } from '../../ui';

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
    flex-direction: column;
    align-items: center;
`;

export const Chooser = styled(Slider).attrs({
  minimumTrackTintColor: 'transparent',
  maximumTrackTintColor: 'transparent',
  minimumValue: 0,
  maximumValue: 255,
  step: 1,
  showValue: false,
})`
  width: 350px;
  margin-bottom: 20px;
`;

export const Text = styled(TextUI)`
  color: ${Colors.headerBackgroundColor};
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 30px;
`;

export const ChooserWrapper = styled.View``;

export const ChooserBackground = styled.Image.attrs({
  resizeMode: 'contain',
})`
  height: 16px;
  width: 350px;
  position: absolute;
  top: 12px;
`;

export const ChoosenColorWrapper = styled.View`
  flex-direction: row;
  width: 150px;
  justify-content: space-between;
  margin-bottom: 25px;
`;

export const ChoosenColorView = styled.View`
  height: 40px;
  width: 40px;
  border-radius: 8px;
  border-width: 0.5px;
  border-color: ${Colors.black};
  background-color: ${(props) => (props.color.length === 7 ? props.color : Colors.white)};
`;

export const ChoosenColorInput = styled.TextInput.attrs({
  maxValue: 7,
})`
  border-radius: 8px;
  border-color: ${Colors.menuSideSeparator};
  border-width: 2px;
  height: 40px;
  width: 90px;
  text-align: center;
  padding-horizontal: 5px;
  fontFamily: Nunito;
  font-size: 16px;
`;

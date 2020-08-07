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
    top: 0px;
    flex-direction: column;
    align-items: center;
`;

export const Chooser = styled(Slider).attrs({
  minimumTrackTintColor: '#eff0f2',
  maximumTrackTintColor: '#eff0f2',
  minimumValue: 1,
  maximumValue: 15,
  step: 1,
  showValue: true,
})`
  width: 350px;
  margin-bottom: 25px;
`;

export const Text = styled(TextUI)`
  color: ${Colors.headerBackgroundColor};
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 40px;
`;

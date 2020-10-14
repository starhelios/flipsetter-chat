import styled from 'styled-components/native';

import Colors from '../../../config/Colors';

import { Text as TextUI } from '../../ui';

export { MenuListItem } from './MenuListItem';
export { BackgroundPatternModal } from './BackgroundPatternModal';

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
    height: 100%;
    padding-top: 20px;
    top: 0px;
    flex-direction: column;
    align-items: center;
    flex: 1;
`;

export const Scroller = styled.FlatList.attrs({
  bounces: true,
})`
  width: 350px;
`;

export const Text = styled(TextUI)`
  color: ${Colors.headerBackgroundColor};
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
`;

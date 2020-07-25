import styled from 'styled-components/native';

import Colors from '../../../config/Colors';

export { MenuListItem } from './MenuListItem';

export const Container = styled.View`
    flex: 1;
    background-color: ${Colors.headerMenuBackgroundColor};
    height: 0;
    top: 0;
`;

export const Scroller = styled.FlatList.attrs({
  bounces: false,
})``;

import styled from 'styled-components/native';

import Colors from '../../../config/Colors';

export { MenuListItem } from './MenuListItem';

export const Container = styled.SafeAreaView`
    flex: 1;
    background-color: ${Colors.headerBackgroundColor};
    height: 100px;
`;

export const Scroller = styled.FlatList``;

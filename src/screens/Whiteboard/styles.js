import React from 'react';
import styled from 'styled-components/native';
import SideMenu from 'react-native-side-menu';

import { HeaderMenu, FooterMenu as FooterMenuUI } from '../../components/blocks';
import Colors from '../../config/Colors';

export { Header } from '../../components/blocks';

export const Container = styled.SafeAreaView`
  background-color: ${Colors.white};
  flex: 1;
`;

export const MenuLeft = styled(SideMenu).attrs({
  menu: <HeaderMenu />,
  menuPosition: 'right',
  openMenuOffset: 400,
  disableGestures: true,
})``;

export const FooterMenu = styled(FooterMenuUI)``;

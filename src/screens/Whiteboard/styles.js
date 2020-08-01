import styled from 'styled-components/native';

import Colors from '../../config/Colors';

export { Header, FooterMenu } from '../../components/blocks';
export { LandscapeBoard } from './LandscapeBoard';
export { PortraitBoard } from './PortraitBoard';

export const SafeContainer = styled.SafeAreaView`
  background-color: ${Colors.white};
  flex: 1;
`;

export const ViewContainer = styled.View`
  background-color: ${Colors.white};
  flex: 1;
`;

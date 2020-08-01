import styled from 'styled-components/native';

import { Text } from '../../../ui';
import Colors from '../../../../config/Colors';

export const Container = styled.View`
  margin-right: ${(props) => (props.isEven ? 0 : 10)}px;
  margin-bottom: 10px;
`;

export const Image = styled.Image`
  background-color: grey;
  height: 140px;
  width: 140px;
`;

export const FileNameLabel = styled(Text)`
  color: ${Colors.headerBackgroundColor};
`;

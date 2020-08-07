import styled from 'styled-components/native';

import { Text } from '../Text';

import Colors from '../../../config/Colors';

export const ValueText = styled(Text)`
  color: ${Colors.choosenGreen};
  position: absolute;
  top: -30px;
  left: -5px;
  width: 50px;
  font-size: 18px;
  font-weight: bold;
`;

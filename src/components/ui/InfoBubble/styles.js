import styled from 'styled-components';

import Colors from '../../../config/Colors';

export const Bubble = styled.View`
  background-color: ${Colors.bubbleBack};
  border-radius: 15px;
  border-bottom-left-radius: 0;
  align-items: center;
  justify-content: center;
  padding: 7px 20px 7px 17px;
  height: 30px;
`;

export const Text = styled.Text`
  color: ${Colors.bubbleText};
`;

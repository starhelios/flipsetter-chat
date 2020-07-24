import styled from 'styled-components/native';

import { Image } from '../../../ui/Image';

export { Text } from '../../../ui/Text';

export const Container = styled.View`  
  border-bottom-width: ${(props) => (props.islast ? '0' : '2')}px;
  padding-vertical: 15px;
  padding-horizontal: 15px;
  border-color: grey;
  flex-direction: row;
`;

export const Icon = styled(Image).attrs({
  resizeMode: 'contain',
})`
  height: 25px;
  width: 25px;
  margin-right: 10px;
`;

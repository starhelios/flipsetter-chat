import React from 'react';
import {
  Container, Text, Icon, Touch,
} from './styles';

export const MenuListItem = ({
  label, iconSource, isLast, onPress,
}) => {
  return (
    <Touch onPress={onPress}>
      <Container isLast={isLast}>
        <Icon source={iconSource} />
        <Text>{label}</Text>
      </Container>
    </Touch>
  );
};

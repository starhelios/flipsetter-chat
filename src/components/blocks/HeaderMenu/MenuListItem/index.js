import React from 'react';
import { Container, Text, Icon } from './styles';

export const MenuListItem = ({ label, iconSource, isLast }) => {
  return (
    <Container isLast={isLast}>
      <Icon source={iconSource} />
      <Text>{label}</Text>
    </Container>
  );
};

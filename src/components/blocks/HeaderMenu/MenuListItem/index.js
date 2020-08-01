import React from 'react';
<<<<<<< HEAD
import { Container, Text, Icon } from './styles';

export const MenuListItem = ({ label, iconSource, isLast }) => {
  return (
    <Container isLast={isLast}>
      <Icon source={iconSource} />
      <Text>{label}</Text>
    </Container>
=======
import { Container, Text, Icon, Touch } from './styles';

export const MenuListItem = ({ label, iconSource, isLast, onPress }) => {
  return (
    <Touch onPress={onPress}>
      <Container isLast={isLast}>
        <Icon source={iconSource} />
        <Text>{label}</Text>
      </Container>
    </Touch>
>>>>>>> artemBranch
  );
};

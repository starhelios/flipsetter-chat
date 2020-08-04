import React from 'react';
import PT from 'prop-types';
import noop from 'lodash/noop'

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

MenuListItem.propTypes = {
  label: PT.string,
  iconSource: PT.number.isRequired,
  isLast: PT.bool,
  onPress: PT.func,
};

MenuListItem.defaultProps = {
  label: null,
  isLast: false,
  onPress: noop,
};

import React from 'react';
import PT from 'prop-types';

import { Bubble, Text } from './styles';

export const InfoBubble = ({ label, ...props }) => {
  return (
    <Bubble {...props}>
      <Text>{label}</Text>
    </Bubble>
  );
};

InfoBubble.propTypes = {
  label: PT.string.isRequired,
};

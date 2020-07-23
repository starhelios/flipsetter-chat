import React from 'react';
import PT from 'prop-types';

import { TextUI } from './styles';

export const Text = ({ children, ...textProps }) => {
  return <TextUI {...textProps}>{children}</TextUI>;
};

Text.propTypes = {
  children: PT.string.isRequired,
};

import React from 'react';
import { Image as ImageUI } from 'react-native';

import { Container } from './styles';

export const Image = ({ ...restProps }) => {
  return <Container {...restProps} />;
};

Image.propTypes = {
  ...ImageUI.propTypes,
};

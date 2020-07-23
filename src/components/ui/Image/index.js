import React from 'react';
import { Image as ImageUI } from 'react-native';

import { Container } from './styles';

export const Image = ({ source, ...restProps }) => {
  return <Container source={source} {...restProps} />;
};

Image.propTypes = {
  ...ImageUI.propTypes,
};

import React from 'react';
import PT from 'prop-types';

import { Container, Image, FileNameLabel } from './styles';

export const File = ({ file, isEven }) => {
  return (
    <Container isEven={isEven}>
      <Image source={file.thumbImg} />
      <FileNameLabel>{file.fileName}</FileNameLabel>
    </Container>
  );
};

File.propTypes = {
  file: PT.object.isRequired,
  isEven: PT.bool,
};

File.defaultProps = {
  isEven: false,
};

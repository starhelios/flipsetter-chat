import React from 'react';

import { Container, Icon } from './style';

import {
  magicPointerIcon, uploadImageIcon, pencilIcon, eraserIcon, palitraIcon, fillIcon,
} from '../../../images';

export const SettingWhitebordMenu = () => {
  return (
    <Container>
      <Icon iconSource={magicPointerIcon} />
      <Icon iconSource={pencilIcon} />
      <Icon iconSource={eraserIcon} />
      <Icon iconSource={palitraIcon} />
      <Icon iconSource={fillIcon} />
      <Icon iconSource={uploadImageIcon} />
    </Container>
  );
};

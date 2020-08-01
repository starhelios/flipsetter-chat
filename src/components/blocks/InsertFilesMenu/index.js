import React from 'react';

import {
  Scroller, Container, MenuListItem, Text, ContainerHorizontal,
} from './styles';

import {
  cameraIcon,
  photoPickerIcon,
  uploadIcon,
} from '../../../images';

import { useOrientation } from '../../../helper/useOrientation';

const MENU_ITEMS = [
  {
    id: 'takePhoto',
    icon: cameraIcon,
    name: 'Take photo',
  },
  {
    id: 'choosePhoto',
    icon: photoPickerIcon,
    name: 'Choose photo',
  },
  {
    id: 'uploadFile',
    icon: uploadIcon,
    name: 'Upload file',
  },
];

export const InsertFileMenu = () => {
  const renderItem = ({ item, index }) => {
    return (
      <MenuListItem
        label={item.name}
        iconSource={item.icon}
        isLast={(MENU_ITEMS.length - 1) === index}
      />
    );
  };

  const orientation = useOrientation();
  const Wrapper = orientation === 'LANDSCAPE' ? ContainerHorizontal : Container;

  return (
    <Wrapper>
      <Text>Insert Files</Text>
      <Scroller
        data={MENU_ITEMS}
        renderItem={renderItem}
      />
    </Wrapper>
  );
};

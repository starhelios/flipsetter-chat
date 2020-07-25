import React from 'react';

import {
  Scroller, Container, MenuListItem, Text,
} from './styles';

import {
  uploadImageIcon,
  imageIcon,
  whitePaperIcon,
  fillIcon,
  graphIcon,
} from '../../../images';

const MENU_ITEMS = [
  {
    id: 'takePhoto',
    icon: fillIcon,
    name: 'Take photo',
  },
  {
    id: 'choosePhoto',
    icon: graphIcon,
    name: 'Choose photo',
  },
  {
    id: 'uploadFile',
    icon: uploadImageIcon,
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

  return (
    <Container>
      <Text>Insert Files</Text>
      <Scroller
        data={MENU_ITEMS}
        renderItem={renderItem}
      />
    </Container>
  );
};

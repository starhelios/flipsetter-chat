import React from 'react';

import {
  Scroller, Container, MenuListItem, Text, ContainerHorizontal,
} from './styles';

import {
  shapeIcon,
  imageIcon,
  whitePaperIcon,
  fillIcon,
  graphIcon,
} from '../../../images';

import { useOrientation } from '../../../helper/useOrientation';

const MENU_ITEMS = [
  {
    id: 'fillBack',
    icon: fillIcon,
    name: 'Fill background with current color',
  },
  {
    id: 'addGraph',
    icon: graphIcon,
    name: 'Add graph paper',
  },
  {
    id: 'addLined',
    icon: whitePaperIcon,
    name: 'Add lined paper',
  },
  {
    id: 'uploadBackground',
    icon: imageIcon,
    name: 'Upload background image',
  },
  {
    id: 'chooseBackground',
    icon: shapeIcon,
    name: 'Choose background pattern',
  },
];

export const BackgroundColorMenu = () => {
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
      <Text>Change background</Text>
      <Scroller
        data={MENU_ITEMS}
        renderItem={renderItem}
      />
    </Wrapper>
  );
};

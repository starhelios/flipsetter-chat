import React, { useCallback, useState } from 'react';

import {
  Scroller, Container, MenuListItem, Text, ContainerHorizontal, BackgroundPatternModal,
} from './styles';

import {
  shapeIcon,
  imageIcon,
  whitePaperIcon,
  fillIcon,
  graphIcon,
} from '../../../images';

import { useOrientation } from '../../../helper/useOrientation';

const BackgroundColorMenu = ({ onClose }) => {
  const [fillBackground, setFillBackground] = useState(false);
  const [addGraphPaper, setAddGraphPaper] = useState(false);
  const [addLinedPaper, setAddLinedPaper] = useState(false);
  const [uploadBackgroundImage, setUploadBackgroundImage] = useState(false);
  const [choosePattern, setChoosePattern] = useState(false);

  const MENU_ITEMS = [
    {
      id: 'fillBack',
      icon: fillIcon,
      name: 'Fill background with current color',
      onPress: () => setFillBackground((val) => !val),
    },
    {
      id: 'addGraph',
      icon: graphIcon,
      name: 'Add graph paper',
      onPress: () => setAddGraphPaper((val) => !val),
    },
    {
      id: 'addLined',
      icon: whitePaperIcon,
      name: 'Add lined paper',
      onPress: () => setAddLinedPaper((val) => !val),
    },
    {
      id: 'uploadBackground',
      icon: imageIcon,
      name: 'Upload background image',
      onPress: () => setUploadBackgroundImage((val) => !val),
    },
    {
      id: 'chooseBackground',
      icon: shapeIcon,
      name: 'Choose background pattern',
      onPress: () => setChoosePattern((val) => !val),
    },
  ];

  const renderItem = ({ item, index }) => {
    return (
      <MenuListItem
        label={item.name}
        iconSource={item.icon}
        isLast={(MENU_ITEMS.length - 1) === index}
        onPress={item.onPress}
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
      <BackgroundPatternModal
        visible={choosePattern}
        onClose={() => setChoosePattern((val) => !val)}
      />
    </Wrapper>
  );
};

export default BackgroundColorMenu;

import React from 'react';

import { Scroller, Container, MenuListItem } from './styles';

import {
  addParticipantsIcon,
  leaveIcon,
  inviteIcon,
  crossIcon,
  downloadIcon,
} from '../../../images';

const MENU_ITEMS = [
  {
    id: 'addParticipants',
    icon: addParticipantsIcon,
    name: 'Add participants',
  },
  {
    id: 'generateInviteLink',
    icon: inviteIcon,
    name: 'Generate invite link',
  },
  {
    id: 'downloadWhiteboard',
    icon: downloadIcon,
    name: 'Download whiteboard as image',
  },
  {
    id: 'endWhiteboard',
    icon: crossIcon,
    name: 'End whiteboard',
  },
  {
    id: 'leaveWhite',
    icon: leaveIcon,
    name: 'Leave whiteboard',
  },
];

export const HeaderMenu = () => {
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
      <Scroller
        data={MENU_ITEMS}
        renderItem={renderItem}
      />
    </Container>
  );
};

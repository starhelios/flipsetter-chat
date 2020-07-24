import React from 'react';

import { Scroller, Container, MenuListItem } from './styles';

import { addParticipantsIcon, leaveIcon, inviteIcon, crossIcon, downloadIcon} from '../../../images';

const MENU_ITEMS = [
  {
    id: 'addParticipants',
    icon: addParticipantsIcon,
    name: 'Add participants',
  },
  {
    id: 'generateInviteLink',
    icon: leaveIcon,
    name: 'Generate invite link',
  },
  {
    id: 'downloadWhiteboard',
    icon: inviteIcon,
    name: 'Download whiteboard as image',
  },
  {
    id: 'endWhiteboard',
    icon: crossIcon,
    name: 'End whiteboard',
  },
  {
    id: 'leaveWhite',
    icon: downloadIcon,
    name: 'Leave whiteboard',
  },
];

export const HeaderMenu = () => {
  const renderItem = ({ item }) => {
    return <MenuListItem label={item.name} iconSource={item.icon} />
  }

  return (
    <Container>
      <Scroller
        data={MENU_ITEMS}
        renderItem={renderItem}
      />
    </Container>
  );
};

import React from 'react';
<<<<<<< HEAD
=======
import noop from 'lodash/noop'
import { withNavigation } from 'react-navigation';
>>>>>>> artemBranch

import { Scroller, Container, MenuListItem } from './styles';

import {
  addParticipantsIcon,
  leaveIcon,
  inviteIcon,
  crossIcon,
  downloadIcon,
} from '../../../images';

<<<<<<< HEAD
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
=======

export const HeaderMenu = withNavigation(({navigation, thread_id}) => {
  const MENU_ITEMS = [
    {
      id: 'addParticipants',
      icon: addParticipantsIcon,
      name: 'Add participants',
      onPress: noop,
    },
    {
      id: 'generateInviteLink',
      icon: inviteIcon,
      name: 'Generate invite link',
      onPress: noop,
    },
    {
      id: 'downloadWhiteboard',
      icon: downloadIcon,
      name: 'Download whiteboard as image',
      onPress: noop,
    },
    {
      id: 'endWhiteboard',
      icon: crossIcon,
      name: 'End whiteboard',
      onPress: noop,
    },
    {
      id: 'leaveWhite',
      icon: leaveIcon,
      name: 'Leave whiteboard',
      onPress: () => navigation.navigate('Messages', {
        thread: thread_id,
        callEnded: true,
      }),
    },
  ];

>>>>>>> artemBranch
  const renderItem = ({ item, index }) => {
    return (
      <MenuListItem
        label={item.name}
        iconSource={item.icon}
<<<<<<< HEAD
=======
        onPress={item.onPress}
>>>>>>> artemBranch
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
<<<<<<< HEAD
};
=======
});
>>>>>>> artemBranch

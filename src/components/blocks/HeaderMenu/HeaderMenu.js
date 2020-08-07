import React from 'react';
import { withNavigation } from 'react-navigation';
import noop from 'lodash/noop';
import get from 'lodash/get';

import { Scroller, Container, MenuListItem } from './styles';

import {
  addParticipantsIcon,
  leaveIcon,
  inviteIcon,
  crossIcon,
  downloadIcon,
} from '../../../images';

export default withNavigation(({ navigation, call }) => {
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
        thread: get(call, 'threadId', null),
        callEnded: true,
      }),
    },
  ];

  const renderItem = ({ item, index }) => {
    return (
      <MenuListItem
        label={item.name}
        iconSource={item.icon}
        onPress={item.onPress}
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
});

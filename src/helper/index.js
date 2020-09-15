import {emojify} from 'react-emojione';
import {AllHtmlEntities as entities} from 'html-entities';
import config from '../config';

export const constructProperMessage = (message) => {
  let newMessage = '';
  switch (message.message_type) {
    case 0:
      newMessage = {
        _id: message.message_id,
        text: emojify(entities.decode(message.body), {output: 'unicode'}),
        createdAt: message.created_at,
        user: {
          _id: message.owner_id,
          name: message.name,
          avatar: `https://${config.api.uri}${message.avatar}`,
        },
      };
      break;
    case 1:
      newMessage = {
        _id: message.message_id,
        image: `https://${config.api.uri}/${config.api.images.messengerPhoto(
          message.message_id,
        )}`,
        imageBig: `https://${config.api.uri}/${config.api.images.messengerPhoto(
          message.message_id,
          message.body,
        )}`,
        createdAt: message.created_at,
        user: {
          _id: message.owner_id,
          name: message.owner_name,
          avatar: `https://${config.api.uri}${message.avatar}`,
        },
      };
      break;

    case 2:
      newMessage = {
        _id: message.message_id,
        file: message.body,
        createdAt: message.created_at,
        user: {
          _id: message.owner_id,
          name: message.owner_name,
          avatar: `https://${config.api.uri}${message.avatar}`,
        },
      };
      break;
    case 89:
      newMessage = {
        _id: message.message_id,
        text: `${message.name} ${message.body}`,
        createdAt: message.created_at,
        system: true,
      };
      break;
    case 90:
      newMessage = {
        _id: message.message_id,
        text: `${message.name} ${message.body}`,
        createdAt: message.created_at,
        system: true,
      };
      break;
    case 99:
      newMessage = {
        _id: message.message_id,
        text: `${message.name} ${message.body}`,
        createdAt: message.created_at,
        system: true,
      };
      break;
    default:
      newMessage = message;
  }
  return newMessage;
};

import React, { useEffect, useState, useCallback } from 'react';
import get from 'lodash/get';

import { man4Img, man3Img } from '../../../images';

import {
  Chat, Container, InfoBubble, SystemWrapper, InputToolbar,
} from './styles';

export const Messenger = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Alice said very politely, \'if I had it written down: but I grow',
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: 'I only wish people knew that: then they wouldn\'t be so easily offended!',
        createdAt: new Date(),
        user: {
          _id: 3,
          name: 'React Native',
          avatar: man4Img,
        },
      },
      {
        _id: 3,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 4,
          name: 'React Native',
          avatar: man3Img,
        },
      },
      {
        _id: 4,
        text: 'You\'ve connected to the chat',
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, []);

  const onSend = useCallback((newMessages = []) => {
    setMessages((previousMessages) => Chat.append(previousMessages, newMessages));
  }, []);

  return (
    <Container>
      <Chat
        messages={messages}
        onSend={onSend}
        placeholder="Start typing"
        onPressActionButton={() => null}
        renderInputToolbar={(props) => <InputToolbar {...props} />}
        renderSystemMessage={(props) => <SystemWrapper><InfoBubble rounded label={get(props, 'currentMessage.text', '')} /></SystemWrapper>}
        user={{
          _id: 1,
        }}
      />
    </Container>
  );
};

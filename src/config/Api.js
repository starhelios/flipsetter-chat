import React, {Component} from 'react';
import config from './Config.js';

export default function Api() {
  const apiVersion = 0;
  const prefix = `api/v${apiVersion}`;
  const prefix1 = 'api/v1';

  const uri =
    config.env === 'dev'
      ? `${config.dev.uri}/${prefix}`
      : `${config.prod.uri}/${prefix}`;
  const uri1 =
    config.env === 'dev'
      ? `${config.dev.uri}/${prefix1}`
      : `${config.prod.uri}/${prefix1}`;

  const endpoints = {
    client: {
      get: {
        version: 'version',
        logout: 'logout',
        heartbeat: 'auth/heartbeat',
      },
      post: {
        // deviceRegister: `device/register`,
        // deviceJoin: `device/join`,
        deviceRegister: 'user/devices',
        deviceJoin: 'user/devices',
        register: 'auth/register',
        resetPassword: 'auth/password/email',
        reportError: 'report/error',
        heartbeat: 'auth/heartbeat',
      },
    },
    user: {
      get: {
        info: 'user',
        verify: 'user/verify/resend',
        dashboard: 'user/dashboard',
      },
      post: {},
    },
    friends: {
      get: {
        list: 'friends',
        sent: 'friends/sent',
        pending: 'friends/pending',
      },
      post: {
        add: 'friends/add',
        remove: 'friends/remove',
        cancel: 'friends/cancel',
        accept: 'friends/accept',
        deny: 'friends/deny',
      },
    },
    messenger: {
      get: {
        search: (query) => `messenger/search/${query}`,

        create: (slug, alias) => `messenger/create/${slug}/${alias}`,
        fetchCall: (threadId, callId, type) =>
          `messenger/${threadId}/call/${callId}/${type}`, // heartbeat
        type: (type) => `messenger/get/${type}`, // All threads, thread settings, recent threads
        getMessages: (threadId, type, messageId = '') =>
          `messenger/get/${threadId}/${type}`,
        getEarlierMessages: (threadId, messageId) =>
          `messenger/get/${threadId}/messages/${messageId}`,
      },
      post: {
        join: (slug) => `messenger/join/${slug}`,
        saveCall: (threadId, callId) => `messenger/${threadId}/call/${callId}`,
        saveThread: (threadId) => `messenger/save/${threadId}`, // used to make call and other stuff, misleading
      },
    },
    // https://tippinweb.com/api/v0/images/full/image/img_5f2c17a9a7c751.08213544.jpeg

    images: {
      groupAvatar: (threadId, thumb = false) =>
        `images/messenger/groups/${threadId}/${thumb && thumb}`,
      messengerPhoto: (messageId, thumb = false) =>
        `images/messenger/${messageId}/${thumb && thumb}`,
      profileImage: (
        alias,
        slug,
        full = false,
        image = false,
        full_two = false,
      ) =>
        `images/${alias}/${slug}/${full}` &&
        `full/${image}` &&
        `image/${full_two}` &&
        'full_two/',
    },
  };

  return {
    apiVersion,
    prefix,
    prefix1,
    uri1,
    uri,
    ...endpoints,
  };
}

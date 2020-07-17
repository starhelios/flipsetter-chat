import config from './Config.js';
import React, {Component} from 'react';

export default function Api() {
  let apiVersion = 0;
  let prefix = `api/v${apiVersion}`;
  let uri =
    config.env === 'dev'
      ? `${config.dev.uri}/${prefix}`
      : `${config.prod.uri}/${prefix}`;
  let endpoints = {
    client: {
      get: {
        version: 'version',
        logout: 'logout',
        heartbeat: 'auth/heartbeat',
      },
      post: {
        deviceRegister: 'device/register',
        deviceJoin: 'device/join',
        register: 'register',
        resetPassword: 'password/reset',
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
      post: {
        deviceUpdate: 'user/devices',
      },
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
        search: query => `messenger/search/${query}`,

        create: (slug, alias) => `messenger/create/${slug}/${alias}`,
        fetchCall: (threadId, callId, type) =>
          `messenger/${threadId}/call/${callId}/${type}`, //heartbeat
        type: type => `messenger/get/${type}`, //All threads, thread settings, recent threads
        getMessages: (threadId, type, messageId = '') =>
          `messenger/get/${threadId}/${type}`,
      },
      post: {
        join: slug => `messenger/join/${slug}`,
        saveCall: (threadId, callId) => `messenger/${threadId}/call/${callId}`,
        saveThread: threadId => `messenger/save/${threadId}`, //used to make call and other stuff, misleading
      },
    },
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
        `images/${alias}/${slug}/` + full &&
        'full/' + image &&
        'image/' + full_two &&
        'full_two/',
    },
  };

  return {
    apiVersion: apiVersion,
    prefix: prefix,
    uri: uri,
    ...endpoints,
  };
};
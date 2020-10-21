import React, {Component} from 'react';
import {Platform} from 'react-native';
import {connect} from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import VoipPushNotification from 'react-native-voip-push-notification';
import {App, Auth, Threads, Messages, Call} from '../reducers/actions';
import DeviceInfo from 'react-native-device-info';
import RNCallKeep, {CONSTANTS} from 'react-native-callkeep';
import InCallManager from 'react-native-incall-manager';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import NavigationService from './NavigationService';
import {emojify} from 'react-emojione';
import {AllHtmlEntities as entities} from 'html-entities';
import config from '../config';

class FirebaseService extends Component<Props> {
  state = {
    lastThreadId: null,
    init: false,
  };
  constructor(props) {
    super(props);
    // this.props.storeThreads({});
  }

  async componentDidMount() {
    this._checkPermission();
    const device_token = await messaging().getToken();
    this.props.setDeviceToken(device_token);
    this.props.setDeviceID(await DeviceInfo.getUniqueId());

    // if(this.props.auth.isLoggedIn && this.props.user.id){
    //     this.props.joinDevice(this.props.app.device_id, (this.props.app.fcm_token) ? this.props.app.fcm_token : null, (this.props.app.voip_token) ? this.props.app.voip_token: null);
    // }
    //User Opened Notification while app was closed
    messaging()
      .getInitialNotification()
      .then((notificationOpen) => {
        if (notificationOpen) {
          // Get the action triggered by the notification being opened
          // const action = notificationOpen.action;
          // Get information about the notification that was opened
          const notification: Notification = notificationOpen.notification;

          if (this.props.app.lastNotification !== notification.notificationId) {
            let thread_id = JSON.parse(notification.data.extraPayload)
              .thread_id;
            this.props.setActiveThread(thread_id);
            this.props.setLastNotification(notification.notificationId);
            NavigationService.navigate('Messages', {
              thread: thread_id,
            });
          } else {
          }
        }
      });
  }

  componentWillUnmount() {
    if (this.fcmTokenListener) {
      this.fcmTokenListener();
    }
    if (this.fcmTokenListener) {
      this.messageListener();
    }
    if (this.fcmTokenListener && this.removeNotificationDisplayedListener) {
      this.removeNotificationDisplayedListener();
    }
    if (this.fcmTokenListener) {
      this.removeNotificationListener();
    }
    if (this.fcmTokenListener && this.notificationOpenedListener) {
      this.notificationOpenedListener();
    }
  }

  async componentDidUpdate(prevProps) {
    // if(prevProps.app.fcm_token !== this.props.app.fcm_token || prevProps.app.voip_token !== this.props.app.voip_token || prevProps.app.device_id !== this.props.app.device_id){
    //     await this.props.joinDevice(this.props.app.device_id, (this.props.app.fcm_token) ? this.props.app.fcm_token : null, (this.props.app.voip_token) ? this.props.app.voip_token: null)
    // }
    //
    // if(prevProps.auth.isLoggedIn !== this.props.auth.isLoggedIn && this.props.auth.isLoggedIn && this.props.auth.accessToken && !this.state.init){
    //     this.setState({
    //         init: true,
    //     }, async() => {await this.props.joinDevice(this.props.app.device_id, (this.props.app.fcm_token) ? this.props.app.fcm_token : null, (this.props.app.voip_token) ? this.props.app.voip_token: null)});
    // }

    if (!this.state.init && this.props.auth.isLoggedIn) {
      this.setState(
        {
          init: true,
        },
        async () => {
          //First App Load let's link device to user account
          await this.props.joinDevice(
            this.props.app.device_id,
            this.props.app.device_token,
            this.props.app.voip_token,
          );
        },
      );
    }

    if (this.props.auth.isLoggedIn !== prevProps.auth.isLoggedIn) {
      if (!this.props.auth.isLoggedIn) {
        messaging().deleteToken();
      } else {
        //subscribe again
      }

    }
  }

  _checkPermission = async () => {
    messaging().hasPermission().then(granted => {
      if(granted === -1){
        this._getPermission();
      } else {
        if (Platform.OS === 'ios') {
          VoipPushNotification.registerVoipToken();
        }
        this._listeners();
      }
    })
  };

  _getPermission = async () => {
    messaging().requestPermission().then(() => {
      this._listeners();
      VoipPushNotification.registerVoipToken();
    }).catch((error) => {
      //user has rejected permissions
    })

  }

  async _listeners() {
    console.log('Listeners');
    this.fcmTokenListener = messaging().onTokenRefresh((fcmToken) => {
      this.props.setDeviceToken(fcmToken);
    });
    console.log('Message listener');
    this.messageListener = messaging().onMessage((message) => {
      let data = JSON.parse(message.data.extraPayload);
      switch (data.notification_type) {
        case 0:
          this.messageReceived(message);
          break;
        case 2:
          this.newCall(message, data);
          break;
        case 7:
          this.joinedCall(message, data);
          break;
        default:
          // InCallManager.stopRingtone();
          console.log('caught', message);
      }
    });
    //notification received
    console.log('notification listener');

    this.removeNotificationListener = messaging().onNotificationOpenedApp(
      async (notification: Notification) => {
        console.log('Notification', notification);
        let data = JSON.parse(notification.data.extraPayload);
        console.log('Notification Case', data.notification_type);
        switch (data.notification_type) {
          case 0:
            this.messageReceived(notification);
            break;
          case 2:
            this.newCall(notification, data);
            break;
          case 3:
            this.endCall(notification, data);
            break;
          case 7:
            this.joinedCall(notification, data);
            break;
          default:
            console.log('caught', notification);
        }
        // console.log("badges", notification)
      },
    );
    console.log('Notification displayed listener');

    //Notification was displayed
    this.removeNotificationDisplayedListener = messaging().onNotificationDisplayed(
      async (notification) => {
        // console.log("N1", notification);
        // console.log(this.props.threads.activeThread);

        //notification displayed but not opened
        if (notification.data.thread_id !== this.props.threads.activeThread) {
          const badgeCount = await messaging().getBadge();
          messaging().setBadge(badgeCount + 1);
        }
        // firebase.messaging().badge(5)
        // Process your notification as required
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
      },
    );

    //User Opened/interacted with the notification
    console.log('Notification opened');
    this.notificationOpenedListener = messaging().onNotificationOpenedApp(
      async (notificationOpen: NotificationOpen) => {
        // Get the action triggered by the notification being opened
        //notification displayed but not opened
        // const badgeCount = await messaging().getBadge();
        // messaging().setBadge(badgeCount - 1);
        // const action = notificationOpen;
        // console.log("notificationOpen", notificationOpen)
        // console.log("action",action);
        // // Get information about the notification that was opened
        // const notification: Notification = action.notification;
        // const data = notification._data
        // console.log("opened", data);
        let notification = notificationOpen.notification;
        let data = notification.data;

        console.log('Im inside notification opened');
        console.log(data);
        NavigationService.navigate('Threads', {
          newMessage: data.thread_id,
        });
        // this.props.setActiveThread(data.thread_id);
      },
    );

    if (Platform.OS === 'ios') {
      VoipPushNotification.addEventListener('register', (token) => {
        if (this.props.app.voip_token !== token) {
          this.props.setVOIPToken(token);
        }
      });
      VoipPushNotification.addEventListener('notification', (notification) => {
        console.log('VOIP', notification);
        let data = notification.data.extraPayload;
        this.newCall(notification, data);
      });
    }
  }

  newCall = (notification, data) => {
    console.log('newCall', data);
    // InCallManager.startRingtone('_BUNDLE_');
    this.props.setAppState('callDisplayed');
    this.props.setCallType(data.call_type);
    this.props.setCallRoom(data.room_id);
    this.props.setCallRoomPin(data.room_pin);
    this.props.setCallerName(data.sender_name);
    this.props.setCallThreadId(data.thread_id);
    this.props.appHeartbeat();
    if (Platform.OS === 'android') {
      console.log('android call', notification);
      RNCallKeep.displayIncomingCall(
        data.call_id,
        data.thread_name,
        data.sender_name,
        'generic',
        true,
      );
    }
  };

  endCall = async (notification, data) => {
    //Call Ended, at this time we only need to clear the data and trigger heartbeat.
    if (this.props.threads.activeThread && this.props.app.route === 'Call') {
      let status;

      console.log('Is Call Active', status);
      if (status) {
        console.log('Ending Active Call');
      }
      if (this.props.call.id) {
        RNCallKeep.endCall(this.props.call.id);
      }
      NavigationService.navigate('Messages', {
        thread: this.props.threads.activeThread,
      });
      this.props.setCallId(null);
      this.props.setCallStatus('ended');
      this.props.setCallType(null);
      this.props.setCallRoom(null);
      this.props.setCallRoomPin(null);
      this.props.setCallerName(null);
      this.props.setCallThreadId(null);
      this.props.appHeartbeat();
    } else if (this.props.app.route !== 'Call') {
      this.props.setCallId(null);
      this.props.setCallStatus('ended');
      this.props.setCallType(null);
      this.props.setCallRoom(null);
      this.props.setCallRoomPin(null);
      this.props.setCallerName(null);
      this.props.setCallThreadId(null);
      this.props.appHeartbeat();
    }
  };
  joinedCall = (notification, data) => {
    // InCallManager.stopRingtone();
    // console.log("joinedCall", data);
    // if(this.props.call.status !== 'active'){
    //     console.log("end Call answered on another device");
    //     RNCallKeep.reportEndCallWithUUID(data.call_id, CONSTANTS.END_CALL_REASONS.ANSWERED_ELSEWHERE);
    // }
  };

  messageReceived = async (notification) => {
    let body;

    // console.log(channel.channelId);
    let data = JSON.parse(notification._data.extraPayload);
    console.log(notification, 'check the new message', data);
    let check = Object.values(
      this.props.messages.messages[data.thread_id],
    ).filter((message) => {
      if (
        message._id === data.temp_id ||
        message._id === data.message_id ||
        data.owner_id === this.props.user.id
      ) {
        return message;
      }
    });

    if (check.length === 0) {
      switch (data.message_type) {
        case 0:
          body = `${emojify(entities.decode(data.body), {output: 'unicode'})}`;
          break;
        case 1:
          body = `${data.name} sent a photo`;
          break;
        case 2:
          body = `${data.name} sent a document`;
          break;
        case 89:
          body = `${data.name} ${data.body}`;
          break;
        case 90:
          body = `${data.name} ${data.body}`;

          break;
      }

      if (
        data.thread_id !== this.props.threads.activeThread &&
        this.props.user.id !== data.owner_id
      ) {
        const channel = new messaging.Android.Channel(
          'default',
          'Default Channel',
          messaging.Android.Importance.Max,
        ).setDescription('Default channel');
        await messaging().android.createChannel(channel);

        if (Platform.OS === 'android') {
          const groupDisplay = new messaging.Notification().android
            .setChannelId(notification.data.channelId)
            .setNotificationId(data.thread_id)
            .setSound('messagealert.mp3')
            .setSubtitle(
              data.thread_type === 2 ? data.thread_subject : data.name,
            )
            .setData({
              ...data,
            })
            // .setTitle(data.thread_subject)
            // .setBody(body)
            // .android.setLargeIcon(`${config.api.uri}${data.avatar}`)
            .android.setGroup(data.thread_id)
            .android.setGroupSummary(true)
            .android.setColor('#24422e')
            .android.setGroupAlertBehaviour(
              messaging.Android.GroupAlert.Children,
            );
        }

        let display = new messaging.Notification();
        display
          .setNotificationId(data.message_id)
          .setTitle(data.thread_type === 2 ? data.thread_subject : data.name)
          .setBody(body)
          .setSound('messagealert.mp3')
          .setData({
            ...data,
          });
        if (Platform.OS === 'android') {
          display.android
            .setChannelId(notification.data.channelId)
            .android.setAutoCancel(true)
            // .android.setLargeIcon(avatar)// create this icon in Android Studio
            // .android.setBigPicture(`${config.api.uri}${data.avatar}` )
            .android.setTag(data.name)
            .android.setGroup(data.thread_id)
            .android.setGroupAlertBehaviour(
              messaging.Android.GroupAlert.Children,
            );
        }
        if (Platform.OS === 'ios') {
          display.ios
            .setThreadIdentifier(data.thread_id)
            .ios.setAlertAction('input')
            .ios.setHasAction(true);
        }

        // .ios.setThreadIdentifier(data.thread_id)
        // .android.setBigText((data.message_type === 0 && data.thread_type === 2) ? `${data.name}: ${body}` : body)
        // .android.setPriority(firebase.notifications.Android.Priority.High)
        // .android.setSmallIcon('ic_stat_flipsetter_iconpng_transparent')
        // .android.setColor('#24422e') // you can set a color here
        // .android.setPriority(firebase.notifications.Android.Priority.High)

        // console.log("groupDisplay", groupDisplay);
        // console.log("display", display);
        if (Platform.OS === 'android') {
          try {
            messaging()
              .displayNotification(groupDisplay)
              .catch((err) => {
                console.log('send notif err', err);
                return Promise.resolve();
              });
          } catch (e) {
            console.log('group_error', e);
          }
        }
        try {
          messaging()
            .displayNotification(display)
            .catch((err) => {
              console.log('send notif err', err);
              return Promise.resolve();
            });
        } catch (e) {
          console.log('group_error', e);
        }
      }
      let newMessage = {};
      switch (data.message_type) {
        case 0:
          newMessage = {
            _id: data.message_id,
            text: emojify(entities.decode(data.body), {output: 'unicode'}),
            createdAt: data.created_at,
            user: {
              _id: data.owner_id,
              name: data.name,
              avatar: `https://${config.api.uri}` + data.avatar,
            },
          };
          break;
        case 1:
          newMessage = {
            _id: data.message_id,
            image:
              `https://${config.api.uri}/images/messenger/` + data.message_id,
            createdAt: data.created_at,
            user: {
              _id: data.owner_id,
              name: data.owner_name,
              avatar: `https://${config.api.uri}${data.avatar}`,
            },
          };
          break;
        case 2:
          newMessage = {
            _id: data.message_id,
            file: data.body,
            createdAt: data.created_at,
            user: {
              _id: data.owner_id,
              name: data.owner_name,
              avatar: `https://${config.api.uri}${data.avatar}`,
            },
          };
          break;
        case 89:
          newMessage = {
            _id: data.message_id,
            text: `${data.name} ${data.body}`,
            createdAt: data.created_at,
            system: true,
          };
          break;
        case 90:
          newMessage = {
            _id: data.message_id,
            text: `${data.name} ${data.body}`,
            createdAt: data.created_at,
            system: true,
          };
          break;
      }

      this.props.addMessage(data.thread_id, newMessage);

      //Lets still update the threads
      let threads = {...this.props.threads.threads};
      let thread = threads[data.thread_id];

      delete threads[data.thread_id];
      // console.log(this.props.messages.messages[data.thread_id]);
      thread.created_at = data.created_at;
      thread.updated_at = Date.now();
      thread.thread_subject = data.thread_subject;
      thread.thread_type = data.thread_type;
      thread.utc_created_at = data.utc_created_at;
      thread.recent_message = {
        body: body,
        message_type: data.message_type,
        name: data.name,
      };
      // console.log("thread1",thread);
      // if(thread.recent_message.message_type === 0){
      //     thread.recent_message.body = body;
      // }
      // if(thread.recent_message.message_type === 1){
      //     thread.recent_message.body = body;
      // }
      // if(thread.recent_message.message_type === 2){
      //     thread.recent_message.body = body;
      // }
      // if(thread.recent_message.message_type === 89){}
      // if(thread.recent_message.message_type === 90){}

      if (this.props.threads.activeThread !== data.thread_id) {
        thread.unread = true;
      } else {
        thread.unread = false;
      }

      // console.log("Thread", thread);

      this.props.storeThreads({
        [data.thread_id]: {
          ...thread,
        },
        ...threads,
      });
    }
  };

  render() {
    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    app: state.app,
    threads: state.threads,
    messages: state.messages,
    call: state.call,
    user: state.user,
  };
};

const mapDispatchToProps = {
  appHeartbeat: App.appHeartbeat,
  setAppState: App.setAppState,
  setDeviceToken: App.setDeviceToken,
  setVOIPToken: App.setVOIPToken,
  setDeviceID: App.setDeviceID,
  setLastNotification: App.setLastNotification,
  joinDevice: App.joinDevice,
  registerDevice: App.registerDevice,
  storeThreads: Threads.storeThreads,
  setActiveThread: Threads.setActiveThread,
  addMessage: Messages.addMessage,
  setCallId: Call.setCallId,
  setCallType: Call.setCallType,
  setCallRoom: Call.setCallRoom,
  setCallRoomPin: Call.setCallRoomPin,
  setCallerName: Call.setCallerName,
  setCallThreadId: Call.setCallThreadId,
  setCallStatus: Call.setCallStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(FirebaseService);

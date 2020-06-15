import React, {Component} from 'react';
import {Platform} from 'react-native';
import {connect} from "react-redux";
import firebase, {notifications} from "react-native-firebase";
import VoipPushNotification from 'react-native-voip-push-notification'
import {App, Auth, Threads, Messages, Call} from "../reducers/actions";
import DeviceInfo from "react-native-device-info";
import RNCallKeep from "react-native-callkeep";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import NavigationService from "./NavigationService";
import {emojify} from 'react-emojione';
import {AllHtmlEntities as entities} from 'html-entities';
import config from "../config";
import RNFetchBlob from "rn-fetch-blob";


class FirebaseService extends Component<Props> {

    state = {
        lastThreadId: null,
        init: null,
    }
    constructor(props) {
        super(props);
        // this.props.storeThreads({});
        this._checkPermission();


    }

    async componentDidMount(): void {

        const fcmToken = await firebase.messaging().getToken();
        this.props.setFCMToken(fcmToken);
        this.props.setDeviceID(await DeviceInfo.getUniqueId());



        // if(this.props.auth.isLoggedIn && this.props.user.id){
        //     this.props.joinDevice(this.props.app.device_id, (this.props.app.fcm_token) ? this.props.app.fcm_token : null, (this.props.app.voip_token) ? this.props.app.voip_token: null);
        // }
        //User Opened Notification while app was closed
        notifications().getInitialNotification().then((notificationOpen) => {
            if(notificationOpen){
                // Get the action triggered by the notification being opened
                // const action = notificationOpen.action;
                // Get information about the notification that was opened
                const notification: Notification = notificationOpen.notification;

                if(this.props.app.lastNotification !== notification.notificationId){
                    let thread_id = JSON.parse(notification.data.extraPayload).thread_id;
                    this.props.setActiveThread(thread_id);
                    this.props.setLastNotification(notification.notificationId);
                    NavigationService.navigate("Messages", {
                        thread: thread_id,
                    });

                }
                else{ }

            }
        });


    }

    componentWillUnmount(): void {
        if(this.fcmTokenListener){this.fcmTokenListener();}
        if(this.fcmTokenListener){this.messageListener();}
        if(this.fcmTokenListener){this.removeNotificationDisplayedListener();}
        if(this.fcmTokenListener){this.removeNotificationListener();}
        if(this.fcmTokenListener){this.notificationOpenedListener();}
    }

    async componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
        if(prevProps.app.fcm_token !== this.props.app.fcm_token || prevProps.app.voip_token !== this.props.app.voip_token || prevProps.app.device_id !== this.props.app.device_id){
            await this.props.joinDevice(this.props.app.device_id, (this.props.app.fcm_token) ? this.props.app.fcm_token : null, (this.props.app.voip_token) ? this.props.app.voip_token: null)
        }

        if(prevProps.auth.isLoggedIn !== this.props.auth.isLoggedIn && this.props.auth.isLoggedIn && this.props.auth.accessToken && !this.state.init){
            this.setState({
                init: true,
            }, async() => {await this.props.joinDevice(this.props.app.device_id, (this.props.app.fcm_token) ? this.props.app.fcm_token : null, (this.props.app.voip_token) ? this.props.app.voip_token: null)});
        }

        // if(this.props.auth.isLoggedIn && !this.state.init){
        //     this.setState({
        //         init: true,
        //     }, async() => {await this.props.joinDevice(this.props.app.device_id, (this.props.app.fcm_token) ? this.props.app.fcm_token : null, (this.props.app.voip_token) ? this.props.app.voip_token: null)});
        // }
    }

    _checkPermission = async () => {
        const enabled = await firebase.messaging().hasPermission();

        if(enabled){
            if(Platform.OS === "ios"){
                VoipPushNotification.registerVoipToken();
            }
            this._listeners();

        }
        else{
            firebase.messaging().requestPermission().then( () => {
                //User has Authorised
                this._listeners();
                VoipPushNotification.registerVoipToken();
            }).catch(error => {
                //user has rejected permissions
            });
        }


    }

    async _listeners(){
        this.fcmTokenListener = firebase.messaging().onTokenRefresh( fcmToken => {
            this.props.setFCMToken(fcmToken);
        });
        this.messageListener = firebase.messaging().onMessage((message) => {
            // console.log("Message", message);

        });
        //notification received
        this.removeNotificationListener = notifications().onNotification(async (notification: Notification) => {
            console.log("notification", notification);
            switch(JSON.parse(notification._data.extraPayload).notification_type){
                case 0: this.messageReceived(notification); break;
                case "new_call": this.newCall(notification); break;
                default: console.log("caught", notification);
            }
            // console.log("badges", notification)
        });
        //Notification was displayed
        this.removeNotificationDisplayedListener = notifications().onNotificationDisplayed(async(notification: Notification) => {
            // console.log("N1", notification);
            // console.log(this.props.threads.activeThread);

            //notification displayed but not opened
            if(notification._data.thread_id !== this.props.threads.activeThread){
                const badgeCount = await notifications().getBadge();
                notifications().setBadge(badgeCount + 1);
            }
            // firebase.notifications().badge(5)
            // Process your notification as required
            // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        });

        //User Opened/interacted with the notification
        this.notificationOpenedListener = notifications().onNotificationOpened(async (notificationOpen: NotificationOpen) => {
            // Get the action triggered by the notification being opened
            //notification displayed but not opened
            // const badgeCount = await notifications().getBadge();
            // notifications().setBadge(badgeCount - 1);
            // const action = notificationOpen;
            // console.log("notificationOpen", notificationOpen)
            // console.log("action",action);
            // // Get information about the notification that was opened
            // const notification: Notification = action.notification;
            // const data = notification._data
            // console.log("opened", data);
            let notification = notificationOpen.notification;
            let data = notification._data;


            NavigationService.navigate("Threads", {
                newMessage: data.thread_id,
            });
            // this.props.setActiveThread(data.thread_id);
        });



        if(Platform.OS === 'ios'){
            VoipPushNotification.addEventListener('register', (token) => {
                this.props.setVOIPToken(token);
            });
            VoipPushNotification.addEventListener('notification', (notification) => {
                // console.log("VOIP", notification);
                this.newCall(notification);

            });
        }
    };

    newCall = (notification) => {
        let data = notification._data.extraPayLoad;
        // console.log("newCall", notification._data);
        this.props.setCallType(data.call_type);
        this.props.setCallRoom(data.room_id);
        this.props.setCallRoomPin(data.room_pin);
        this.props.setCallerName(data.sender_name);
        this.props.setCallThreadId(data.thread_id);
        if(Platform.OS === "android"){
            console.log("android call", notification);
        }
    }

    messageReceived = async(notification) => {

        let body;

        // console.log(channel.channelId);
        let data = JSON.parse(notification.data.extraPayload);
        console.log("notif data", data);
        switch(data.message_type){
            case 0:
                body = (data.thread_type === 2) ? `${data.name}: ${emojify(entities.decode(data.body), {output: 'unicode'})}` : `${emojify(entities.decode(data.body), {output: 'unicode'})}`;
                break;
            case 1:
                body = `${data.name} sent a photo`;
                break;
            case 89:
                body = `${data.name} ${data.body}`;
                break;
            case 90:
                body = `${data.name} ${data.body}`;

                break;
        }


        if(data.thread_id !== this.props.threads.activeThread && this.props.user.id !== data.owner_id) {
            const channel = new firebase.notifications.Android.Channel('default', 'Default Channel', firebase.notifications.Android.Importance.Max)
                .setDescription('Default channel');
            await firebase.notifications().android.createChannel(channel);


            if(Platform.OS === 'android'){
                const groupDisplay = new firebase.notifications.Notification()
                .android.setChannelId(notification.data.channelId)
                .setNotificationId(data.thread_id)
                .setSubtitle((data.thread_type === 2) ? data.thread_subject : data.name)
                .setData({
                    ...data
                })
                // .setTitle(data.thread_subject)
                // .setBody(body)
                // .android.setLargeIcon(`${config.api.uri}${data.avatar}`)
                .android.setGroup(data.thread_id)
                .android.setGroupSummary(true)
                .android.setColor('#24422e')
                .android.setGroupAlertBehaviour(firebase.notifications.Android.GroupAlert.Children)
            }

            let display = new firebase.notifications.Notification();
            display.setNotificationId(data.message_id)
                .setTitle((data.thread_type === 2) ? data.thread_subject : data.name)
                .setBody(body)
                .setData({
                    ...data
                });
            if(Platform.OS === 'android'){
                display.android.setChannelId(notification.data.channelId)
                    .android.setAutoCancel(true)
                    // .android.setLargeIcon(avatar)// create this icon in Android Studio
                    // .android.setBigPicture(`${config.api.uri}${data.avatar}` )
                    .android.setTag(data.name)
                    .android.setGroup(data.thread_id)
                    .android.setGroupAlertBehaviour(
                    firebase.notifications.Android.GroupAlert.Children
                );
            }
            if(Platform.OS === 'ios'){
                display
                    .ios.setThreadIdentifier(data.thread_id)
                    .ios.setAlertAction("input")
                    .ios.setHasAction(true)
            }

                // .ios.setThreadIdentifier(data.thread_id)
                // .android.setBigText((data.message_type === 0 && data.thread_type === 2) ? `${data.name}: ${body}` : body)
                // .android.setPriority(firebase.notifications.Android.Priority.High)
                // .android.setSmallIcon('ic_stat_flipsetter_iconpng_transparent')
                // .android.setColor('#24422e') // you can set a color here
                // .android.setPriority(firebase.notifications.Android.Priority.High)

            // console.log("groupDisplay", groupDisplay);
            // console.log("display", display);
            if(Platform.OS === 'android'){
                try{
                    firebase.notifications().displayNotification(groupDisplay)
                        .catch((err) => {
                            console.log("send notif err", err);
                            return Promise.resolve()
                        });
                } catch (e) {
                    console.log("group_error", e);
                }
            }
            try{
                firebase.notifications().displayNotification(display)
                    .catch((err) => {
                        console.log("send notif err", err);
                        return Promise.resolve()
                    });
            } catch (e) {
                console.log("group_error", e);
            }

            let newMessage = {};
            switch(data.message_type){
                case 0:
                    newMessage =
                        {
                            _id:  data.message_id,
                            text: emojify(entities.decode(data.body), {output: 'unicode'}),
                            createdAt: data.created_at,
                            user: {
                                _id: data.owner_id,
                                name: data.name,
                                avatar:  `https://tippinweb.com/api/v0` + data.avatar ,
                            }
                        };
                    break;
                case 1:
                    newMessage =
                        {
                            _id: data.message_id,
                            image: "https://tippinweb.com/api/v0/images/messenger/"+data.message_id,
                            createdAt: data.created_at,
                            user: {
                                _id: data.owner_id,
                                name: data.owner_name,
                                avatar: `https://tippinweb.com/api/v0${data.avatar}`,
                            }
                        };
                    break;
                case 89:
                    newMessage =
                        {
                            _id:data.message_id,
                            text: `${data.name} ${data.body}`,
                            createdAt: data.created_at,
                            system: true,
                        }
                    break;
                case 90:
                    newMessage =
                        {
                            _id:data.message_id,
                            text: `${data.name} ${data.body}`,
                            createdAt: data.created_at,
                            system: true,
                        }
                    break;
            }

            this.props.addMessage(data.thread_id, newMessage);
        }
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
        }
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

        if(this.props.threads.activeThread !== data.thread_id){
            thread.unread = true
        }
        else{ thread.unread = false; }

        // console.log("Thread", thread);

        this.props.storeThreads({[data.thread_id]: {
                ...thread
            }, ...threads});
    }

    render(){
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
    }
};

const mapDispatchToProps = {
    setFCMToken: App.setFCMToken,
    setVOIPToken: App.setVOIPToken,
    setDeviceID: App.setDeviceID,
    setLastNotification: App.setLastNotification,
    joinDevice: App.joinDevice,
    registerDevice: App.registerDevice,
    storeThreads: Threads.storeThreads,
    setActiveThread: Threads.setActiveThread,
    addMessage: Messages.addMessage,
    setCallType: Call.setCallType,
    setCallRoom: Call.setCallRoom,
    setCallRoomPin: Call.setCallRoomPin,
    setCallerName: Call.setCallerName,
    setCallThreadId: Call.setCallThreadId,
}

export default connect(mapStateToProps, mapDispatchToProps)(FirebaseService)

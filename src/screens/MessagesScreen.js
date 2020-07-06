import React, { Component } from 'react';
import {
    KeyboardAvoidingView,
    Alert,
    StyleSheet,
    Platform,
    Image,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StatusBar,
    Keyboard,
} from 'react-native';
import Images from '../config/Images';
// import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { Container, Header, Icon, Content, View, List, ListItem, Left, Body, Right, Thumbnail, Text, Title, Button } from 'native-base';
import { withNavigationFocus, TabRouter } from 'react-navigation';
import DeviceInfo, { hasNotch } from 'react-native-device-info';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { GiftedChat, InputToolbar, Send } from 'react-native-gifted-chat';
import Lightbox from 'react-native-lightbox';
import { emojify } from 'react-emojione';
import { withSocketContext } from "../components/Socket";
import { App, Auth, User, Threads, Messages, Call } from "../reducers/actions";
import { connect } from "react-redux";
import FastImage from "react-native-fast-image";
import Avatar from "react-native-gifted-chat/lib/Avatar";
import Bubble from "react-native-gifted-chat/lib/Bubble";
import Message from "react-native-gifted-chat/lib/Message";
import MessageText from "react-native-gifted-chat/lib/MessageText";
import { AllHtmlEntities as entities } from 'html-entities';
import { DotsLoader } from "react-native-indicator";
import { isSameUser, isSameDay } from "react-native-gifted-chat/lib/utils";
import config from "../config";
import DocumentPicker from 'react-native-document-picker';
import Colors from '../config/Colors';
import CustomPickerView from '../components/PickerView';
import EmojiSelector, { Categories } from "react-native-emoji-selector";


class MessagesScreen extends Component<Props>{

    messages = [];
    activeThread = this.props.navigation.getParam('thread');

    state = {
        isLoading: true,
        threadAvatar: null,
        messages: (this.props.messages.messages.hasOwnProperty(this.props.navigation.getParam('thread'))) ? [...this.props.messages.messages[this.props.navigation.getParam('thread')]] : null,
        renderMessages: false,
        participants: {},
        bobbles: {},
        typers: {},
        startedTyping: null,
        activeCall: null,
        typedMsg: '',
        openPicker: false,
        showEmoji:false
    };

    constructor(props) {
        super(props);
        this.echo = this.props.socket;
        this.typeInterval = 0;
    }

    async componentDidMount() {
        // const fetchUser = await this.props.getUser();
        // this.user = await fetchUser.payload.data;

        this.props.setActiveThread(this.activeThread);
        //Let's update the thread
        this.update = await this.props.getMessages(this.activeThread);

        //Move this into redux!!

        if (this.update.type === "GET_MESSAGES_SUCCESS") {
            // this.thread = this.echo.socket.join(`thread_${this.props.navigation.getParam('thread')}`)
            if (typeof this.echo.socket.connector.channels[`presence-thread_${this.props.navigation.getParam('thread')}`] !== "undefined") {
                this.echo.socket.connector.channels[`presence-thread_${this.props.navigation.getParam('thread')}`].subscribe();
                this.thread = this.echo.socket.connector.channels[`presence-thread_${this.props.navigation.getParam('thread')}`];
            }
            else {
                this.thread = this.echo.socket.join(`thread_${this.props.navigation.getParam('thread')}`)
            }
            this.bobbleHeads(this.update.payload.data.bobble_heads);
            this.thread.whisper('online', {
                owner_id: this.props.user.id,
                online: 1,
                name: `${this.props.user.first} ${this.props.user.last}`,
            });
        }

        this.typeInterval = setInterval(this._updateTypers, 2000);

        //Is there an active call for this thread?
        let activeCall = null;
        if (this.props.app.heartbeat !== null) activeCall = this.props.app.heartbeat.data.states.active_calls.filter(call => call.thread_id === this.activeThread)[0];
        if (activeCall) {
            this.setState({
                activeCall: activeCall,
            })
        }
        //Are Messages loaded && are bobbles updated?
        if (this.state.messages && this.update) {

            this.setState({
                isLoading: false,
            })
        }
        // AppState.addEventListener('change', this._handleAppStateChange);

    }

    async componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
        //check if messages updated and if most recent message matches the sender's recent message
        // console.log("MESSAGES", this.state.messages)
        //Check if we need to refresh for a new thread (e.g. navigating to messages while already on it)
        // if(this.props.navigation.getParam('callEnded') === true){
        //     this.props.appHeartbeat();
        // }
        if (prevProps.navigation.getParam('thread') !== this.props.navigation.getParam('thread')) {
            this.props.navigation.navigate("Threads", {
                newMessage: this.props.navigation.getParam("thread")
            })
        }
        else {
            //Was the app in the background?  Let's do some housekeeping and update the thread messages
            if (prevProps.app.appState.match(/inactive|background/) && this.props.app.appState === 'active') {
                let update = await this.props.getMessages(this.activeThread);
                if (update && this.activeThread === this.props.navigation.getParam('thread')) {
                    this.bobbleHeads(update.payload.data.bobble_heads);
                    this.setState({
                        messages: this.props.messages.messages[this.activeThread],
                        isLoading: false,
                        renderMessages: true,
                    });
                }
            }
        }

        //Check if Messages have been retreived from redux and placed in store and if so finish rendering
        if (this.state.messages && this.state.isLoading && this.update) {
            this.setState({
                isLoading: false,
            })
        }
        //Check if messages aren't set and make sure they are retrieved from redux
        if (this.props.messages.messages.hasOwnProperty(this.props.navigation.getParam('thread')) && !this.state.messages) {
            this.setState({
                messages: [...this.props.messages.messages[this.props.navigation.getParam('thread')]],
            })
        }

        //Make Sure socket is connected and if disconnects re-subscribe to restore connecction
        if (this.props.socket.status !== prevProps.socket.status && this.props.socket.status === "connected") {


            if (typeof this.echo.socket.connector.channels[`presence-thread_${this.props.navigation.getParam('thread')}`] !== "undefined") {
                this.echo.socket.connector.channels[`presence-thread_${this.props.navigation.getParam('thread')}`].subscribe();
                this.thread = this.echo.socket.connector.channels[`presence-thread_${this.props.navigation.getParam('thread')}`];
            }
            else {
                this.thread = this.echo.socket.join(`thread_${this.props.navigation.getParam('thread')}`)
            }
        }

        //Check for active calls from heartbeat
        if (typeof this.props.app.heartbeat !== undefined && this.props.app.heartbeat !== null) {
            if (this.props.app.heartbeat.data.states.active_calls.length !== prevProps.app.heartbeat.data.states.active_calls.length) {

                let activeCall = this.props.app.heartbeat.data.states.active_calls.filter(call => call.thread_id === this.activeThread)[0];
                // console.log("Current_call", activeCall);
                if (activeCall) {
                    this.setState({ activeCall: activeCall, renderMessage: true, })
                }
                else {
                    this.setState({
                        activeCall: false,
                        renderMessage: true,
                    })
                }
            }
        }

        if (typeof prevProps.messages.messages[this.activeThread] !== "undefined") {
            if (this.props.messages.messages[this.activeThread].length !== prevProps.messages.messages[this.activeThread].length) {
                this.setState({
                    messages: (this.props.messages.messages.hasOwnProperty(this.props.navigation.getParam('thread'))) ? [...this.props.messages.messages[this.props.navigation.getParam('thread')]] : null,
                    renderMessages: true,
                })
            }
        }
        if (this.props.call.status !== prevProps.call.stats && this.props.call.status === "ended") {
            this.props.appHeartbeat();
            this.props.setCallStatus(null);
        }
    }

    //     name: Rogelio Leffler
    // email: kamron63@example.com
    // pass: Flipsetter1!


    componentWillUnmount() {
        clearInterval(this.typeInterval);

        if (this.thread) {
            this.thread.unsubscribe();
        }
        // this.echo.socket.leave(`thread_${this.props.navigation.getParam('thread')}`);

    }

    _listeners = () => {
        // this.private = this.echo.private(`user_notify_${this.user.user_id}`);

        this.thread.here(users => {
            console.log("here", users);
        })
            .joining(user => {
                console.log("joining", user);
            })
            .leaving(user => {
                console.log("leaving", user);
            })
            .listenForWhisper('typing', data => {
                console.log("typing");
                if (data.typing && data.owner_id !== this.props.user.id) {

                    this.setState(state => ({
                        participants: {
                            ...state.participants,
                            [data.owner_id]: {
                                ...state.participants[data.owner_id],
                                typing: true,
                            },
                        },
                        typers: {
                            ...state.typers,
                            [data.owner_id]: Date.now(),
                        }
                    }));


                }
                else {
                    if (!data.typing) {

                        this.setState(state => ({
                            participants: {
                                ...this.state.participants,
                                [data.owner_id]: {
                                    ...this.state.participants[data.owner_id],
                                    typing: false,
                                },
                            }
                        }))
                    }
                }

            })
            .listenForWhisper('online', data => {

                this.setState(previousState => ({
                    participants: { ...previousState.participants, [data.owner_id]: { ...previousState.participants[data.owner_id], online: data.online } },
                    renderMessages: true,
                }))
            })
            .listenForWhisper('read', data => {
                console.log("read_whisper", data);
                //get current message user is in
                // let currentMessage = this.state.bobbles[this.state.bobbles.participants[data.owner_id].message_id]
                this.setState(prevState => ({
                    // bobbles: {
                    //     ...(prevState.bobbles.hasOwnProperty(prevState.participants[data.owner_id].message_id)) ?? delete prevState.bobbles[prevState.participants[data.owner_id].message_id][data.owner_id],
                    //     // ...delete prevState.bobbles[this.state.participants[data.owner_id].message_id][data.owner_id],
                    //     [data.message_id]: {
                    //         ...prevState.bobbles[data.message_id], [data.owner_id]: (prevState.participants[data.owner_id].avatar) ? prevState.participants[data.owner_id].avatar : null,
                    //     }
                    // },
                    participants: {
                        ...prevState.participants,
                        [data.owner_id]: {
                            ...prevState.participants[data.owner_id],
                            message_id: data.message_id,
                        }
                    },
                    // renderMessages: true,
                }));
            })
        // .listenForWhisper('send_message_setting', data => { 
    }

    async onSend(message = []) {
    //    alert(JSON.stringify(message))

this.setState({openPicker:false,showEmoji:false})
        let messages = [...this.props.messages.messages[this.props.navigation.getParam('thread')]];

        // this.setState(prevState => ({
        //     messages: GiftedChat.append(prevState.messages, incoming),
        //     renderMessages: true,
        //     startedTyping: null,
        // }));
        // console.log(this.state.messages);
        //Set the message fast, we can update later
        let incoming =
        {
            _id: await message._id,
            createdAt: message.createdAt,
            text: emojify(entities.decode(message.text), { output: 'unicode' }),
            user: {
                ...message.user,
                // name: response.payload.data.message.name,
            },
            temp_id: await message._id
        };
        //add messages to store
        await this.props.addMessage(this.activeThread, incoming);
        let response = await this.props.sendMessage(this.props.navigation.getParam('thread'), message);
        let updated = {
            ...incoming,
            _id: await response.payload.data.message.message_id,
            user: {
                ...incoming.user,
                name: await response.payload.data.message.name,
            },
        }

        this.props.updateMessage(this.activeThread, updated);
        //update threads screen store in the background
        let threads = { ...this.props.threads.threads };
        let current = { ...threads[this.activeThread] };
        current.recent_message = {
            body: message.text,
            message_type: 0,
            name: response.payload.data.message.name,
        };

        delete threads[this.activeThread];
        let store = { [this.activeThread]: current, ...threads };
        this.props.storeThreads(store);

        //Update messages with proper id's and such
        this.setState({
            messages: [...this.props.messages.messages[this.activeThread]],
        });
        // });

    }

    _updateTypers = () => {

        if (Object.entries(this.state.typers).length > 0) {
            let refresh = false;
            let typers = this.state.typers;
            let participants = this.state.participants;
            Object.entries(this.state.typers).map((typer, index, arr) => {

                if ((typer[1] + 2000) <= Date.now()) {
                    // if(typers.length === 1){refresh = true} // removing last typer
                    delete typers[typer[0]];
                    participants[typer[0]].typing = false;
                    refresh = true;
                }
            });
            this.setState(state => ({
                typers: {
                    ...typers,
                },
                participants: {
                    ...state.participants,
                    ...participants,
                },
                refreshMessages: (refresh),
            }))
        }
    }

    bobbleHeads = (data) => {
        let list = {};
        let bobbles = {};

        data.map((participant, index, arr) => {
            list[participant.owner_id] = participant;
            bobbles[participant.message_id] = {
                ...bobbles[participant.message_id],
                [participant.owner_id]: participant.avatar,
            };
        });
        this.setState({
            participants: list,
            bobbles: bobbles,
            renderMessages: true,
        }, this._listeners());

    }

    inputTextChanged = (text) => {
        // alert(MessageText.text)
        // alert(text)
//  let emj = emojify(entities.decode(text), { output: 'unicode' })
//         alert(JSON.stringify(emj))
        this.setState({showEmoji:false})
        let now = Date.now();
        if (this.state.startedTyping === null || this.state.startedTyping + 1500 <= now) {
            this.setState({
                startedTyping: now,
                typedMsg: text
            });
            (this.thread) && this.thread.whisper('typing', {
                owner_id: this.props.user.id,
                name: `${this.props.user.first} ${this.props.user.last}`,
                typing: true,
            });
        }
    }

    joinCall = (call) => {
        // console.log("Call", call);
        this.props.setCallId(call.call_id);
        this.props.setCallType(call.call_type);
        this.props.setCallRoom(call.room_id);
        this.props.setCallRoomPin(call.room_pin);
        this.props.setCallerName(call.name);
        this.props.setCallThreadId(call.thread_id);
        this.props.setCallStatus("joining");

    }

    startCall = async (type) => {
        let response;
        (type === 1) ? response = await this.props.startVideoCall(this.activeThread) : response = await this.props.startWhiteboard(this.activeThread);

        // console.log("StartCall", response);

        if (response.type === "START_VIDEO_CALL_SUCCESS" || response.type === "START_WHITEBOARD_SUCCESS") {
            // this.props.setCallId(response.data.call_id);
            // this.props.setCallType(response.data.call_type);
            // this.props.setCallRoom(response.data.room_id);
            // this.props.setCallRoomPin(response.data.room_pin);
            this.props.setCallerName(this.props.user.name);
            // this.props.setCallThreadId(response.data.thread_id);
            this.props.setCallStatus("initiated");
            this.props.appHeartbeat();
        }
    }
    openCamera = () => {
        this.setState({ openPicker: false })
        ImagePicker.openCamera({
            cropping: true,
            width: 500,
            height: 500,
            multiple:true,
            cropperCircleOverlay: true,
            compressImageMaxWidth: 640,
            compressImageMaxHeight: 480,
            freeStyleCropEnabled: true,
            includeBase64: true
        }).then(image => {
            alert(image)
        })
            .catch(e => {
// alert(e)
            });

    }

    openGallery = () => {
        this.setState({ openPicker: false })
        ImagePicker.openPicker({
            cropping: true,
            width: 300,
            height: 400,
            multiple:true,
            cropperCircleOverlay: true,
            freeStyleCropEnabled: true,
            avoidEmptySpaceAroundImage: true,
            includeBase64: true
        }).then(image => {
alert(JSON.stringify(image))    })
            .catch(e => 
                {
                // alert(e)

                }
                );
    }

    async pickDocument() {
        this.setState({ openPicker: false })
        try {
            const results = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.audio, DocumentPicker.types.zip, DocumentPicker.types.plainText, DocumentPicker.types.pdf],
                //There can me more options as well find above
            });
            for (const res of results) {
                alert(JSON.stringify(res))
            }
        } catch (err) {
            //Handling any exception (If any)
            if (DocumentPicker.isCancel(err)) {
                //If user canceled the document selection
                // alert('Canceled from multiple doc picker');
            } else {
                //For Unknown Error
                // alert('Unknown Error: ' + JSON.stringify(err));
                throw err;
            }
        }
    }
    openEmoji=()=>{
        Keyboard.dismiss();
        this.setState({showEmoji:true,openPicker:false})
    }
    

    customSystemMessage = (props) => {
        return (
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>

                
                <TouchableOpacity style={{
                    alignSelf: 'center', justifyContent: 'center', margin: 3,
                }} onPress={() => this.openEmoji()}>
                    <Image resizeMode='contain' source={Images.emojiIcon
                    } style={{ alignSelf: 'center' }} />
                </TouchableOpacity>
                <TouchableOpacity style={{
                    margin: 3,
                    alignSelf: 'center', justifyContent: 'center',
                }} onPress={() => this.setState({ openPicker: true,showEmoji:false })}>
                    <Image resizeMode='contain' source={Images.attachmentIcon} style={{ alignSelf: 'center' }} />
                </TouchableOpacity>
                <Send {...props} containerStyle={{
                    alignSelf: 'center', justifyContent: 'center',
                    marginRight: 10, margin: 3,
                }} >
                    <Image resizeMode='contain' source={Images.sendIcon} style={{ alignSelf: 'center' }} />
                    {/* <Text >Send</Text> */}
                </Send>
            </View>
        );
    };


    render() {
        // if(!this.state.isLoading) {
        return (
            <Container>
                <Header>
                    <Left style={{ marginRight: 40, }}>
                        <Button
                            title=''
                            transparent
                            onPress={() => this.props.navigation.goBack()}
                        >
                            <FontAwesome5 name={"chevron-left"} size={24} color={"#FFF"} />
                        </Button>
                    </Left>
                    <Body style={{

                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <FastImage
                            source={{
                                uri: `https://${config.api.uri}${this.props.threads.threads[this.activeThread].avatar}`,
                                headers: { Authorization: `Bearer ${this.props.auth.accessToken}` },
                                priority: FastImage.priority.high
                            }}
                            style={{ width: 30, height: 30, borderRadius: 15 }}
                        />
                        <Text style={{ fontWeight: 'bold', width: 200, paddingLeft: 15, color: "#FFF" }}>
                            {this.props.threads.threads[this.props.navigation.getParam('thread')].name}
                        </Text>
                    </Body>
                    <Right>
                        {
                            (this.props.threads.threads[this.activeThread].options.admin || (!this.props.threads.threads[this.activeThread].options.admin && this.props.threads.threads[this.activeThread].options.admin_call) || this.props.threads.threads[this.activeThread].thread_type === 1) &&
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                                <View style={{ marginLeft: 15, }}><FontAwesome5 name={"video"} size={24} color={"#FFF"} onPress={() => this.startCall(1)} /></View>
                                <View style={{ marginLeft: 30, marginRight: 15 }}><FontAwesome5 name={"chalkboard-teacher"} size={24} color={"#FFF"} onPress={() => this.startCall(2)} /></View>
                            </View>
                        }
                    </Right>
                </Header>
                <View style={{ flex: 1 }}>
                    {(this.state.activeCall) &&
                        <View style={{ flexDirection: "row", height: 30, width: config.layout.window.width, backgroundColor: "#269c26", alignItems: "center", justifyContent: "space-between" }}>
                            <Text size={15} style={{ marginLeft: 5, color: "#FFFFFF", }}>There is an active {(this.state.activeCall.call_type === 1) ? "video call" : "whiteboard session"}</Text>
                            <TouchableOpacity style={{ marginRight: 25 }} onPress={() => this.joinCall(this.state.activeCall)}>
                                <Text style={{ color: "#FFFFFF", }}>JOIN</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    <GiftedChat
                    isInitialized={true}
                        renderSend={(props) => this.customSystemMessage(props)}
messages={this.state.messages}
                        extraData={this.state.participants}
                        alwaysShowSend={true}
                        onSend={messages => this.onSend(messages[0])}
                        focusTextInput={()=>this.setState({showEmoji:false})}
                        user={{
                            _id: this.props.user.id,
                            avatar: `https://${config.api.uri}` + this.props.user.avatar,
                        }}
                        // showUserAvatar
                        renderLoading={() => <ActivityIndicator color="#0000ff" />}
                        maxInputLength={350}
                        onInputTextChanged={(text) => this.inputTextChanged(text)}
                        renderTime={() => { return null }}
                        shouldUpdateMessage={(props, nextProps) => {
                            if (this.state.renderMessages) {
                                this.setState({
                                    renderMessages: false,
                                });
                                return true;
                            }
                        }}
                        // showAvatarForEveryMessage={true}
                        renderMessage={this.renderMessage}
                        // onPressActionButton={()=>alert('hh')}
                        // renderMessageText={(txt)=>alert(txt)}
                        renderAvatar={this.renderAvatar}
                        // onPressAvatar={()=>alert('hh')}
                        renderBubble={this.renderBubble}
                        renderMessageImage={this.renderImage}
                        renderFooter={this.renderFooter}
                    // bottomOffset={(DeviceInfo.hasNotch() && Platform.OS === 'ios') ? 0:}
                    />
                    {/*<KeyboardAvoidingView behavior={"padding"} keyboardVerticalOffset={48} enabled={(Platform.OS === 'android')}/>*/}
                </View>

                {this.state.openPicker ?

                    <CustomPickerView openGallery={() => this.openGallery()} openCamera={() => this.openCamera()} pickDocument={() => this.pickDocument()} cancel={() => this.setState({ openPicker: false })} />
                    : null}
                {this.state.showEmoji ?

                    <EmojiSelector
                    // autoSize={true}
                    // sizes={5}
                        onEmojiSelected={emoji => this.inputTextChanged(emoji)}
                        showSearchBar={true}
                        showTabs={true}
                        aria-setsize={5}
                        showHistory={true}
                        showSectionTitles={true}
                        category={Categories.all}
                    />
                    : null}
            </Container>
        )
        // }
        // else{
        //     return(
        //         <Container>
        //             <Header>
        //                 <Left><Button
        //                     title=''
        //                     transparent
        //                     onPress={() => {this.props.navigation.goBack()}}
        //                 >
        //                     <FontAwesome5 name={"chevron-left"} size={24}/>
        //                 </Button></Left>
        //                 <Body><Title>Messages</Title></Body>
        //                 <Right></Right>
        //             </Header>
        //             <Content>
        //                 <ActivityIndicator color="#0000ff" />
        //             </Content>
        //         </Container>
        //     )
        // }
    }

    renderAvatar = (props) => {

        return (<FastImage
            key={`avatar_${props.currentMessage._id}`}
            source={{
                uri: `${props.currentMessage.user.avatar}`,
                // uri: (this.props.threads.threads[this.props.navigation.getParam('thread')].thread_type === 1) ? `https://tippinweb.com/${this.props.threads.threads[this.props.navigation.getParam('thread')].avatar}` : `https://tippinweb.com/api/v1${this.props.threads.threads[this.props.navigation.getParam('thread')].avatar}`,
                headers: { Authorization: `Bearer ${this.props.auth.accessToken}` },
                priority: FastImage.priority.high
            }}
            style={{
                height: 34,
                width: 34,
                // marginRight:-8,
                borderRadius: 17,
                // opacity: ({...this.state.participants[props.currentMessage.user._id]}.online === 1) ? 1:.5,
                // marginTop:-6, //fix for avatar being 36x36
            }}
        />
        )
    }

    renderMessage = (props) => {
        // alert(props)
        return (
            <Message
                {...props}
                containerStyle={{
                    left: {
                        marginBottom: 0,
                    }
                }}
            />
        )
    }

    renderBubble = (props) => {
        if (isSameUser(props.currentMessage, props.previousMessage) && isSameDay(props.currentMessage, props.previousMessage)) {
            return (
                <View>
                    <Bubble
                        {...props}
                        wrapperStyle={{
                            right: {
                                backgroundColor: "#269c26"
                            },
                            left: {
                            },
                        }}
                        containerStyle={{
                            left: {
                                marginBottom: 5,
                            },
                        }}
                    />
                    <View style={{ flexDirection: (props.position === "left") ? 'row' : 'row-reverse', alignItems: 'center' }}>
                        {(props.currentMessage._id !== this.state.messages[0]._id) &&
                            Object.entries(this.state.participants).map((participant, index, arr) => {
                                if (index <= 5 && (props.currentMessage._id === participant.message_id)) {

                                    return <FastImage
                                        key={`${participant[0]}_bobble_${props.currentMessage._id}`}
                                        source={{
                                            uri: `https://${config.api.uri}${participant[1].avatar}`,
                                            // uri: (this.props.threads.threads[this.props.navigation.getParam('thread')].thread_type === 1) ? `https://tippinweb.com/${this.props.threads.threads[this.props.navigation.getParam('thread')].avatar}` : `https://tippinweb.com/api/v1${this.props.threads.threads[this.props.navigation.getParam('thread')].avatar}`,
                                            headers: { Authorization: `Bearer ${this.props.auth.accessToken}` },
                                            // priority: FastImage.priority.high
                                        }}
                                        style={{
                                            height: 14,
                                            width: 14,
                                            // marginRight:-8,
                                            borderRadius: 7,
                                            opacity: (participant[1].online === 1) ? 1 : .5,
                                            // marginTop:-6, //fix for avatar being 36x36
                                        }}
                                    />
                                }
                                else if (index === 6 && participant[0] !== props.currentMessage.user._id && (props.currentMessage._id === participant.message_id)) {
                                    let overflow = arr.length - 6;
                                    return <Text key={`overflow_${props.currentMessage._id}`} style={{ backgroundColor: "#d3d3d3", color: "#FFF", marginLeft: (props.position === "left") ? 4 : 0, marginRight: (props.position === "left") ? 0 : 4 }}>+{overflow}</Text>
                                }
                            })
                        }
                    </View>
                </View>
            );
        }
        return (
            <View style={{ marginTop: 10, }}>
                {(props.currentMessage.user._id !== this.props.user.id) && <Text style={styles.name}>{props.currentMessage.user.name}</Text>}
                <Bubble
                    {...props}
                    wrapperStyle={{
                        right: {
                            backgroundColor: "#269c26",
                        },
                        left: {
                            // margin:2,
                        }

                    }}
                    containerStyle={{
                        right: {
                        },
                        left: {
                            marginBottom: 5,
                        },
                    }}
                />
                <View style={{ flexDirection: (props.position === "left") ? 'row' : 'row-reverse', alignItems: 'center' }}>
                    {(props.currentMessage._id !== this.state.messages[0]._id) &&
                        Object.entries(this.state.participants).map((participant, index, arr) => {
                            if (index <= 5 && participant[0] !== props.currentMessage.user._id && (props.currentMessage._id === participant.message_id)) {

                                return <FastImage
                                    key={`${participant[0]}_bobble`}
                                    source={{
                                        uri: `https://${config.api.uri}${participant[1].avatar}`,
                                        headers: { Authorization: `Bearer ${this.props.auth.accessToken}` },
                                        // priority: FastImage.priority.high
                                    }}
                                    style={{
                                        height: 14,
                                        width: 14,
                                        // marginRight:-8,
                                        borderRadius: 7,
                                        // borderWidth:1,
                                        opacity: (participant[1].online === 1) ? 1 : .5,
                                        // marginTop:-6, //fix for avatar being 36x36
                                    }}
                                />
                            }
                            else if (index === 6 && participant[0] !== props.currentMessage.user._id && (props.currentMessage._id === participant.message_id)) {
                                let overflow = arr.length - 6;
                                return <Text key={`overflow_${props.currentMessage._id}`} style={{ backgroundColor: "#b5a8a8", color: "#FFF", marginLeft: 4, }}>+{overflow}</Text>
                            }
                        })
                    }
                </View>
            </View>

        )
    }

    renderImage = (props) => {

        return (
            <View style={[styles.container]}>
                <Lightbox
                    activeProps={{
                        style: styles.imageActive,
                    }}
                >
                    <FastImage
                        style={[styles.image]}
                        source={{
                            uri: `https://${props.currentMessage.image}`,
                            headers: {
                                Authorization: `Bearer ${this.props.auth.accessToken}`,
                            },
                            priority: FastImage.priority.high
                        }}
                        resizeMode={'contain'}
                    />
                </Lightbox>
            </View>

        )
    }

    renderFooter = (props) => {
// this.setState({showEmoji:false})       
 // if(props.currentMessage){
        let typers = Object.values(this.state.participants).filter((participant, index, arr) => {
            if (participant.typing) {
                return true;
            }
        });
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', height: 25, width: config.layout.window.width }}>
                <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
                    {
                        (this.state.messages && this.state.messages.length > 0) &&
                        (Object.entries(this.state.participants).map((participant, index, arr) => {
                            let self = false;
                            Object.entries(this.state.messages).map(message => {
                                if (message[1]._id === participant[1].message_id) self = true;
                            })
                            if ((index <= 5 && !participant[1].typing && this.state.messages[0]._id === participant[1].message_id) || self) {

                                return <FastImage
                                    key={`${participant[0]}_bobble`}
                                    source={{
                                        uri: `https://${config.api.uri}${participant[1].avatar}`,
                                        // uri: (this.props.threads.threads[this.props.navigation.getParam('thread')].thread_type === 1) ? `https://tippinweb.com/${this.props.threads.threads[this.props.navigation.getParam('thread')].avatar}` : `https://tippinweb.com/api/v1${this.props.threads.threads[this.props.navigation.getParam('thread')].avatar}`,
                                        headers: { Authorization: `Bearer ${this.props.auth.accessToken}` },
                                        // priority: FastImage.priority.high
                                    }}
                                    style={{
                                        height: 14,
                                        width: 14,
                                        // marginRight:-8,
                                        borderRadius: 7,
                                        // borderWidth:1,
                                        opacity: (participant[1].online === 1) ? 1 : .5,
                                        // marginTop:-6, //fix for avatar being 36x36
                                    }}
                                />
                            }
                            else if (index === 6 && !this.state.typers.hasOwnProperty(participant[0]) && props.currentMessage) {
                                let overflow = arr.length - 6;
                                return <Text key={(props.currentMessage) ? `overflow_${props.currentMessage._id}` : ''} style={{ backgroundColor: "#b5a8a8", color: "#FFF", marginLeft: 4, }}>+{overflow}</Text>
                            }
                        }))
                    }
                </View>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    {(Object.values(this.state.typers).length > 0) &&
                        typers.map((typer, index, arr) => {
                            if (index <= 5) {

                                return <FastImage
                                    style={{ height: 14, width: 14, borderRadius: 7 }}
                                    key={`${typer.id}_typer_${index}`}
                                    source={{
                                        uri: `https://${config.api.uri}${typer.avatar}`,
                                        headers: {
                                            Authorization: `Bearer ${this.props.auth.accessToken}`,
                                        },
                                        priority: FastImage.priority.high
                                    }}
                                />
                            }
                        })
                    }
                    {
                        (Object.values(this.state.typers).length > 0) &&
                        <View style={{ marginLeft: 5, }}>
                            <DotsLoader
                                size={5}
                                color={"#000"}
                                betweenSpace={2.5}
                            />
                        </View>
                    }
                </View>
            </View>
        );
        // }
        // return (
        //     <View style={{flexDirection: 'row', alignItems: 'center', height: 25, width: config.layout.window.width}}>
        //     </View>
        // );
    }
}

const styles = StyleSheet.create({
    container: {},
    name: {
        fontSize: 12,
        color: "#878787",

    },
    image: {
        width: 150,
        height: 100,
        borderRadius: 13,
        margin: 3,
        resizeMode: 'cover',
    },
    imageActive: {
        flex: 1,
        resizeMode: 'contain',
    },
})


const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        app: state.app,
        threads: state.threads,
        user: state.user,
        messages: state.messages,
        call: state.call,
    }
}

const mapDispatchToProps = {
    setErrorMsg: App.setErrorMsg,
    setIsLoading: App.setIsLoading,
    setAccessToken: Auth.setAccessToken,
    setIsLoggedIn: Auth.setIsLoggedIn,
    getUser: User.getUser,
    getMessages: Messages.getMessages,
    sendMessage: Messages.sendMessage,
    markRead: Messages.markRead,
    addMessage: Messages.addMessage,
    updateMessage: Messages.updateMessage,
    addMessages: Messages.addMessages,
    setActiveThread: Threads.setActiveThread,
    storeThreads: Threads.storeThreads,
    startVideoCall: Call.startVideoCall,
    startWhiteboard: Call.startWhiteboard,
    setCallId: Call.setCallId,
    setCallType: Call.setCallType,
    setCallRoom: Call.setCallRoom,
    setCallRoomPin: Call.setCallRoomPin,
    setCallerName: Call.setCallerName,
    setCallThreadId: Call.setCallThreadId,
    setCallStatus: Call.setCallStatus,
    appHeartbeat: App.appHeartbeat,
};

export default connect(mapStateToProps, mapDispatchToProps)(withSocketContext(withNavigationFocus(MessagesScreen)));

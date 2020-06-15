import React, {Component} from 'react';
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
    Keyboard
} from 'react-native';
import { Container, Header, Icon, Content, View, List, ListItem, Left, Body, Right, Thumbnail, Text, Title, Button} from 'native-base';
import { withNavigationFocus} from 'react-navigation';
import DeviceInfo from 'react-native-device-info';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { GiftedChat } from 'react-native-gifted-chat';
import Lightbox from 'react-native-lightbox';
import {emojify} from 'react-emojione';
import { withSocketContext } from "../components/Socket";
import {App, Auth, User, Threads, Messages, Call} from "../reducers/actions";
import {connect} from "react-redux";
import FastImage from "react-native-fast-image";
import Avatar from "react-native-gifted-chat/lib/Avatar";
import Bubble from "react-native-gifted-chat/lib/Bubble";
import Message from "react-native-gifted-chat/lib/Message";
import MessageText from "react-native-gifted-chat/lib/MessageText";
import {AllHtmlEntities as entities} from 'html-entities';
import {DotsLoader} from "react-native-indicator";
import {isSameUser, isSameDay} from "react-native-gifted-chat/lib/utils";
import config from "../config";



class MessagesScreen extends Component<Props>{
    messages = [];
    activeThread = this.props.navigation.getParam('thread');

    state = {
        isLoading: true,
        threadAvatar: null,
        messages: null,
        renderMessages: false,
        participants: {},
        bobbles: {},
        typers:{},
        startedTyping: null,
    };

    constructor(props){
        super(props);
        this.echo = this.props.socket;
        this.typeInterval = 0;
        if(this.props.messages.messages.hasOwnProperty(this.props.navigation.getParam('thread'))){
            this.state.isLoading = false;
            this.state.messages = this.props.messages.messages[this.props.navigation.getParam('thread')];
        }
    }

    async componentDidMount(){
        // const fetchUser = await this.props.getUser();
        // this.user = await fetchUser.payload.data;
        if(this.state.messages){
            this.setState({
                isLoading:false,
            })
        }
        this.props.setActiveThread(this.activeThread);
        let update = await this.props.getMessages(this.activeThread);
        //Move this into redux!!
        
        if(update){
            this.thread = this.echo.socket.join(`thread_${this.props.navigation.getParam('thread')}`)
            this.bobbleHeads(update.payload.data.bobble_heads);
            this.thread.whisper('online', {
                owner_id: this.props.user.id,
                online: 1,
                name: `${this.props.user.first} ${this.props.user.last}`,
            });
        }
        this.typeInterval = setInterval(this._updateTypers, 2000);

        // AppState.addEventListener('change', this._handleAppStateChange);


    }

    async componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
        // console.log("echo", this.echo);
        if(prevProps.navigation.getParam('thread') !== this.props.navigation.getParam('thread')){
            this.props.navigation.navigate("Threads", {
                newMessage: this.props.navigation.getParam("thread")
            })
        }
        else{
            
            if(prevProps.app.appState.match(/inactive|background/) && this.props.app.appState === 'active'){
                let update = await this.props.getMessages(this.activeThread);
                if(update && this.activeThread === this.props.navigation.getParam('thread')){
                    this.bobbleHeads(update.payload.data.bobble_heads);
                    this.setState({
                        messages: this.props.messages.messages[this.activeThread],
                        isLoading: false,
                        renderMessages: true,
                    });
                }
            }
        }
        
    }

    componentWillUnmount() {
        clearInterval(this.typeInterval);
        if(this.echo.privateChannel){
            this.echo.privateChannel.stopListening('.message_received');
            // this.thread.stopListening();
        }
        if(this.thread){
            this.thread.unsubscribe();
        }
        // this.echo.socket.leave(`thread_${this.props.navigation.getParam('thread')}`);

    }

    _listeners = () => {
        // this.private = this.echo.private(`user_notify_${this.user.user_id}`);

        this.echo.privateChannel
            .listen('.new_message', (e) => {

            let check = Object.values(this.state.messages).filter(message => {

                if(message._id === e.temp_id || message.id === e.message_id || e.owner_id === this.props.user.id){
                    return message;
                }
            });

            if(check.length === 0){
                if(e.thread_id ===this.activeThread){
                    let newMessage = {};
                    switch(e.message_type){
                        case 0:
                            newMessage =
                                {
                                    _id: e.message_id,
                                    text: emojify(entities.decode(e.body), {output: 'unicode'}),
                                    createdAt: e.created_at,
                                    user: {
                                        _id: e.owner_id,
                                        name: e.owner_name,
                                        avatar: `https://tippinweb.com/api/v0${e.avatar}`,
                                    }
                                };
                            break;
                        case 1:
                            newMessage =
                                {
                                    _id: e.message_id,
                                    image: "https://tippinweb.com/api/v0/images/messenger/"+e.message_id+"/thumb",
                                    createdAt: e.created_at,
                                    user: {
                                        _id: e.owner_id,
                                        name: e.owner_name,
                                        avatar: `https://tippinweb.com/api/v0${e.avatar}`,
                                    }
                                };
                            break;
                        case 89:
                            newMessage =
                                {
                                    _id:e.message_id,
                                    text: `${e.name} ${e.body}`,
                                    createdAt: e.created_at,
                                    system: true,
                                }
                            break;
                        case 90:
                            newMessage =
                                {
                                    _id:e.message_id,
                                    text: `${e.name} ${e.body}`,
                                    createdAt: e.created_at,
                                    system: true,
                                }
                            break;

                    }
                    
                    let filter = this.props.messages.messages[this.props.navigation.getParam('thread')].filter( (message, i) => {
                        if(message._id === e.message_id){
                            return message;
                        }
                    });

                    if(filter.length === 0) {
                        this.props.addMessage(this.activeThread, newMessage);
                        this.props.markRead(this.activeThread);
                        //update threads screen store in the background
                        let threads = {...this.props.threads.threads};
                        let current = threads[this.activeThread];
                        
                        current.recent_message = {
                            body: newMessage.text,
                            message_type: e.message_type,
                            name: newMessage.user.name,
                        };
                        if(e.message_type === 1){
                            current.recent_message.body = `${newMessage.user.name} sent a photo`;
                        }
                        else if(e.message_type === 2){
                            current.recent_message.body = `${newMessage.user.name} sent a video`;
                        }
                        delete threads[this.activeThread];
                        this.props.storeThreads({
                            [this.activeThread]: current,
                            ...threads
                        });
                        let bobbles = {};
                        let participants = {};
                        if(newMessage.user){
                            bobbles = {
                                ...(this.state.bobbles.hasOwnProperty(this.state.participants[newMessage.user._id].message_id) && this.state.bobbles[this.state.participants[newMessage.user._id].message_id][newMessage.user._id]) ?? delete this.state.bobbles[this.state.participants[newMessage.user._id].message_id][newMessage.user._id],
                                [newMessage._id]: {
                                    ...this.state.bobbles[newMessage._id], [newMessage.user._id]: (this.state.participants[newMessage.user._id].avatar) ?? null,
                                }
                            }
                            participants = {
                                ...this.state.participants,
                                [newMessage.user._id]: {
                                    ...this.state.participants[newMessage.user._id],
                                    message_id: newMessage._id,
                                }
                            }
                        }

                        this.setState(prevState => ({
                            messages: GiftedChat.append(prevState.messages, newMessage),
                            bobbles: bobbles,
                            participants: participants,
                            renderMessages: true,
                        }));

                        this.thread.whisper('read', {
                            owner_id: this.props.user.id,
                            message_id: newMessage._id,
                        });
                    }
                }
            }

        })
            .listen('.thread_joined', event => { console.log('.thread_joined', event)})
            .listen('.message_purged',  event => { console.log('.message_purged', event)})
            .listen('.call_started', event => { console.log('.call_started', event)})
            .listen('.thread_kicked', event => { console.log('.thread_kicked', event)})
            .listen('.knock_knock',  event => { console.log('.knock_knock', event)});

        this.thread.here( users => {
                console.log("here", users);
            })
            .joining( user => {
                console.log("joining", user);
            })
            .leaving( user => {
                console.log("leaving", user);
            })
            .listenForWhisper('typing', data => {
                if(data.typing && data.owner_id !== this.props.user.id){
                    
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
                else{
                    if(!data.typing){
                        
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
                    participants: {...previousState.participants, [data.owner_id]: {...previousState.participants[data.owner_id], online: data.online}},
                    renderMessages: true,
                }))
            })
            .listenForWhisper('read', data => {
                console.log("read_whisper", data);
                //get current message user is in
                // let currentMessage = this.state.bobbles[this.state.bobbles.participants[data.owner_id].message_id]
                this.setState(prevState => ({
                    bobbles: {
                        ...(prevState.bobbles.hasOwnProperty(prevState.participants[data.owner_id].message_id)) ?? delete prevState.bobbles[prevState.participants[data.owner_id].message_id][data.owner_id],
                        // ...delete prevState.bobbles[this.state.participants[data.owner_id].message_id][data.owner_id],
                        [data.message_id]: {
                            ...prevState.bobbles[data.message_id], [data.owner_id]: (prevState.participants[data.owner_id].avatar) ? prevState.participants[data.owner_id].avatar : null,
                        }
                    },
                    participants: {
                        ...prevState.participants,
                        [data.owner_id]: {
                            ...prevState.participants[data.owner_id],
                            message_id: data.message_id,
                        }
                    },
                    renderMessages: true,
                }));
            })
            // .listenForWhisper('send_message_setting', data => { 
    }

    async onSend(message = []) {

        //grab the current stuff quickly
        let messages = [...this.props.messages.messages[this.props.navigation.getParam('thread')]];
        let incoming = {
            _id: await message._id,
            createdAt: message.createdAt,
            text: emojify(entities.decode(message.text), {output: 'unicode'}),
            user: message.user,
        };
        this.setState(prevState => ({
            messages: GiftedChat.append(prevState.messages, incoming),
            renderMessages: true,
            startedTyping: null,
        }), async() => {
            console.log(this.state.messages);
            //Set the message fast, we can update later

            let response = await this.props.sendMessage(this.props.navigation.getParam('thread'), message);
            let updated =
                {
                    _id: await response.payload.data.message.message_id,
                    createdAt: message.createdAt,
                    text: emojify(entities.decode(message.text), {output: 'unicode'}),
                    user: {
                        ...message.user,
                        name: response.payload.data.message.name,
                    },
                };
            //add messages to store
            await this.props.addMessage(this.props.navigation.getParam('thread'), updated);

            //update threads screen store in the background
            let threads = {...this.props.threads.threads};
            let current = {...threads[this.activeThread]};
            current.recent_message = {
                body: message.text,
                message_type: 0,
                name: response.payload.data.message.name,
            };

            delete threads[this.activeThread];
            let store = {[this.activeThread]: current, ...threads};
            this.props.storeThreads(store);

            //Update messages with proper id's and such
            this.setState({
                messages: [...this.props.messages.messages[this.activeThread]],
            });
        });

    }

    _updateTypers = () => {
        
        if(Object.entries(this.state.typers).length > 0){
            let refresh = false;
            let typers = this.state.typers;
            let participants = this.state.participants;
            Object.entries(this.state.typers).map((typer, index, arr) => {
                
                if((typer[1] + 2000) <= Date.now()){
                    // if(typers.length === 1){refresh = true} // removing last typer
                    delete typers[typer[0]];
                    participants[typer[0]].typing =  false;
                    refresh = true;
                }
            });
            this.setState(state => ({
                typers: {
                    ...typers,
                },
                participants:{
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

        data.map( (participant, index, arr) => {
            list[participant.owner_id] = participant;
            bobbles[participant.message_id] = {
                ...bobbles[participant.message_id],
                [participant.owner_id]: participant.avatar,
            };
        });
        this.setState({
            messages: this.props.messages.messages[this.activeThread],
            isLoading: false,
            participants: list,
            bobbles: bobbles,
            renderMessages: true,
        }, this._listeners());

    }

    inputTextChanged = (text) => {
        let now = Date.now();
        if(this.state.startedTyping === null || this.state.startedTyping + 1500 <= now){
            this.setState({
                startedTyping: now,
            });
            (this.thread) && this.thread.whisper('typing',{
                owner_id: this.props.user.id,
                name: `${this.props.user.first} ${this.props.user.last}`,
                typing: true,
            });
        }
    }

    render(){
        if(!this.state.isLoading) {
            return (
                <Container>
                <Header>
                    <Left style={{marginRight: 20,}}>
                        <Button
                            title=''
                            transparent
                            onPress={() => this.props.navigation.navigate("Threads")}
                         >
                            <FontAwesome5 name={"chevron-left"} size={24} color={"#FFF"}/>
                        </Button>
                    </Left>
                    <Body style={{

                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <FastImage
                            source={{
                                uri: `${config.api.uri}${this.props.threads.threads[this.activeThread].avatar}`,
                                headers: {Authorization: `Bearer ${this.props.auth.accessToken}`},
                                priority: FastImage.priority.high
                            }}
                            style={{width: 40, height: 40, borderRadius: 20}}
                        />
                        <Text style={{fontWeight: 'bold', width: 200, paddingLeft: 15, color: "#FFF"}}>
                            {this.props.threads.threads[this.props.navigation.getParam('thread')].name}
                        </Text>
                    </Body>
                    <Right>
                        {
                            (this.props.threads.threads[this.activeThread].options.admin || (!this.props.threads.threads[this.activeThread].options.admin && this.props.threads.threads[this.activeThread].options.admin_call) || this.props.threads.threads[this.activeThread].thread_type === 1) &&
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',}}>
                                    <FontAwesome5 name={"phone"} size={24} color={"#FFF"}/>
                                    <FontAwesome5 style={{marginLeft: 15,}} name={"video"} size={24} color={"#FFF"}/>
                                    <FontAwesome5 style={{marginLeft: 15,}} name={"chalkboard-teacher"} size={24} color={"#FFF"}/>
                                </View>
                        }
                    </Right>
                </Header>
                <View style={{flex:1}}>
                    <GiftedChat

                        messages={this.state.messages}
                        extraData={this.state.participants}
                        alwaysShowSend={true}
                        isKeyboardInternallyHandled={true}
                        onSend={messages => this.onSend(messages[0])}
                        user={{
                            _id: this.props.user.id,
                            avatar: `https://tippinweb.com/api/v0` + this.props.user.avatar,
                        }}
                        // showUserAvatar
                        maxInputLength={350}
                        onInputTextChanged={(text) => this.inputTextChanged(text)}
                        renderTime={() => {return null}}
                        shouldUpdateMessage={(props, nextProps) => {
                            if (this.state.renderMessages) {
                                this.setState({
                                    renderMessages: false,
                                });
                                return true;
                            }
                        }}
                        renderMessage={this.renderMessage}
                        // renderMessageText={this.renderMessageText}
                        renderAvatar={this.renderAvatar}
                        renderBubble={this.renderBubble}
                        renderMessageImage={this.renderImage}
                        renderFooter={this.renderFooter}
                        bottomOffset={40}
                    />
                    {/*<KeyboardAvoidingView behavior={"padding"} keyboardVerticalOffset={48} enabled={(Platform.OS === 'android')}/>*/}
                </View>
                </Container>
            )
        }
        else{
            return(
                <Container>
                    <Header>
                        <Left><Button
                            title=''
                            transparent
                            onPress={() => this.props.navigation.goBack()}
                        >
                            <FontAwesome5 name={"chevron-left"} size={24}/>
                        </Button></Left>
                        <Body><Title>Messages</Title></Body>
                        <Right></Right>
                    </Header>
                    <Content>
                        <ActivityIndicator color="#0000ff" />
                    </Content>
                </Container>
            )
        }
    }

    renderAvatar = (props) => {
        return (
            <FastImage
                source={{
                    uri: props.currentMessage.user.avatar,
                    // uri: (this.props.threads.threads[this.props.navigation.getParam('thread')].thread_type === 1) ? `https://tippinweb.com/${this.props.threads.threads[this.props.navigation.getParam('thread')].avatar}` : `https://tippinweb.com/api/v1${this.props.threads.threads[this.props.navigation.getParam('thread')].avatar}`,
                    headers: {Authorization: `Bearer ${this.props.auth.accessToken}`},
                    // priority: FastImage.priority.high
                }}
                style={{
                    height: 34,
                    width: 34,
                    // marginRight:-8,
                    borderRadius:17,
                    // opacity: ({...this.state.participants[props.currentMessage.user._id]}.online === 1) ? 1:.5,
                    // marginTop:-6, //fix for avatar being 36x36
                }}
            />
        )
    }

    renderMessage = (props) => {
        return(
            <Message
                {...props}
                containerStyle={{
                    left:{
                        marginBottom:0,
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
                            left:{
                            },
                        }}
                        containerStyle={{
                            left:{
                                marginBottom:5,
                            },
                        }}
                    />
                    <View style={{flexDirection: (props.position === "left")? 'row' : 'row-reverse', alignItems: 'center'}}>
                    {(this.state.bobbles.hasOwnProperty(props.currentMessage._id) && props.currentMessage._id !== this.state.messages[0]._id) &&
                        Object.entries(this.state.bobbles[props.currentMessage._id]).map((bobble, index, arr) => {
                            if(index <= 5){
                                return <FastImage
                                    key={`${bobble[0]}_bobble_${props.currentMessage._id}`}
                                    source={{
                                        uri: `${config.api.uri}${bobble[1]}`,
                                        // uri: (this.props.threads.threads[this.props.navigation.getParam('thread')].thread_type === 1) ? `https://tippinweb.com/${this.props.threads.threads[this.props.navigation.getParam('thread')].avatar}` : `https://tippinweb.com/api/v1${this.props.threads.threads[this.props.navigation.getParam('thread')].avatar}`,
                                        headers: {Authorization: `Bearer ${this.props.auth.accessToken}`},
                                        // priority: FastImage.priority.high
                                    }}
                                    style={{
                                        height: 14,
                                        width: 14,
                                        // marginRight:-8,
                                        borderRadius:7,
                                        opacity: (this.state.participants[bobble[0]].online === 1) ? 1:.5,
                                        // marginTop:-6, //fix for avatar being 36x36
                                    }}
                                />
                            }
                            else if(index === 6){
                                let overflow = arr.length - 6;
                                return <Text key={`overflow_${props.currentMessage._id}`} style={{backgroundColor: "#d3d3d3" , color: "#FFF", marginLeft:(props.position === "left") ? 4:0, marginRight: (props.position === "left") ? 0:4}}>+{overflow}</Text>
                            }
                        })
                    }
                    </View>
                </View>
            );
        }
        return (
            <View style={{marginTop:10,}}>
                {(props.currentMessage.user._id !== this.props.user.id) && <Text style={styles.name}>{props.currentMessage.user.name}</Text>}
                <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: "#269c26",
                    },
                    left:{
                        // margin:2,
                    }

                }}
                containerStyle={{
                    right: {
                    },
                    left: {
                        marginBottom:5,
                    },
                }}
                />
                <View style={{flexDirection: (props.position === "left")? 'row' : 'row-reverse',alignItems: 'center'}}>
                {(this.state.bobbles.hasOwnProperty(props.currentMessage._id) && props.currentMessage._id !== this.state.messages[0]._id) &&
                Object.entries(this.state.bobbles[props.currentMessage._id]).map((bobble, index, arr) => {
                    if(index <= 5){
                        return <FastImage
                            key={`${bobble[0]}_bobble`}
                            source={{
                                uri: `${config.api.uri}${bobble[1]}`,
                                headers: {Authorization: `Bearer ${this.props.auth.accessToken}`},
                                // priority: FastImage.priority.high
                            }}
                            style={{
                                height: 14,
                                width: 14,
                                // marginRight:-8,
                                borderRadius:7,
                                // borderWidth:1,
                                opacity: (this.state.participants[bobble[0]].online === 1) ? 1:.5,
                                // marginTop:-6, //fix for avatar being 36x36
                            }}
                        />
                    }
                    else if(index === 6){

                        let overflow = arr.length - 6;
                        return <Text key={`overflow_${props.currentMessage._id}`} style={{backgroundColor: "#b5a8a8" , color: "#FFF", marginLeft:4,}}>+{overflow}</Text>
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
                            uri: props.currentMessage.image,
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
        let typers = Object.values(this.state.participants).filter((participant, index, arr) => {
            if(participant.typing){
                return true;
            }
        });
        return(
            <View style={{flexDirection: 'row', alignItems: 'center', height: 25, width: config.layout.window.width}}>
                <View style={{flex: 1, flexDirection: 'row-reverse'}}>
                    {
                        (this.state.messages.length > 0 && this.state.bobbles.hasOwnProperty(this.state.messages[0]._id)) &&
                        (Object.entries(this.state.bobbles[this.state.messages[0]._id]).map((bobble, index, arr) => {
                            
                            if(index <= 5 && !this.state.typers.hasOwnProperty(bobble[0])){
                                return <FastImage
                                    key={`${bobble[0]}_bobble`}
                                    source={{
                                        uri: `${config.api.uri}${bobble[1]}`,
                                        // uri: (this.props.threads.threads[this.props.navigation.getParam('thread')].thread_type === 1) ? `https://tippinweb.com/${this.props.threads.threads[this.props.navigation.getParam('thread')].avatar}` : `https://tippinweb.com/api/v1${this.props.threads.threads[this.props.navigation.getParam('thread')].avatar}`,
                                        headers: {Authorization: `Bearer ${this.props.auth.accessToken}`},
                                        // priority: FastImage.priority.high
                                    }}
                                    style={{
                                        height: 14,
                                        width: 14,
                                        // marginRight:-8,
                                        borderRadius:7,
                                        // borderWidth:1,
                                        opacity: (this.state.participants[bobble[0]].online === 1) ? 1:.5,
                                        // marginTop:-6, //fix for avatar being 36x36
                                    }}
                                />
                            }
                            else if(index === 6 && !this.state.typers.hasOwnProperty(bobble[0])){

                                let overflow = arr.length - 6;
                                return <Text key={`overflow_${props.currentMessage._id}`} style={{backgroundColor: "#b5a8a8" , color: "#FFF", marginLeft:4,}}>+{overflow}</Text>
                            }
                        }))
                    }
                </View>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                    {   (Object.values(this.state.typers).length > 0) &&
                    typers.map((typer, index, arr) => {
                        if(index <= 5){
                            return <FastImage
                                style={{height: 14, width: 14, borderRadius: 7}}
                                key={`${typer.id}_typer_${index}`}
                                source={{
                                    uri: `${config.api.uri}${typer.avatar}`,
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
                            <View style={{marginLeft: 5,}}>
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


    }
}

const styles = StyleSheet.create({
    container: {},
    name:{
        fontSize:12,
        color:"#878787",

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
    addMessages: Messages.addMessages,
    setActiveThread: Threads.setActiveThread,
    storeThreads: Threads.storeThreads,
    startVideoCall: Call.startVideoCall,
    startWhiteboard: Call.startWhiteboard,
};

export default connect(mapStateToProps, mapDispatchToProps)(withSocketContext(withNavigationFocus(MessagesScreen)));

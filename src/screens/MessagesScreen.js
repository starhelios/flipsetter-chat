import React, {Component} from 'react';
import {
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  BackHandler,
} from 'react-native';
import noop from 'lodash/noop'
import map from 'lodash/map'
import ShareMenu, { ShareMenuReactView } from "react-native-share-menu";

// import imageToBlob from 'react-native-image-to-blob'
// Import the react-native-sound module
import Sound from 'react-native-sound';
import YouTube from 'react-native-youtube';
import RNFetchBlob from "rn-fetch-blob";

import ImagePicker from 'react-native-image-crop-picker';
import {
  Container,
  Header,
  View,
  Left,
  Body,
  Right,
  Text,
  Button
} from 'native-base';

import { withNavigationFocus } from 'react-navigation';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {GiftedChat, Send} from 'react-native-gifted-chat';
import Lightbox from 'react-native-lightbox';
import { emojify } from 'react-emojione';
import { withSocketContext } from '../components/Socket';
import { App, Auth, User, Threads, Messages, Call } from '../reducers/actions';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import Bubble from 'react-native-gifted-chat/lib/Bubble';
import Message from 'react-native-gifted-chat/lib/Message';
import { AllHtmlEntities as entities } from 'html-entities';
import { DotsLoader } from 'react-native-indicator';
import { isSameUser, isSameDay } from 'react-native-gifted-chat/lib/utils';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import config from '../config';
import CustomPickerView from '../components/PickerView';
import DocumentPicker from 'react-native-document-picker';
import CustomModal from '../components/CustomModal';
import EmojiSelector, { Categories } from '../components/react-native-emoji-selector';

import Images from '../config/Images';

import { Thumbnail } from '../components/react-native-thumbnail-video';
// Enable playback in silence mode
//Sound.setCategory('Playback');

// import { GiphyUi } from 'react-native-giphy-ui';

// GiphyUi.configure('g1zE0iMVRsYdw03HXZfRd3ivUjxEywFB');

class MessagesScreen extends Component {
  messages = [];
  activeThread = this.props.navigation.getParam('thread');

  state = {
    isLoading: true,
    threadAvatar: null,
    messages: this.props.messages.messages.hasOwnProperty(
      this.props.navigation.getParam('thread'),
    )
      ? [
        ...this.props.messages.messages[
        this.props.navigation.getParam('thread')
        ],
      ]
      : null,
    renderMessages: false,
    participants: {},
    bobbles: {},
    typers: {},
    selectedImages: [],
    startedTyping: null,
    activeCall: null,
    typedMsg: '',
    openPicker: false,
    openGif: false,
    showEmoji: false,
    showModal: false,
    doc: false,
    showWebView: false,
    selectedLink: '',
    fullScreen: false,
    videoUri: '',
    videoData: {},
    Img: '',
    fileToUpload: {},
    fileToUploadArray: [],
    isDoc: false
  };

  constructor(props) {
    super(props);
    this.echo = props.socket;
    this.typeInterval = 0;
  }

  generateId() {
    return Math.random().toString(36).substring(2, 10) + '-' + Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 14);
  }

  generateName() {
    return Math.random().toString(36).substring(2, 10) + '-' + Math.random().toString(36).substring(2, 6);
  }

  async componentDidMount() {

    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );

    ShareMenuReactView.data().then(({ mimeType, data }) => {
      console.tron.log(data);
      console.tron.log(mimeType);
    });

    this.props.getUser()

    this.props.setActiveThread(this.activeThread);
    //Let's update the thread
    this.update = await this.props.getMessages(this.activeThread);
    //Move this into redux!!

    if (this.update.type === 'GET_MESSAGES_SUCCESS') {
      // this.thread = this.echo.socket.join(`thread_${this.props.navigation.getParam('thread')}`)
      if (
        typeof this.echo.socket.connector.channels[
        `presence-thread_${this.props.navigation.getParam('thread')}`
        ] !== 'undefined'
      ) {
        this.echo.socket.connector.channels[
          `presence-thread_${this.props.navigation.getParam('thread')}`
        ].subscribe();
        this.thread = this.echo.socket.connector.channels[
          `presence-thread_${this.props.navigation.getParam('thread')}`
        ];
      } else {
        this.thread = this.echo.socket.join(
          `thread_${this.props.navigation.getParam('thread')}`,
        );
      }
      this.bobbleHeads(this.update.payload.data.bobble_heads);
      this.thread.whisper('online', {
        owner_id: this.props.user.id,
        online: 1,
        name: `${this.props.user.first} ${this.props.user.last}`,
      });
    }

    this.typeInterval = setInterval(this._updateTypers, 2000);
    const { app } = this.props;
    //Is there an active call for this thread?
    let activeCall = null;
    if (
      app.heartbeat !== null &&
      app.heartbeat.data != null &&
      app.heartbeat.data.states &&
      app.heartbeat.data.states.active_calls != null
    )
      activeCall = this.props.app.heartbeat.data.states.active_calls.filter(
        call => call.thread_id === this.activeThread,
      )[0];
    if (activeCall) {
      this.setState({
        activeCall: activeCall,
      });
    }
    //Are Messages loaded && are bobbles updated?
    if (this.state.messages && this.update) {
      this.setState({
        isLoading: false,
      });
    }
    // AppState.addEventListener('change', this._handleAppStateChange);
  }

  async componentDidUpdate(
    prevProps,
    prevState,
    snapshot,
  ) {
    //check if messages updated and if most recent message matches the sender's recent message
    // console.log("MESSAGES", this.state.messages)
    //Check if we need to refresh for a new thread (e.g. navigating to messages while already on it)
    // if(this.props.navigation.getParam('callEnded') === true){
    //     this.props.appHeartbeat();
    // }
    if (
      prevProps.navigation.getParam('thread') !==
      this.props.navigation.getParam('thread')
    ) {
      this.props.navigation.navigate('Threads', {
        newMessage: this.props.navigation.getParam('thread'),
      });
    } else {
      //Was the app in the background?  Let's do some housekeeping and update the thread messages
      if (
        prevProps.app.appState.match(/inactive|background/) &&
        this.props.app.appState === 'active'
      ) {
        let update = await this.props.getMessages(this.activeThread);
        // alert(JSON.stringify(update))
        if (
          update &&
          this.activeThread === this.props.navigation.getParam('thread')
        ) {
          this.bobbleHeads(update.payload.data.bobble_heads);
          // alert(JSON.stringify(this.props.messages.messages[this.activeThread]))
          this.setState({
            messages: this.props.messages.messages[this.activeThread],
            isLoading: false,
            renderMessages: true,
          }, this.ringPhn);
        }
      }
    }

    //Check if Messages have been retreived from redux and placed in store and if so finish rendering
    if (this.state.messages && this.state.isLoading && this.update) {
      this.setState({
        isLoading: false,
      });
    }
    //Check if messages aren't set and make sure they are retrieved from redux
    if (
      this.props.messages.messages.hasOwnProperty(
        this.props.navigation.getParam('thread'),
      ) &&
      !this.state.messages
    ) {
      this.setState({
        messages: [
          ...this.props.messages.messages[
          this.props.navigation.getParam('thread')
          ],
        ],
      },this.ringPhn);
    }
    // alert("kk "+JSON.stringify(this.props.socket))
    //Make Sure socket is connected and if disconnects re-subscribe to restore connecction
    if (
      this.props.socket.status !== prevProps.socket.status &&
      this.props.socket.status === 'connected'
    ) {
      if (
        typeof this.echo.socket.connector.channels[
        `presence-thread_${this.props.navigation.getParam('thread')}`
        ] !== 'undefined'
      ) {
        this.echo.socket.connector.channels[
          `presence-thread_${this.props.navigation.getParam('thread')}`
        ].subscribe();
        this.thread = this.echo.socket.connector.channels[
          `presence-thread_${this.props.navigation.getParam('thread')}`
        ];
      } else {
        this.thread = this.echo.socket.join(
          `thread_${this.props.navigation.getParam('thread')}`,
        );
      }
    }

    //Check for active calls from heartbeat
    const { app } = this.props;
    if (
      typeof app.heartbeat !== undefined &&
      app.heartbeat !== null &&
      app.heartbeat.data != null &&
      app.heartbeat.data.states &&
      app.heartbeat.data.states.active_calls != null
    ) {
      if (
        this.props.app.heartbeat.data.states.active_calls.length !==
        prevProps.app.heartbeat.data.states.active_calls.length
      ) {
        console.log('went into if');
        let activeCall = this.props.app.heartbeat.data.states.active_calls.filter(
          call => call.thread_id === this.activeThread,
        )[0];
        // console.log("Current_call", activeCall);
        if (activeCall) {
          this.setState({ activeCall: activeCall, renderMessage: true });
        } else {
          this.setState({
            activeCall: false,
            renderMessage: true,
          });
        }
      }
    }

    if (typeof prevProps.messages.messages[this.activeThread] !== 'undefined') {
      if (
        this.props.messages.messages[this.activeThread].length !==
        prevProps.messages.messages[this.activeThread].length
      ) {
        this.setState({
          messages: this.props.messages.messages.hasOwnProperty(
            this.props.navigation.getParam('thread'),
          )
            ? [
              ...this.props.messages.messages[
              this.props.navigation.getParam('thread')
              ],
            ]
            : null,
          renderMessages: true,
        }, this.ringPhn);
      }
    }
    if (
      this.props.call.status !== prevProps.call.stats &&
      this.props.call.status === 'ended'
    ) {
      this.props.appHeartbeat();
      this.props.setCallStatus(null);
    }
  }

  // name: Rogelio Leffler
  // email: kamron63@example.com
  // pass: Flipsetter1!

  handleBackButtonClick = () => {
    if (this.state.showWebView) {
      this.setState({ showWebView: false });
    } else {
      this.setState({ showEmoji: false }, () => {
        this.props.navigation.goBack();
      });
    }
    return true;
  }


  playSound = () => {
    const whoosh = new Sound('click.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      // loaded successfully
      console.log(
        'duration in seconds: ' +
        whoosh.getDuration() +
        'number of channels: ' +
        whoosh.getNumberOfChannels(),
      );
      // Play the sound with an onEnd callback
      whoosh.play(success => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    });
  };

ringPhn=()=>{
  this.playSound();
}

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    clearInterval(this.typeInterval);
    if (this.thread) {
      this.thread.unsubscribe();
    }
    // this.echo.socket.leave(`thread_${this.props.navigation.getParam('thread')}`);
  }

  play = () => {
    this.player.playVideo();
  };
  pause = () => {
    this.player.pauseVideo();
  };

  seekTo = s => {
    this.player.seekTo(s);
  };

  _listeners = () => {
    // this.private = this.echo.private(`user_notify_${this.user.user_id}`);
    this.thread
      .here(users => {
        console.log('here', users);
      })
      .joining(user => {
        console.log('joining', user);
      })
      .leaving(user => {
        console.log('leaving', user);
      })
      .listenForWhisper('typing', data => {
        console.log('typing');
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
            },
          }));
        } else {
          if (!data.typing) {
            this.setState(state => ({
              participants: {
                ...this.state.participants,
                [data.owner_id]: {
                  ...this.state.participants[data.owner_id],
                  typing: false,
                },
              },
            }));
          }
        }
      })
      .listenForWhisper('online', data => {
        // alert(JSON.stringify(data))
        this.setState(previousState => ({
          participants: {
            ...previousState.participants,
            [data.owner_id]: {
              ...previousState.participants[data.owner_id],
              online: data.online,
            },
          },
          renderMessages: true,
        }));
      })
      .listenForWhisper('read', data => {
        console.log('read_whisper', data);
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
            },
          },
          // renderMessages: true,
        }));
      });
    // .listenForWhisper('send_message_setting', data => {
  };

  async onSend(message = [], type, file) {
    // alert(JSON.stringify(message))
    this.setState({ openPicker: false, showEmoji: false });

    // this.setState(prevState => ({
    //     messages: GiftedChat.append(prevState.messages, incoming),
    //     renderMessages: true,
    //     startedTyping: null,
    // }));
    // console.log(this.state.messages);
    //Set the message fast, we can update later

    let incoming;
    if (type === 'img') {
      incoming = {
        _id: await message._id,
        createdAt: message.createdAt,
        image: file.uri,
        user: {
          ...message.user,
          // name: response.payload.data.message.name,
        },
        temp_id: await message._id,
      };
    }
    else if (type === 'message') {
      incoming = {
        _id: await message._id,
        createdAt: message.createdAt,
        text: message.text ? emojify(entities.decode(message.text), { output: 'unicode' }) : '',
        user: {
          ...message.user,
          // name: response.payload.data.message.name,
        },
        temp_id: await message._id,
      };
    }
    else {
      let dt = Date.now()
      let type = file.type.replace("application/", ".");
      incoming = {
        _id: await message._id,
        createdAt: message.createdAt,
        file: file.name + "_" + dt + type,
        user: {
          ...message.user,
          // name: response.payload.data.message.name,
        },
        temp_id: await message._id,
      };
    }


    //add messages to store
    await this.props.addMessage(this.activeThread, incoming);
    let response = await this.props.sendMessage(
      this.props.navigation.getParam('thread'),
      message, type, file
    );

    // alert("res "+JSON.stringify(response))

    let updated = {
      ...incoming,
      _id: await response.payload.data.message.message_id,
      user: {
        ...incoming.user,
        name: await response.payload.data.message.name,
      },
    };
    this.props.updateMessage(this.activeThread, updated);

    //update threads screen store in the background
    let threads = { ...this.props.threads.threads };
    let current = { ...threads[this.activeThread] };
    current.recent_message = {
      body: message.text ? message.text : '',
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
        if (typer[1] + 2000 <= Date.now()) {
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
        refreshMessages: refresh,
      }));
    }
  };

  bobbleHeads = data => {
    let list = {};
    let bobbles = {};
    // alert(JSON.stringify(data))
    data.map((participant, index, arr) => {
      list[participant.owner_id] = participant;
      bobbles[participant.message_id] = {
        ...bobbles[participant.message_id],
        [participant.owner_id]: participant.avatar,
      };
    });
    this.setState(
      {
        participants: list,
        bobbles: bobbles,
        renderMessages: true,
      },
      this._listeners(),
    );
  };

  addEmoji = text => {
    // alert(text)
    let newMsg = this.state.typedMsg + text;
    this.setState(
      { typedMsg: newMsg },
      // , () => {
      //     this.inputTextChanged(newMsg)
      // }
    );
  };

  inputTextChanged = text => {
    this.setState({ typedMsg: text });
    let now = Date.now();
    if (
      this.state.startedTyping === null ||
      this.state.startedTyping + 1500 <= now
    ) {
      this.setState({
        startedTyping: now,
      });
      this.thread &&
        this.thread.whisper('typing', {
          owner_id: this.props.user.id,
          name: `${this.props.user.first} ${this.props.user.last}`,
          typing: true,
        });
    }
  };

  joinCall = call => {
    // console.log("Call", call);
    this.props.setCallId(call.call_id);
    this.props.setCallType(call.call_type);
    this.props.setCallRoom(call.room_id);
    this.props.setCallRoomPin(call.room_pin);
    this.props.setCallerName(call.name);
    this.props.setCallThreadId(call.thread_id);
    this.props.setCallStatus('joining');
  };

  startCall = async type => {
    this.ringPhn();
    let response;
    type === 1
      ? (response = await this.props.startVideoCall(this.activeThread))
      : (response = await this.props.startWhiteboard(this.activeThread));
    // console.log("StartCall", response);

    if (
      response.type === 'START_VIDEO_CALL_SUCCESS' ||
      response.type === 'START_WHITEBOARD_SUCCESS'
    ) {
      // this.props.setCallId(response.data.call_id);
      // this.props.setCallType(response.data.call_type);
      // this.props.setCallRoom(response.data.room_id);
      // this.props.setCallRoomPin(response.data.room_pin);
      this.props.setCallerName(this.props.user.name);
      // this.props.setCallThreadId(response.data.thread_id);
      this.props.setCallStatus('initiated');
      this.props.appHeartbeat();
    }
    // if(type === 2) {
    //   this.props.navigation.navigate('Whiteboard');
    // }
  };
  openCamera = () => {
    this.setState({ openPicker: false, isDoc: false });
    ImagePicker.openCamera({
      // width: 300,
      // height: 400,
      // compressImageQuality: 0.8,
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      mime: 'jpg',
      cropping: true,
      includeBase64: true,
      multiple: true,
    })
      .then(imag => {


        let nm = this.generateName();
        const file = {
          name: "img" + nm + ".jpg",
          type: imag.mime,
          uri: Platform.OS === "android" ? imag.path : imag.path.replace("file://", ""),
        }

        const imgs = [file]

        this.setState({ showModal: true, selectedImages: [imag], fileToUploadArray: imgs });

      })
      .catch(e => {
        alert(e)
      });
  };

  openGallery = () => {
    this.setState({ openPicker: false, isDoc: false });
    ImagePicker.openPicker({
      // width: 300,
      // height: 300,
      // compressImageQuality: 0.8,
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      mime: 'jpg',
      cropping: true,
      includeBase64: true,
      multiple: true,
    })
      .then(images => {
        let imgs = [];
        images.map((res) => {
          let nm = this.generateName();
          const file = {
            name: "img" + nm + ".jpg",
            type: res.mime,
            uri: Platform.OS === "android" ? res.path : res.path.replace("file://", ""),
          }

          imgs.push(file)
        })
        this.setState({ showModal: true, selectedImages: images, fileToUploadArray: imgs });
      })
      .catch(e => { });
  };



   pickDocument = async () => {
    this.setState({ openPicker: false, isDoc: false });
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
      });
      console.log(JSON.stringify(results))
      let docs = [];
      results.map((res) => {
        // alert(JSON.stringify(res))
        // let nm = this.generateName();
        const file = {
          name: res.name,
          type: res.type,
          uri: res.uri,
        }
        docs.push(file)
      })
      this.setState({ doc: true, isDoc: true, showModal: true, selectedImages: results, fileToUploadArray: docs });
      // let s = results.length > 1 ? 's' : '';
      // alert("You have selected " +results.length + " Document"+s)
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  }

  handleAddPicture = () => {
    const { user } = this.props.user; // wherever you user data is stored;
    const options = {
      title: 'Select Profile Pic',
      mediaType: 'photo',
      takePhotoButtonTitle: 'Take a Photo',
      maxWidth: 256,
      maxHeight: 256,
      allowsEditing: true,
      noData: true,
    };
    ImagePicker.openPicker(options, response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        // do nothing
      } else if (response.error) {
        // alert error
      } else {
        const { uri } = response;
        const extensionIndex = uri.lastIndexOf('.');
        const extension = uri.slice(extensionIndex + 1);
        const allowedExtensions = ['jpg', 'jpeg', 'png'];
        const correspondingMime = ['image/jpeg', 'image/jpeg', 'image/png'];
        const options = {
          keyPrefix: '****',
          bucket: '****',
          region: '****',
          accessKey: '****',
          secretKey: '****',
        };
        const file = {
          uri,
          name: `${this.messageIdGenerator()}.${extension}`,
          type: correspondingMime[allowedExtensions.indexOf(extension)],
        };
        RNS3.put(file, options)
          .progress(event => {
            console.log(`percent: ${event.percent}`);
          })
          .then(response => {
            console.log(response, 'response from rns3');
            if (response.status !== 201) {
              alert(
                'Something went wrong, and the profile pic was not uploaded.',
              );
              console.error(response.body);
              return;
            }
            const message = {};
            message._id = this.messageIdGenerator();
            message.createdAt = Date.now();
            message.user = {
              _id: user.userId,
              name: `${user.firstName} ${user.lastName}`,
              avatar: 'user avatar here',
            };
            message.image = response.headers.Location;
            message.messageType = 'image';
            this.chatsFromFB.update({
              messages: [message, ...this.state.messages],
            });
          });
        if (!allowedExtensions.includes(extension)) {
          return alert('That file type is not allowed.');
        }
      }
    });
  };

  openEmoji = () => {

    Keyboard.dismiss();

    this.ringPhn()
    // this.ringPhn();
    this.setState({ showEmoji: true, openPicker: false });
  };

  customSystemMessage = props => {
    return (
      <View style={{ height: Platform.OS === 'ios' ? hp('6%') : hp('7.2%'), flexDirection: 'row', backgroundColor: 'transparent', alignSelf: 'center' }}>
        {/*<TouchableOpacity*/}
        {/*  style={{*/}
        {/*    margin: 3,*/}
        {/*    alignSelf: 'center',*/}
        {/*    justifyContent: 'center',*/}
        {/*  }}*/}
        {/*  onPress={() => this.setState({ openGif: true, openPicker: false, showEmoji: false },()=>this.ringPhn() )}>*/}

        {/*  <Image*/}
        {/*    resizeMode="contain"*/}
        {/*    source={Images.gif}*/}
        {/*    style={{ width: 28, height: 28, alignSelf: 'center' }}*/}
        {/*  />*/}
        {/*</TouchableOpacity>*/}
        <TouchableOpacity
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            margin: 3,
          }}
          onPress={() => this.openEmoji()}>
          <Image
            source={Images.emojiIcon}
            style={{ width: 28, height: 28, alignSelf: 'center' }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            margin: 3,
            alignSelf: 'center',
            justifyContent: 'center',
          }}
          onPress={() => this.setState({ openPicker: true, showEmoji: false },this.ringPhn)}>
          <Image
            resizeMode="contain"
            source={Images.attachmentIcon}
            style={{ width: 28, height: 28, alignSelf: 'center' }}
          />
        </TouchableOpacity>
        <Send
          {...props}
          containerStyle={{
            alignSelf: 'center',
            justifyContent: 'center',
            marginRight: 10,
            margin: 3,
          }}>
          <Image
            resizeMode="contain"
            source={Images.sendIcon}
            style={{ alignSelf: 'center' }}
          />
        </Send>
      </View>
    );
  };

  checkIfLink = link => {
    const reg = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
    return reg.test(link) === true;
  };

  onPressHashtag = (link, index) => {
    this.setState({ showWebView: true, selectedLink: link });
  };

  imageSelected = () => {
    this.setState({ showModal: false, doc: false }, () => {
      let s = this.state.selectedImages.length > 1 ? 's' : '';
      this.state.fileToUploadArray.map((res) => {
        // alert(JSON.stringify(res))
        let dt = Date.now();
        var dateTime = new Date(dt);
        let msg = {
          _id: String(this.generateId()),
          createdAt: dateTime.toISOString(),
          user: {
            _id: this.props.user.id,
            avatar: `https://${config.api.uri}` + this.props.user.avatar,
          },
        }
        { this.state.isDoc ? this.onSend(msg, 'doc', res) : this.onSend(msg, 'img', res) }
      })
      //   'You have selected ' + this.state.selectedImages.length + ' Image' + s,
      // );
    });
  };

  downloadPkPassFile = (imgUrl = "") => {

let imageName = "/IMG" + new Date().getTime() + ".png";

let dirs = RNFetchBlob.fs.dirs;
let path = Platform.OS === 'ios' ? dirs['MainBundleDir'] + imageName : dirs.PictureDir + imageName;


    if (Platform.OS === 'android') {

      RNFetchBlob.config({
        fileCache: true,
        appendExt: 'png',
        indicator: true,
        IOSBackgroundTask: true,
        path: path,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: path,
          description: 'Image'
        },

      }).fetch("GET", imgUrl).then(res => {
        console.log(res, 'end downloaded')
      })
      .catch((error) => {
              alert(error)
            })
    }





  //   new Promise((resolve, reject) => {
  //     let fileName = "IMG" + new Date().getTime() + ".png";
  //     const destPathAndroid = `${ExternalStorageDirectoryPath}` + "/Download/" + fileName;
  //     // const destPathAndroid = `${DocumentDirectoryPath}` +'/' + fileName;
  //     const destPathIOS = `${DocumentDirectoryPath}` + "/MyCollaborateFiles/" + fileName;
  //  console.log(destPathAndroid)
  //  console.log(MainBundlePath +"ff")

  //     const destPath = Platform.OS === 'ios' ? destPathIOS : destPathAndroid;
  //     downloadFile({
  //       fromUrl: fileUrl,
  //       toFile: destPath
  //     }).promise.then(result => {
  //       if (result.statusCode == 200) {
  //         alert("done")
  //         resolve(destPath);
  //       }
  //       else {
  //         reject("Unable to download");
  //       }

  //     }).catch((error) => {
  //       // alert(error)
  //       reject("Unable to download");
  //     })
  //   });
  }

  cancelImage = index => {
    this.ringPhn();
    var array = this.state.selectedImages;
    array.splice(index, 1);
    if (array.length <= 0) {
      this.setState({ showModal: false, doc: false, selectedImages: array });
    } else {
      this.setState({ selectedImages: array });
    }
  };

  onFullScreen = fullScreen => {
    console.log('fullscreen ', fullScreen);
    this.setState({ fullScreen });
  };

  goBack = () => {
    this.ringPhn();
    if (this.state.showWebView) {
      this.setState({ showWebView: false });
    } else {
      this.setState({ showEmoji: false }, () => {
        this.props.navigation.goBack();
      });
    }
  };

  render() {
    // if(!this.state.isLoading) {
    return (
      <Container>
        <Header>
          <Left style={{ marginRight: 40 }}>
            <Button title="" transparent onPress={() => this.goBack()}>
              <FontAwesome5 name={'chevron-left'} size={24} color={'#FFF'} />
            </Button>
          </Left>
          <Body
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <FastImage
              source={{
                uri: `https://${config.api.uri}${
                  this.props.threads.threads[this.activeThread].avatar
                  }`,
                headers: {
                  Authorization: `Bearer ${this.props.auth.accessToken}`,
                },
                priority: FastImage.priority.high,
              }}
              style={{ width: 30, height: 30, borderRadius: 15 }}
            />
            <Text
              style={{
                fontWeight: 'bold',
                width: 200,
                paddingLeft: 15,
                color: '#FFF',
              }}>
              {
                this.props.threads.threads[
                  this.props.navigation.getParam('thread')
                ].name
              }
            </Text>
          </Body>
          <Right>
            {(this.props.threads.threads[this.activeThread].options.admin ||
              (!this.props.threads.threads[this.activeThread].options.admin &&
                this.props.threads.threads[this.activeThread].options
                  .admin_call) ||
              this.props.threads.threads[this.activeThread].thread_type ===
              1) && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{ marginLeft: 15 }}>
                    <FontAwesome5
                      name={'video'}
                      size={24}
                      color={'#FFF'}
                      onPress={() => this.startCall(1)}
                    />
                  </View>
                  <View style={{ marginLeft: 30, marginRight: 15 }}>
                    <FontAwesome5
                      name={'chalkboard-teacher'}
                      size={24}
                      color={'#FFF'}
                      onPress={() => this.startCall(2)}
                    />
                  </View>
                </View>
              )}
          </Right>
        </Header>

        {this.state.showWebView ? (
          <View>
            <YouTube
              apiKey="AIzaSyBxDfNPaaWHcudKkcsmudIaY5tlcLGMHD0" // Your YouTube Developer API Key
              play
              // controls={1}
              // onProgress={(a)=>alert(a)}
              showinfo={false}
              videoId={this.state.videoUri}
              onReady={e => this.setState({ isReady: true })}
              onChangeState={e => console.log(JSON.stringify(e))}
              onError={e => console.log(e.error)}
              style={{ alignSelf: 'stretch', height: hp('30%'), margin: 5 }}
            />
            {/* <Text onPress={()=>this.setState({showWebView:false})} style={{margin:5,padding:5,paddingTop:0,color:'white',fontSize:hp('5%'),}}>x</Text> */}
          </View>
        ) : null}

        <View style={{ flex: 1 }}>
          {this.state.activeCall && (
            <View
              style={{
                flexDirection: 'row',
                height: 30,
                width: config.layout.window.width,
                backgroundColor: '#269c26',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text size={15} style={{ marginLeft: 5, color: '#FFFFFF' }}>
                There is an active{' '}
                {this.state.activeCall.call_type === 1
                  ? 'video call'
                  : 'whiteboard session'}
              </Text>
              <TouchableOpacity
                style={{ marginRight: 25 }}
                onPress={() => this.joinCall(this.state.activeCall)}>
                <Text style={{ color: '#FFFFFF' }}>JOIN</Text>
              </TouchableOpacity>
            </View>
          )}
          <GiftedChat
            isInitialized
            text={this.state.typedMsg}
            renderSend={this.customSystemMessage}
            messages={this.state.messages}
            // messageIdGenerator={(messages)=>this.messageIdGenerator(messages)}
            extraData={this.state.participants}
            alwaysShowSend
            onSend={messages => this.onSend(messages[0], 'message', this.state.fileToUpload)}
            focusTextInput={() => this.setState({ showEmoji: false })}
            user={{
              _id: this.props.user.id,
              avatar: `https://${config.api.uri}` + this.props.user.avatar,
            }}
            // showUserAvatar
            renderLoading={() => <ActivityIndicator color="#0000ff" />}
            maxInputLength={350}
            minInputToolbarHeight={60}
            onInputTextChanged={this.inputTextChanged}
            renderTime={noop}
            shouldUpdateMessage={(props, nextProps) => {
              if (this.state.renderMessages) {
                this.setState({
                  renderMessages: false,
                });
                return true;
              }
            }}

            renderMessage={this.renderMessage}
            renderAvatar={this.renderAvatar}
            renderBubble={this.renderBubble}
            renderMessageImage={this.renderImage}
            renderFooter={this.renderFooter}
          />
        </View>

        {this.state.openPicker && (
          <CustomPickerView
            openGallery={this.openGallery}
            openCamera={this.openCamera}
            pickDocument={this.pickDocument}
            cancel={() => this.setState({ openPicker: false })}
          />
        )}


        {/*{*/}
        {/*  this.state.openGif ?*/}
        {/*    GiphyUi.present(*/}
        {/*      {*/}
        {/*        theme: 'light',*/}
        {/*        layout: 'waterfall',*/}
        {/*        rating: 'ratedG',*/}
        {/*        showConfirmationScreen: true,*/}
        {/*        mediaTypes: ['gfs'],*/}
        {/*        trayHeightMultiplier: 0.5*/}
        {/*      },*/}

        {/*      selectedMedia => {*/}
        {/*        console.log('Picked media', selectedMedia);*/}

        {/*        let gifs = [];*/}

        {/*        const file = {*/}
        {/*          name: selectedMedia.title,*/}
        {/*          type: 'image/gif',*/}
        {/*          uri: selectedMedia.images.downsized.url,*/}
        {/*        }*/}
        {/*        gifs.push(file)*/}
        {/*        this.setState({ fileToUploadArray: gifs, openGif: false, isDoc: false }, () => {*/}
        {/*          this.imageSelected()*/}
        {/*        })*/}
        {/*      },*/}
        {/*      onDismiss => {*/}
        {/*        this.setState({ openGif: false })*/}
        {/*      },*/}
        {/*    )*/}
        {/*    : null*/}
        {/*}*/}

        {this.state.showEmoji && (
          <EmojiSelector
            columns={9}
            onCancel={() => this.setState({ showEmoji: false },this.ringPhn)}
            onEmojiSelected={this.addEmoji}
            // onEmojiSelected={emoji => this.setState({typedMsg:emoji})}
            showSearchBar
            showTabs
            // aria-setsize={5}
            // showHistory={true}
            showSectionTitles
            category={Categories.all}
          />
        )}

        {this.state.showModal && (
          <CustomModal
            doc={this.state.doc}
            data={this.state.selectedImages}
            imageSelected={this.imageSelected}
            cancel={this.cancelImage}
          />
        )}
      </Container>
    );
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

  renderAvatar = props => {
    return (
      <FastImage
        key={`avatar_${props.currentMessage._id}`}
        source={{
          uri: `${props.currentMessage.user.avatar}`,
          // uri: (this.props.threads.threads[this.props.navigation.getParam('thread')].thread_type === 1) ? `https://tippinweb.com/${this.props.threads.threads[this.props.navigation.getParam('thread')].avatar}` : `https://tippinweb.com/api/v1${this.props.threads.threads[this.props.navigation.getParam('thread')].avatar}`,
          headers: { Authorization: `Bearer ${this.props.auth.accessToken}` },
          priority: FastImage.priority.high,
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
    );
  };






  renderMessage = props => {
    let thumbNail = false;
    let youtube_id = '';
    if (this.checkIfLink(props.currentMessage.text)) {
      if (props.currentMessage.text.match('http://(www.)?youtube|youtu.be')) {
        youtube_id = props.currentMessage.text
          .split(/v\/|v=|youtu\.be\//)[1]
          .split(/[?&]/)[0];
      }
      thumbNail = true
    }

    return thumbNail ? (
      <View style={{
        borderRadius: 10, borderWidth: 1, justifyContent: 'center', width: wp('50%'), margin: 5, backgroundColor: 'black',
        alignSelf: props.position === 'left' ? 'flex-start' : 'flex-end',
      }}>
        <Thumbnail
          onPress={() => this.setState({ showWebView: true, videoUri: youtube_id })}
          containerStyle={{
            alignSelf: 'center',
          }}
          url={props.currentMessage.text}
        />

      </View>

    ) : (

        props.currentMessage.file ?
          <View style={{
            borderColor: 'grey', alignItems: 'center', width:wp('60%'),
            borderRadius: 10, borderWidth: 0.8,  margin: 10, backgroundColor: 'white',
            alignSelf: props.position === 'left' ? 'flex-start' : 'flex-end',
          }}>
            <TouchableOpacity style={{borderTopLeftRadius:10,borderTopRightRadius:10,flexDirection:'row',justifyContent:'center', margin:5,marginTop:0,alignItems:'center',width:'100%',backgroundColor:'black', alignSelf:'center'}} onPress={()=>alert(JSON.stringify(props.currentMessage))}>
              <FontAwesome5 name="download" size={10} color="green" />
              <Text style={{ color: 'white', textAlign: 'left', fontSize: hp('1.8%'), padding: 5, fontWeight: 'bold' }}>Download</Text>
            </TouchableOpacity>
            <View style={{flexDirection:'row',alignItems:'center', width: '100%'}}>
              <Image source={props.currentMessage.file.split('.')[1].trim() === 'ppt' ? Images.ppt : props.currentMessage.file.split('.')[1].trim() === 'zip' ? Images.zip :
                props.currentMessage.file.split('.')[1].trim() === 'docx' ? Images.doc : props.currentMessage.file.split('.')[1].trim() === 'pdf' ? Images.pdf : Images.file} style={{ alignSelf: 'center',marginRight:5, marginLeft: 5, borderColor: 'black', borderRadius: 10, height: hp('5%'), width: hp('5%') }} />
              <Text style={{ color: 'black', textAlign: props.position === 'left' ? 'left' : 'right', fontSize: hp('1.8%'), padding: 5, fontWeight: 'bold', flex: 1, }} numberOfLines={1} ellipsizeMode='head'>{props.currentMessage.file}</Text>
            </View>
          </View>
          :

          <Message
            {...props}
            containerStyle={{
              left: {
                marginBottom: 0,
              },
            }}
          />
      );

  };

  renderBubble = props => {
    // alert(JSON.stringify(props.position))
    if (
      isSameUser(props.currentMessage, props.previousMessage) &&
      isSameDay(props.currentMessage, props.previousMessage)
    ) {
      return (
        <View>
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: '#269c26',
              },
              left: {},
            }}
            containerStyle={{
              left: {
                marginBottom: 5,
              },
            }}
          />
          <View
            style={{
              flexDirection: props.position === 'left' ? 'row' : 'row-reverse',
              alignItems: 'center',
            }}>
            {props.currentMessage._id !== this.state.messages[0]._id &&
              Object.entries(this.state.participants).map(
                (participant, index, arr) => {
                  if (
                    index <= 5 &&
                    props.currentMessage._id === participant.message_id
                  ) {
                    return (
                      <FastImage
                        key={`${participant[0]}_bobble_${
                          props.currentMessage._id
                          }`}
                        source={{
                          uri: `https://${config.api.uri}${
                            participant[1].avatar
                            }`,
                          // uri: (this.props.threads.threads[this.props.navigation.getParam('thread')].thread_type === 1) ? `https://tippinweb.com/${this.props.threads.threads[this.props.navigation.getParam('thread')].avatar}` : `https://tippinweb.com/api/v1${this.props.threads.threads[this.props.navigation.getParam('thread')].avatar}`,
                          headers: {
                            Authorization: `Bearer ${
                              this.props.auth.accessToken
                              }`,
                          },
                          // priority: FastImage.priority.high
                        }}
                        style={{
                          height: 14,
                          width: 14,
                          // marginRight:-8,
                          borderRadius: 7,
                          opacity: participant[1].online === 1 ? 1 : 0.5,
                          // marginTop:-6, //fix for avatar being 36x36
                        }}
                      />
                    );
                  } else if (
                    index === 6 &&
                    participant[0] !== props.currentMessage.user._id &&
                    props.currentMessage._id === participant.message_id
                  ) {
                    let overflow = arr.length - 6;
                    return (
                      <Text
                        key={`overflow_${props.currentMessage._id}`}
                        style={{
                          backgroundColor: '#d3d3d3',
                          color: '#FFF',
                          marginLeft: props.position === 'left' ? 4 : 0,
                          marginRight: props.position === 'left' ? 0 : 4,
                        }}>
                        +{overflow}
                      </Text>
                    );
                  }
                },
              )}
          </View>
        </View>
      );

    }
    return (
      <View style={{ marginTop: 10 }}>
        {props.currentMessage.user._id !== this.props.user.id && (
          <Text style={styles.name}>{props.currentMessage.user.name}</Text>
        )}
        {/* <Thumbnail  source={Images.cancelIcon} style={{ justifyContent: 'center' }}/> */}

        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: '#269c26',
            },
            left: {
              // margin:2,
            },
          }}
          containerStyle={{
            right: {},
            left: {
              marginBottom: 5,
            },
          }}
        />
        <View
          style={{
            flexDirection: props.position === 'left' ? 'row' : 'row-reverse',
            alignItems: 'center',
          }}>
          {props.currentMessage._id !== this.state.messages[0]._id &&
            Object.entries(this.state.participants).map(
              (participant, index, arr) => {
                if (
                  index <= 5 &&
                  participant[0] !== props.currentMessage.user._id &&
                  props.currentMessage._id === participant.message_id
                ) {
                  return (
                    <FastImage
                      key={`${participant[0]}_bobble`}
                      source={{
                        uri: `https://${config.api.uri}${
                          participant[1].avatar
                          }`,
                        headers: {
                          Authorization: `Bearer ${
                            this.props.auth.accessToken
                            }`,
                        },
                        // priority: FastImage.priority.high
                      }}
                      style={{
                        height: 14,
                        width: 14,
                        // marginRight:-8,
                        borderRadius: 7,
                        // borderWidth:1,
                        opacity: participant[1].online === 1 ? 1 : 0.5,
                        // marginTop:-6, //fix for avatar being 36x36
                      }}
                    />
                  );
                } else if (
                  index === 6 &&
                  participant[0] !== props.currentMessage.user._id &&
                  props.currentMessage._id === participant.message_id
                ) {
                  let overflow = arr.length - 6;
                  return (
                    <Text
                      key={`overflow_${props.currentMessage._id}`}
                      style={{
                        backgroundColor: '#b5a8a8',
                        color: '#FFF',
                        marginLeft: 4,
                      }}>
                      +{overflow}
                    </Text>
                  );
                }
              },
            )}
        </View>
      </View>
    )

  };

  renderImage = props => {
    return (
      <View style={{ backgroundColor: 'white' ,flexDirection:'row'}}>
        {props.position === 'right' ?
        <TouchableOpacity style={{top:0,left:0, margin:3, alignSelf:'flex-end'}} onPress={()=>this.downloadPkPassFile(props.currentMessage.image)}>
                <FontAwesome5 name="download" size={15} color="green" />
                {/* <Text style={{ color: 'white', textAlign: 'left', fontSize: hp('1.8%'), padding: 5, fontWeight: 'bold' }}>Download</Text>        */}
                </TouchableOpacity>
        : null }


        {/* <TouchableOpacity style={{position:'absolute',zIndex:1,left:0}}>
        <FontAwesome5 name="download" size={20} color="green" />
        </TouchableOpacity> */}

        <Lightbox
          activeProps={{ style:styles.imageActive
          }}
          >
          <FastImage
            style={[styles.image,]}
            resizeMode={FastImage.resizeMode.cover}
            source={{
              // uri: `https://${props.currentMessage.image}`,
              uri: props.currentMessage.image,
              headers: {
                Authorization: `Bearer ${this.props.auth.accessToken}`,
              },
              // priority: FastImage.priority.high,
            }}
          />
        </Lightbox>

        {Boolean(props.position === 'left') &&
        <TouchableOpacity style={{top:0,right:0, margin:3, alignSelf:'flex-end'}} onPress={()=>alert(JSON.stringify(props.currentMessage))}>
        <FontAwesome5 name="download" size={15} color="green" />
        {/* <Text style={{ color: 'white', textAlign: 'left', fontSize: hp('1.8%'), padding: 5, fontWeight: 'bold' }}>Download</Text>        */}
        </TouchableOpacity>}
      </View>
    );
  };

  renderVideo = props => {
    return (
      <View style={[styles.container]}>
        <Lightbox
          activeProps={{
            style: styles.imageActive,
          }}>
          <FastImage
            style={[styles.image]}
            source={{
              // uri: `https://${props.currentMessage.image}`,
              uri: props.currentMessage.image,
              headers: {
                Authorization: `Bearer ${this.props.auth.accessToken}`,
              },
              priority: FastImage.priority.high,
            }}
            resizeMode={'contain'}
          />
        </Lightbox>
      </View>
    );
  };

  renderFooter = props => {
    let typers = Object.values(this.state.participants).filter(
      (participant, index, arr) => {
        if (participant.typing) {
          return true;
        }
      },
    );
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 25,
        }}>
        <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
          {this.state.messages &&
            this.state.messages.length > 0 &&
            Object.entries(this.state.participants).map(
              (participant, index, arr) => {
                let self = false;
                Object.entries(this.state.messages).map(message => {
                  if (message[1]._id === participant[1].message_id) self = true;
                });
                if (
                  (index <= 5 &&
                    !participant[1].typing &&
                    this.state.messages[0]._id === participant[1].message_id) ||
                  self
                ) {
                  return (
                    <FastImage
                      key={`${participant[0]}_bobble`}
                      source={{
                        uri: `https://${config.api.uri}${
                          participant[1].avatar
                          }`,
                        // uri: (this.props.threads.threads[this.props.navigation.getParam('thread')].thread_type === 1) ? `https://tippinweb.com/${this.props.threads.threads[this.props.navigation.getParam('thread')].avatar}` : `https://tippinweb.com/api/v1${this.props.threads.threads[this.props.navigation.getParam('thread')].avatar}`,
                        headers: {
                          Authorization: `Bearer ${
                            this.props.auth.accessToken
                            }`,
                        },
                        // priority: FastImage.priority.high
                      }}
                      style={{
                        height: 14,
                        width: 14,
                        // marginRight:-8,
                        borderRadius: 7,
                        // borderWidth:1,
                        opacity: participant[1].online === 1 ? 1 : 0.5,
                        // marginTop:-6, //fix for avatar being 36x36
                      }}
                    />
                  );
                } else if (
                  index === 6 &&
                  !this.state.typers.hasOwnProperty(participant[0]) &&
                  props.currentMessage
                ) {
                  let overflow = arr.length - 6;
                  return (
                    <Text
                      key={
                        props.currentMessage
                          ? `overflow_${props.currentMessage._id}`
                          : ''
                      }
                      style={{
                        backgroundColor: '#b5a8a8',
                        color: '#FFF',
                        marginLeft: 4,
                      }}>
                      +{overflow}
                    </Text>
                  );
                }
              },
            )}
        </View>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          {Object.values(this.state.typers).length > 0 &&
            typers.map((typer, index, arr) => {
              if (index <= 5) {
                return (
                  <FastImage
                    style={{ height: 14, width: 14, borderRadius: 7 }}
                    key={`${typer.id}_typer_${index}`}
                    source={{
                      uri: `https://${config.api.uri}${typer.avatar}`,
                      headers: {
                        Authorization: `Bearer ${this.props.auth.accessToken}`,
                      },
                      priority: FastImage.priority.high,
                    }}
                  />
                );
              }
            })}
          {Object.values(this.state.typers).length > 0 && (
            <View style={{ marginLeft: 5 }}>
              <DotsLoader size={5} color={'#000'} betweenSpace={2.5} />
            </View>
          )}
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {},
  name: {
    fontSize: 12,
    color: '#878787',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 13,
    marginTop: 3, marginBottom: 3,
    resizeMode: 'cover',
  },
  imageActive: {
    flex: 1,
    resizeMode: 'cover',
  },
});

const mapStateToProps = state => {
  return {
    auth: state.auth,
    app: state.app,
    threads: state.threads,
    user: state.user,
    messages: state.messages,
    call: state.call,
  };
};

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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withSocketContext(withNavigationFocus(MessagesScreen)));

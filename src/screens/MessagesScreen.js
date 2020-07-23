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
  Keyboard,
  BackHandler,
} from 'react-native';
import Images from '../config/Images';
import Video from 'react-native-video';
import {Thumbnail} from 'react-native-thumbnail-video';
import YoutubePlayer from 'react-native-yt-player';
import VideoPlayer from 'react-native-video-player';
import YouTube from 'react-native-youtube';

// import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {
  Container,
  Header,
  Icon,
  Content,
  View,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Text,
  Title,
  Button,
} from 'native-base';
import {withNavigationFocus, TabRouter} from 'react-navigation';
import DeviceInfo, {hasNotch} from 'react-native-device-info';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {GiftedChat, InputToolbar, Send} from 'react-native-gifted-chat';
import Lightbox from 'react-native-lightbox';
import {emojify} from 'react-emojione';
import {withSocketContext} from '../components/Socket';
import {App, Auth, User, Threads, Messages, Call} from '../reducers/actions';
import {connect} from 'react-redux';
import FastImage from 'react-native-fast-image';
import Avatar from 'react-native-gifted-chat/lib/Avatar';
import Bubble from 'react-native-gifted-chat/lib/Bubble';
import Message from 'react-native-gifted-chat/lib/Message';
import MessageText from 'react-native-gifted-chat/lib/MessageText';
import {AllHtmlEntities as entities} from 'html-entities';
import {DotsLoader} from 'react-native-indicator';
import {isSameUser, isSameDay} from 'react-native-gifted-chat/lib/utils';
import config from '../config';
import Colors from '../config/Colors';
import CustomPickerView from '../components/PickerView';
import EmojiSelector, {Categories} from 'react-native-emoji-selector';
import DocumentPicker from 'react-native-document-picker';
import CustomModal from '../components/CustomModal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomViewPlayerView from '../components/CustomViewPlayerView';

// Import the react-native-sound module
var Sound = require('react-native-sound');
// Enable playback in silence mode
//Sound.setCategory('Playback');

class MessagesScreen extends Component<Props> {
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
    showEmoji: false,
    showModal: false,
    doc: false,
    showWebView: false,
    selectedLink: '',
    fullScreen: false,
    videoUri: '',
  };

  constructor(props) {
    super(props);
    this.echo = this.props.socket;
    this.typeInterval = 0;
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  async componentDidMount() {
    // const fetchUser = await this.props.getUser();
    // this.user = await fetchUser.payload.data;

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
    const {app} = this.props;
    //Is there an active call for this thread?
    let activeCall = null;
    if (
      app.heartbeat !== null &&
      app.heartbeat.data != null &&
      app.heartbeat.data.states &&
      app.heartbeat.data.states != null &&
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
    prevProps: Readonly<P>,
    prevState: Readonly<S>,
    snapshot: SS,
  ): void {
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
        if (
          update &&
          this.activeThread === this.props.navigation.getParam('thread')
        ) {
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
      });
    }

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
    const {app} = this.props;
    if (
      typeof app.heartbeat !== undefined &&
      app.heartbeat !== null &&
      app.heartbeat.data != null &&
      app.heartbeat.data.states &&
      app.heartbeat.data.states != null &&
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
          this.setState({activeCall: activeCall, renderMessage: true});
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
        });
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

  //     name: Rogelio Leffler
  // email: kamron63@example.com
  // pass: Flipsetter1!

  handleBackButtonClick() {
    if (this.state.showWebView) {
      this.setState({showWebView: false});
    } else {
      this.setState({showEmoji: false}, () => {
        this.props.navigation.goBack();
      });
    }
    return true;
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

  playSound = () => {
    var whoosh = new Sound('messagealert.mp3', Sound.MAIN_BUNDLE, error => {
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

  async onSend(message = []) {
    this.playSound();
    this.setState({openPicker: false, showEmoji: false});
    let messages = [
      ...this.props.messages.messages[this.props.navigation.getParam('thread')],
    ];

    // this.setState(prevState => ({
    //     messages: GiftedChat.append(prevState.messages, incoming),
    //     renderMessages: true,
    //     startedTyping: null,
    // }));
    // console.log(this.state.messages);
    //Set the message fast, we can update later
    let incoming = {
      _id: await message._id,
      createdAt: message.createdAt,
      text: emojify(entities.decode(message.text), {output: 'unicode'}),
      // image: 'data:image/jpeg;base64,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',

      //video:'https://youtu.be/LRcITExNvgg',
      user: {
        ...message.user,
        // name: response.payload.data.message.name,
      },
      temp_id: await message._id,
    };
    //add messages to store
    await this.props.addMessage(this.activeThread, incoming);
    let response = await this.props.sendMessage(
      this.props.navigation.getParam('thread'),
      message,
    );
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
      {typedMsg: newMsg},
      // , () => {
      //     this.inputTextChanged(newMsg)
      // }
    );
  };

  inputTextChanged = text => {
    this.setState({typedMsg: text});
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
  };
  openCamera = () => {
    this.setState({openPicker: false});
    ImagePicker.openCamera({
      cropping: true,
      width: 500,
      height: 500,
      multiple: true,
      cropperCircleOverlay: true,
      compressImageMaxWidth: 640,
      compressImageMaxHeight: 480,
      freeStyleCropEnabled: true,
      includeBase64: true,
    })
      .then(image => {
        alert('Captured Image ' + JSON.stringify(image.path));
      })
      .catch(e => {
        // alert(e)
      });
  };

  openGallery = () => {
    this.setState({openPicker: false});
    ImagePicker.openPicker({
      cropping: true,
      width: 300,
      height: 400,
      multiple: true,
      cropperCircleOverlay: true,
      freeStyleCropEnabled: true,
      avoidEmptySpaceAroundImage: true,
      includeBase64: true,
    })
      .then(image => {
        // console.log("imgggg "+JSON.stringify(image))
        this.setState({showModal: true, selectedImages: image});
      })
      .catch(e => {});
  };

  async pickDocument() {
    this.setState({openPicker: false});
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
      });
      // alert(JSON.stringify(results))
      this.setState({doc: true, showModal: true, selectedImages: results});
      let s = results.length > 1 ? 's' : '';
      // alert("You have selected " +results.length + " Document"+s)
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  }

  handleAddPicture = () => {
    const {user} = data; // wherever you user data is stored;
    const options = {
      title: 'Select Profile Pic',
      mediaType: 'photo',
      takePhotoButtonTitle: 'Take a Photo',
      maxWidth: 256,
      maxHeight: 256,
      allowsEditing: true,
      noData: true,
    };
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        // do nothing
      } else if (response.error) {
        // alert error
      } else {
        const {uri} = response;
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
    this.setState({showEmoji: true, openPicker: false});
  };

  customSystemMessage = props => {
    return (
      <View style={{flexDirection: 'row', alignSelf: 'center'}}>
        <TouchableOpacity
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            margin: 3,
          }}
          onPress={() => this.openEmoji()}>
          <Image
            source={Images.emojiIcon}
            style={{width: 28, height: 28, alignSelf: 'center'}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            margin: 3,
            alignSelf: 'center',
            justifyContent: 'center',
          }}
          onPress={() => this.setState({openPicker: true, showEmoji: false})}>
          <Image
            resizeMode="contain"
            source={Images.attachmentIcon}
            style={{width: 28, height: 28, alignSelf: 'center'}}
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
            style={{alignSelf: 'center'}}
          />
        </Send>
      </View>
    );
  };

  checkIfLink = link => {
    const reg = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
    if (reg.test(link) === true) {
      return true;
    } else {
      return false;
    }
  };
  onPressHashtag = (link, index) => {
    this.setState({showWebView: true, selectedLink: link});
    // console.log(a+" j "+b)
  };

  imageSelected = () => {
    this.setState({showModal: false, doc: false}, () => {
      let s = this.state.selectedImages.length > 1 ? 's' : '';
      alert(
        'You have selected ' + this.state.selectedImages.length + ' Image' + s,
      );
    });
  };

  cancelImage = index => {
    var array = this.state.selectedImages;
    array.splice(index, 1);
    if (array.length <= 0) {
      this.setState({showModal: false, doc: false, selectedImages: array});
    } else {
      this.setState({selectedImages: array});
    }
  };

  onFullScreen = fullScreen => {
    console.log('fullscreen ', fullScreen);
    this.setState({fullScreen});
  };

  goBack = () => {
    if (this.state.showWebView) {
      this.setState({showWebView: false});
    } else {
      this.setState({showEmoji: false}, () => {
        this.props.navigation.goBack();
      });
    }
  };
  render() {
    // if(!this.state.isLoading) {
    return (
      <Container>
        <Header>
          <Left style={{marginRight: 40}}>
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
              style={{width: 30, height: 30, borderRadius: 15}}
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
                <View style={{marginLeft: 15}}>
                  <FontAwesome5
                    name={'video'}
                    size={24}
                    color={'#FFF'}
                    onPress={() => this.startCall(1)}
                  />
                </View>
                <View style={{marginLeft: 30, marginRight: 15}}>
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
              // rel={true}
              // videoId={'Z1LmpiIGYNs'}
              play
              controls={1}
              // onProgress={(a)=>alert(a)}
              showinfo={false}
              videoId={this.state.videoUri}
              onReady={e => this.setState({isReady: true})}
              onChangeState={e => console.log(JSON.stringify(e))}
              onError={e => console.log(e.error)}
              style={{alignSelf: 'stretch', height: hp('30%'), margin: 5}}
            />
            {/* <Text onPress={()=>this.setState({showWebView:false})} style={{margin:5,padding:5,paddingTop:0,color:'white',fontSize:hp('5%'),}}>x</Text> */}
          </View>
        ) : null}

        <View style={{flex: 1}}>
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
              <Text size={15} style={{marginLeft: 5, color: '#FFFFFF'}}>
                There is an active{' '}
                {this.state.activeCall.call_type === 1
                  ? 'video call'
                  : 'whiteboard session'}
              </Text>
              <TouchableOpacity
                style={{marginRight: 25}}
                onPress={() => this.joinCall(this.state.activeCall)}>
                <Text style={{color: '#FFFFFF'}}>JOIN</Text>
              </TouchableOpacity>
            </View>
          )}
          <GiftedChat
            isInitialized={true}
            // parsePatterns={(linkStyle) => [
            //     { pattern: /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/, style: linkStyle,
            //    onPress :
            //     (key, index) => this.onPressHashtag(key, index) }
            //     ]}

            text={this.state.typedMsg}
            renderSend={props => this.customSystemMessage(props)}
            messages={this.state.messages}
            // messageIdGenerator={()=>}
            extraData={this.state.participants}
            alwaysShowSend={true}
            onSend={messages => this.onSend(messages[0])}
            focusTextInput={() => this.setState({showEmoji: false})}
            user={{
              _id: this.props.user.id,
              avatar: `https://${config.api.uri}` + this.props.user.avatar,
            }}
            // showUserAvatar
            renderLoading={() => <ActivityIndicator color="#0000ff" />}
            maxInputLength={350}
            onInputTextChanged={text => this.inputTextChanged(text)}
            renderTime={() => {
              return null;
            }}
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
            renderAvatar={this.renderAvatar}
            // onPressAvatar={()=>alert('hh')}
            renderBubble={this.renderBubble}
            renderMessageImage={this.renderImage}
            renderFooter={this.renderFooter}
            // bottomOffset={(DeviceInfo.hasNotch() && Platform.OS === 'ios') ? 0:}
          />
          {/*<KeyboardAvoidingView behavior={"padding"} keyboardVerticalOffset={48} enabled={(Platform.OS === 'android')}/>*/}
        </View>

        {this.state.openPicker ? (
          <CustomPickerView
            openGallery={() => this.openGallery()}
            openCamera={() => this.openCamera()}
            pickDocument={() => this.pickDocument()}
            cancel={() => this.setState({openPicker: false})}
          />
        ) : null}

        {this.state.showEmoji ? (
          <EmojiSelector
            columns={9}
            onEmojiSelected={emoji => this.addEmoji(emoji)}
            // onEmojiSelected={emoji => this.setState({typedMsg:emoji})}
            showSearchBar={true}
            showTabs={true}
            // aria-setsize={5}
            // showHistory={true}
            showSectionTitles={true}
            category={Categories.all}
          />
        ) : null}

        {this.state.showModal ? (
          <CustomModal
            doc={this.state.doc}
            data={this.state.selectedImages}
            imageSelected={() => this.imageSelected()}
            cancel={index => this.cancelImage(index)}
          />
        ) : null}
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
          headers: {Authorization: `Bearer ${this.props.auth.accessToken}`},
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
    // alert(JSON.stringify(props))
    let thumbNail = false;
    let youtube_id = '';
    if (this.checkIfLink(props.currentMessage.text)) {
      if (props.currentMessage.text.match('http://(www.)?youtube|youtu.be')) {
        youtube_id = props.currentMessage.text
          .split(/v\/|v=|youtu\.be\//)[1]
          .split(/[?&]/)[0];
        // alert(youtube_id)
      }
      thumbNail = true;
    }

    return thumbNail ? (
      <Thumbnail
        onPress={() => this.setState({showWebView: true, videoUri: youtube_id})}
        imageHeight={hp('15%')}
        imageWidth={wp('45%')}
        containerStyle={{
          margin: 5,
          flexDirection: props.position === 'left' ? 'row' : 'row-reverse',
        }}
        url={props.currentMessage.text}
      />
    ) : (
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
      <View style={{marginTop: 10}}>
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
    );
  };

  renderImage = props => {
    return (
      <View style={[styles.container]}>
        <Lightbox
          activeProps={{
            style: styles.imageActive,
          }}>
          <FastImage
            style={[styles.image]}
            source={{
              uri: `https://${props.currentMessage.image}`,
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
    // this.setState({showEmoji:false})
    // if(props.currentMessage){
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
          width: config.layout.window.width,
        }}>
        <View style={{flex: 1, flexDirection: 'row-reverse'}}>
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
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          {Object.values(this.state.typers).length > 0 &&
            typers.map((typer, index, arr) => {
              if (index <= 5) {
                return (
                  <FastImage
                    style={{height: 14, width: 14, borderRadius: 7}}
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
            <View style={{marginLeft: 5}}>
              <DotsLoader size={5} color={'#000'} betweenSpace={2.5} />
            </View>
          )}
        </View>
      </View>
    );
    // }
    // return (
    //     <View style={{flexDirection: 'row', alignItems: 'center', height: 25, width: config.layout.window.width}}>
    //     </View>
    // );
  };
}

const styles = StyleSheet.create({
  container: {},
  name: {
    fontSize: 12,
    color: '#878787',
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

const TopBar = ({play, fullScreen}) => (
  <View
    style={{
      alignSelf: 'center',
      position: 'absolute',
      top: 0,
      zIndex: 1,
    }}>
    {!fullScreen && <Text style={{color: '#FFF'}}> Custom Top bar</Text>}
  </View>
);

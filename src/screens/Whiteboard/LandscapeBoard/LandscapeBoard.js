import React from 'react';
import {Dimensions, PanResponder} from "react-native";
import find from "lodash/find";
import filter from "lodash/filter";
import get from "lodash/get";
import uuid from "react-native-uuid";
import Sound from 'react-native-sound';
import Svg from "react-native-svg";
import map from "lodash/map";
import simplify from "simplify-js";

import {
  Background, Container, SideMenu, WorkBoard, ShowSideMenuButton, BubbleInfo,
  TopWorkSide, BottomWorkSide, ShowDocManagerMenuButton, ShowChatButton,
  BottomLeftWorkSide, BottomRightWorkSide, ShowMicroPhoneButton, ShowCameraButton,
  DocumentWrapper, CameraLandscapeView, MessengerWrapper, SVGWrapper,
} from './styles';

import Shape from "../../../components/SvgShape";
import {backgrondPatterns} from "../../../consts/BackgroundPatterns";

const whoosh = new Sound('dingsoundeffect.mp3', Sound.MAIN_BUNDLE);

const screenWidth = (Math.round(Dimensions.get('window').width)) ? Math.round(Dimensions.get('window').width) : 0;
const screenHeight = (Math.round(Dimensions.get('window').height)) ? Math.round(Dimensions.get('window').height) : 0;

class LandscapeBoard extends React.Component{
  path = null;
  paths = [];

  state = {
    paths: [],
    path: null,
    shape: false,
    scale: {
      width: screenWidth,
      height: screenHeight,
      yOffset: null
    },
    users: [],
    showSideMenu: false,
    showCamera: false,
    showChat: false,
    showDocManagerMenu: false,
    showMicrophone: false,
    stateBackgroundImage: null,
  }

  _panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt, gestureState) => {
      if(!this.checkMove(gestureState)){
        if(!this.state.isMoving){
          this._touchStart(gestureState);
        }
      }
    },
    onPanResponderMove: (evt, gestureState) => {
      if(!this.state.isMoving){
        if(!this.state.shape) {
          this._touchMove(gestureState);
        }
      }
      else{
        this._moveShape(gestureState);
      }
    },
    onPanResponderTerminationRequest: () => true,
    onPanResponderRelease: (evt, gestureState) => {
      this._touchEnd(gestureState);
    },
    onShouldBlockNativeResponder: () => true,
  });

  constructor(props){
    super(props);

    this.echo = props.socket;
  }

  componentDidMount() {
    const { thread_id, call_id } = this.props

    if(typeof this.echo.socket.connector.channels[`presence-call_${thread_id}_${call_id}`] !== "undefined"){
      this.echo.socket.connector.channels[`presence-call_${thread_id}_${call_id}`].subscribe();
      this.call = this.echo.socket.connector.channels[`presence-thread_${thread_id}`];
    }
    else{
      this.call = this.echo.socket.join(`call_${thread_id}_${call_id}`)
    }
    if(this.call){
      this.listeners();
    }

  }

  componentWillUnmount(){
    // let route = 'thread/'+this.props.thread_id+'/update';
    // let response = Api.post(route, JSON.stringify({
    //     type: 'leave_call'
    // }));
    this.call.unsubscribe();
  }

  listeners(){
    this.call.listenForWhisper('start_draw', this.startDraw);
    this.call.listenForWhisper('draw', this.draw);
    this.call.listenForWhisper('end_draw', this.endDraw);
    this.call.listenForWhisper('clear_draw', this.clear);
  }


  inShape = (path, gestureState)  => {

    let mx = gestureState.x0;
    let my = gestureState.y0 - this.state.scale.yOffset;

    return (path.data[0].x - (path.data[0].width * path.zoom)/2 <= mx) && (path.data[0].x + (path.data[0].width * path.zoom)/2 >= mx)
      && (path.data[0].y - (path.data[0].height * path.zoom)/2 <= my) && (path.data[0].y + (path.data[0].height * path.zoom)/2 >= my);

  }

  checkMove = (gestureState) => {

    const { paths } = this.state

    let check = false;

    for(let i = 0; i <= paths.length - 1; i++){
      if(paths[i].type !== 1){
        if(this.inShape(paths[i], gestureState)){
          check = paths[i].id;
        }
      }
    }

    if(check){
      this.path = find(paths, path => path.id === check);

      this.setState({
        isMoving: true,
        path: filter(paths, path => path.id === check),
        paths: filter(paths, path => path.id !== check),
      });

      return true;
    }

    return false;

  }

  _touchStart = (gestureState) => {
    const { scale, shape } = this.state
    const { user, whiteboard } = this.props

    const color = get(whiteboard, 'color', '#024230')
    const width = get(whiteboard, 'width', 5)

    this.path = {
      color,
      width,
      scale,
      id: uuid.v1(),
      timestamp: (new Date).getTime(),
      user: {
        id: user.id,
        name: user.first + " " + user.last,
        type: 1,
      },
      data: [
        (shape) ? {x: gestureState.x0, y: (gestureState.y0 - scale.yOffset), height: 100, width: 100} : {x: gestureState.x0, y: (gestureState.y0 - scale.yOffset)},
      ],
      cap: "round",
      join: "round",
      type: (shape) ? shape : 1,
      zoom: 1,
    };

    if(!shape) {
      this.call.whisper('start_draw', this.path);
      this.setState({path: this.path});
    }
  }

  _touchMove = (gestureState) => {
    const { path, scale, shape } = this.state

    const newX = Math.floor(gestureState.moveX)
    const newY = Math.floor(gestureState.moveY - scale.yOffset)

    this.path.data.push({x: newX, y: newY});

    this.setState({path: this.path});

    if(!shape){
      let whisper = {...this.path};
      whisper.data = [{x: newX, y: newY}];
      this.call.whisper('draw', whisper);
    }

    return <Shape key={path.id} pathId={path.id} path={path} />
  }

  _touchEnd = () => {
    const {savePath, call} = this.props
    const {shape, paths} = this.state

    if(!shape) {
      this.call.whisper('end_draw', this.path);
      this.path.data = simplify(this.path.data, 1, true);
    }
    this.setState({
      isMoving: false,
      path: null,
      paths: [...paths, this.path],
    });
    savePath(call.threadId, call.id, this.path);
    this.path = null;
  }

  _moveShape = (gestureState) => {

    this.path.data = [ {x: gestureState.moveX, y: (gestureState.moveY - this.state.scale.yOffset), height: this.path.data[0].height, width: this.path.data[0].width},];

    this.setState({
      path: this.path,
    })
  }

  getDimensions = () => {
    this.setState({
      scale: {
        width: screenWidth,
        height: screenHeight,
        yOffset: 50
      }
    });
  }

  startDraw = (data) => {
    this.setState({
      users: [...this.state.users, {
        id: data.user.id,
        drawer: {...data},
      }],
    });
  };

  draw = (data) => {
    let user = this.state.users.filter(user => user.id === data.user.id)[0];
    let users = this.state.users.filter(user => user.id !== data.user.id);

    user.drawer.data.push(data.data[0]);

    this.setState({
      users: [...users, user],
    });
  }

  endDraw = (data) => {
    let user = this.state.users.filter(user => user.id === data.user.id)[0];
    let users = this.state.users.filter(user => user.id !== data.user.id);

    this.setState({
      paths: [...this.state.paths, user.drawer],
      users: [...users,],
    })
  }

  clear = () => {
    this.setState({
      paths: [],
    });
  }

  getBackgroundSource = () => {
    const { whiteboard } = this.props
    return get(find(backgrondPatterns, pattern => pattern.pathWeb === whiteboard.backgroundPattern), 'image', null)
  }

  toogleDocManagerMenu = () => this.setState({ showDocManagerMenu: !this.state.showDocManagerMenu })
  toogleChat = () => this.setState({ showChat: !this.state.showChat })
  toogleMicrophone = () => this.setState({ showMicrophone: !this.state.showMicrophone })
  toogleCamera = () => this.setState({ showCamera: !this.state.showCamera })
  toogleSideMenu = () => this.setState({ showSideMenu: !this.state.showSideMenu })

 render()  {
   const {
     showCamera,
     showChat,
     showDocManagerMenu,
     showMicrophone,
     showSideMenu,
     scale,
     users,
     paths,
   } = this.state

  return (
    <Background source={this.getBackgroundSource()}>
      <Container>
        {showSideMenu && <SideMenu />}
        <WorkBoard>
          <TopWorkSide>
            <ShowSideMenuButton
              forward={showSideMenu}
              onPress={() => this.toogleSideMenu(!showSideMenu)}
            />
            <ShowDocManagerMenuButton
              forward={showDocManagerMenu}
              onPress={() => this.toogleDocManagerMenu(!showDocManagerMenu)}
            />
          </TopWorkSide>
          <SVGWrapper
            {...this._panResponder.panHandlers}
            style={{flex: 1}}
            onLayout={(event) => this.getDimensions(event.nativeEvent.layout)}
          >
            <Svg style={{flex: 1}}>
              {
                map(paths, path =>(<Shape key={path.id} scale={scale} path={path} />))
              }
              {
                (this.path) &&
                <Shape
                  key={this.path.id}
                  scale={scale}
                  path={this.path}
                />

              }
              {map(users, user => <Shape key={user.drawer.id} scale={scale} path={user.drawer}/>)}
            </Svg>
          </SVGWrapper>
          <BottomWorkSide>
            <BottomLeftWorkSide>
              <ShowChatButton
                forward={showChat}
                onPress={() => this.toogleChat(!showChat)}
              />
              <BubbleInfo label="Dawson Wellman talking" />
            </BottomLeftWorkSide>
            <BottomRightWorkSide>
              <ShowMicroPhoneButton
                muted={showMicrophone}
                onPress={() => this.toogleMicrophone(!showMicrophone)}
              />
              <ShowCameraButton
                forward={showCamera}
                onPress={() => this.toogleCamera(!showCamera)}
              />
            </BottomRightWorkSide>
          </BottomWorkSide>
        </WorkBoard>
        <DocumentWrapper
          isOpen={showDocManagerMenu}
          onClose={() => this.toogleDocManagerMenu(!showDocManagerMenu)}
        />
        <MessengerWrapper
          isOpen={showChat}
          onClose={() => this.toogleChat(!showChat)}
        />
        { showCamera && (
          <CameraLandscapeView
            onClose={() => this.toogleCamera(!showCamera)}
          />
        )}
      </Container>
    </Background>
  )
}}

export default LandscapeBoard;

// const [showSideMenu, toogleSideMenu] = useState(false);
// const [showDocManagerMenu, toogleDocManagerMenu] = useState(false);
// const [showChat, toogleChat] = useState(false);
// const [showMicrophone, toogleMicrophone] = useState(false);
// const [showCamera, toogleCamera] = useState(false);
//
// useEffect(() => {
//   if (whoosh.isLoaded()) whoosh.stop(() => whoosh.play());
// }, [showDocManagerMenu, showCamera, showChat, showMicrophone]);

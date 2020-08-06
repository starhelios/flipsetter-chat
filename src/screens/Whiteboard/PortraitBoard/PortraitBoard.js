import React from 'react';
import {Dimensions, PanResponder, View} from "react-native";
import simplify from "simplify-js";
import uuid from "react-native-uuid";
import Svg from "react-native-svg";
import map from 'lodash/map';
import find from 'lodash/find';

import Shape from "../../../components/SvgShape";

import { backgrondPatterns } from '../../../consts/BackgroundPatterns';

import {
  Background, Container, FooterMenu, WorkBoard, BubbleInfo, BottomLeftWorkSide,
  TopWorkSide, BottomWorkSide, ShowDocManagerMenuButton, ShowChatButton,
  TopLeftWorkSide, BottomRightWorkSide, ShowMicroPhoneButton, ShowCameraButton,
  MessangerWrapper, DocumentWrapper, WebCamBlock, SVGWrapper,
} from './styles';

const screenWidth = (Math.round(Dimensions.get('window').width)) ? Math.round(Dimensions.get('window').width) : 0;
const screenHeight = (Math.round(Dimensions.get('window').height)) ? Math.round(Dimensions.get('window').height) : 0;

class PortraitBoard extends React.Component {
  path = null;
  paths = [];

  state = {
    color: "#000",
    width: 5,
    paths: [],
    path: null,
    shape: false,
    scale: {
      width: screenWidth,
      height: screenHeight,
      yOffset: null
    },
    users: [],
    showCamera: false,
    showChat: false,
    showDocManagerMenu: false,
    showMicrophone: false,
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
    if(typeof this.echo.socket.connector.channels[`presence-call_${this.props.thread_id}_${this.props.call_id}`] !== "undefined"){
      this.echo.socket.connector.channels[`presence-call_${this.props.thread_id}_${this.props.call_id}`].subscribe();
      this.call = this.echo.socket.connector.channels[`presence-thread_${this.props.thread_id}`];
    }
    else{
      this.call = this.echo.socket.join(`call_${this.props.thread_id}_${this.props.call_id}`)
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
    this.call.listenForWhisper('change_back_pattern', console.tron.log);
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

    let check = false;
    let current = this.state.paths;
    for(let i = 0; i <= current.length - 1; i++){
      if(current[i].type !== 1){
        if(this.inShape(current[i], gestureState)){
          check = current[i].id;
        }
      }
    }

    if(check){
      this.path = this.state.paths.filter(path => path.id === check)[0];

      this.setState({
        isMoving: true,
        path: this.state.paths.filter(path => path.id === check),
        paths: this.state.paths.filter(path => path.id !== check),
      });

      return true;
    }

    return false;

  }

  _touchStart = (gestureState) => {
    this.path = {
      id: uuid.v1(),
      timestamp: (new Date).getTime(),
      user: {
        id: this.props.user.id,
        name: this.props.user.first + " " + this.props.user.last,
        type: 1,
      },
      data: [
        (this.state.shape) ? {x: gestureState.x0, y: (gestureState.y0 - this.state.scale.yOffset), height: 100, width: 100} : {x: gestureState.x0, y: (gestureState.y0 - this.state.scale.yOffset)},
      ],
      cap: "round",
      join: "round",
      color: this.state.color,
      width: this.state.width,
      type: (this.state.shape) ? this.state.shape : 1,
      scale: this.state.scale,
      zoom: 1,
    };
    if(!this.state.shape) {
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
    console.tron.log(this.path)
    savePath(call.threadId, call.id, this.path);
    this.path = null;
  }

  _moveShape = (gestureState) => {

    this.path.data = [ {x: gestureState.moveX, y: (gestureState.moveY - this.state.scale.yOffset), height: this.path.data[0].height, width: this.path.data[0].width},];

    this.setState({
      path: this.path,
    })
  }

  showColorMenu = async() =>{
    if(this.state.shapeMenuVisible){ this.showShapeMenu();}
    this.setState({
      colorMenuVisible: !this.state.colorMenuVisible,
    });
  }

  showShapeMenu = async() =>{
    if(this.state.colorMenuVisible){ this.showColorMenu();}
    this.setState({
      shapeMenuVisible: !this.state.shapeMenuVisible,
      shape: false,
    });
  }

  updateColorSelection = (color) => {
    if(this.state.color === color){
      this.setState({
        colorMenuVisible:false,
      });
      return;
    }
    this.setState({ color: color });
  }

  updateShapeSelection = (shape) => {

    if(this.state.shape === shape){
      this.setState({
        shapeMenuVisible:false,
        shape:false,
      });
      return;
    }

    this.setState({ shape: shape });
  }

  getDimensions(){
    this.setState({
      scale: {
        width: screenWidth,
        height: screenHeight,
        yOffset: 100
      }
    });
  }

  clearCanvas = () => {
    this.setState({
      paths: [],
    });
    this.call.whisper('clear_draw', true);
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
    find(backgrondPatterns, () => null)
  }

  toogleDocManagerMenu = () => this.setState({ showDocManagerMenu: !this.state.showDocManagerMenu })
  toogleChat = () => this.setState({ showChat: !this.state.showChat })
  toogleMicrophone = () => this.setState({ showMicrophone: !this.state.showMicrophone })
  toogleCamera = () => this.setState({ showCamera: !this.state.showCamera })

  render() {
    const {
      showCamera,
      showChat,
      showDocManagerMenu,
      showMicrophone,
      scale,
      users,
      paths,
    } = this.state

    return (
      <Background source={this.getBackgroundSource()}>
        <Container>
          <WorkBoard>
            <TopWorkSide>
              <TopLeftWorkSide />
              <BubbleInfo label="Dawson Wellman talking" />
              <ShowDocManagerMenuButton
                forward={showDocManagerMenu}
                onPress={this.toogleDocManagerMenu}
              />
            </TopWorkSide>
            <SVGWrapper {...this._panResponder.panHandlers} style={{flex: 1}} onLayout={(event) => this.getDimensions(event.nativeEvent.layout)}>
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
                  onPress={this.toogleChat}
                />
              </BottomLeftWorkSide>
              <BottomRightWorkSide>
                <ShowMicroPhoneButton
                  muted={showMicrophone}
                  onPress={this.toogleMicrophone}
                />
                <ShowCameraButton
                  forward={showCamera}
                  onPress={this.toogleCamera}
                />
              </BottomRightWorkSide>
            </BottomWorkSide>
          </WorkBoard>
          {showCamera && <WebCamBlock />}
          <FooterMenu />
          <MessangerWrapper
            isOpen={showChat}
            onClose={this.toogleChat}
          />
          <DocumentWrapper isOpen={showDocManagerMenu} />
        </Container>
      </Background>
    );
  }


}

export default PortraitBoard;

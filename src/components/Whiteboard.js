import React from 'react';
import {StatusBar, Alert, ScrollView, StyleSheet, View, TouchableOpacity, TouchableHighlight, Button, Text, PanResponder, Dimensions, SafeAreaView } from 'react-native';
import {Container, Header, Left, Right, Body} from "native-base";
import {withSocketContext} from "../components/Socket";
import Icon from "react-native-vector-icons/FontAwesome5";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import ShapeMenu from "../components/Menus/ShapeMenu";
import ColorMenu from "../components/Menus/ColorMenu";
import Shape from "../components/SvgShape";
import Svg, {Path} from 'react-native-svg';
import simplify from 'simplify-js';
import uuid from "react-native-uuid";
// import Api from "../service/Api";
import FontAwesome from "react-native-vector-icons/FontAwesome5";

const screenWidth = (Math.round(Dimensions.get('window').width)) ? Math.round(Dimensions.get('window').width) : 0;
const screenHeight = (Math.round(Dimensions.get('window').height)) ? Math.round(Dimensions.get('window').height) : 0;

class Whiteboard extends React.Component{
    isMoving = false;
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
    }

    constructor(props){
        super(props);
        this.echo = this.props.socket.socket;
        this.call = this.echo.join('call_'+this.props.thread_id+'_'+this.props.call_id);

        this._panResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            // onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
            // onMoveShouldSetPanResponder: (evt, gestureState) => true,
            // onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,

            onPanResponderGrant: (evt, gestureState) => {
                // The gesture has started. Show visual feedback so the user knows
                // what is happening!
                // gestureState.d{x,y} will be set to zero now
                if(!this.checkMove(gestureState)){
                    if(!this.state.isMoving){
                        this._touchStart(gestureState);

                    }
                }
                else{
                    // console.log('move');
                }


            },
            onPanResponderMove: (evt, gestureState) => {
                // The most recent move distance is gestureState.move{X,Y}
                // The accumulated gesture distance since becoming responder is
                // gestureState.d{x,y}


                if(!this.state.isMoving){
                    //Drawing a simple Path
                    if(!this.state.shape) {
                        this._touchMove(gestureState);
                        // console.log("draw path");
                    }

                }
                else{
                    //we're moving a shape

                    this._moveShape(gestureState);
                    // console.log("move shape");
                }



            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                // The user has released all touches while this view is the
                // responder. This typically means a gesture has succeeded
                // this.tempDraw();
                this._touchEnd(gestureState);
                // console.log("touch end");
            },
            onPanResponderTerminate: (evt, gestureState) => {
                // Another component has become the responder, so this gesture
                // should be cancelled
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                // Returns whether this component should block native components from becoming the JS
                // responder. Returns true by default. Is currently only supported on android.
                return true;
            },
        });

        this.listeners();
    }

    componentDidUpdate(){
        // console.log(this.state.users);
        // console.log('update');

    }

    componentWillUnmount(){
        let route = 'thread/'+this.props.thread_id+'/update';
        let response = Api.post(route, JSON.stringify({
            type: 'leave_call'
        }));
    }

    listeners(){
        this.call.listenForWhisper('start_draw', this.startDraw);
        this.call.listenForWhisper('draw', this.draw);
        this.call.listenForWhisper('end_draw', this.endDraw);
        this.call.listenForWhisper('clear_draw', this.clear);
    }

    render(){
        return(
                <View {...this._panResponder.panHandlers} style={{flex: 1}} onLayout={(event) => {this.getDimensions(event.nativeEvent.layout)}}>
                    <SafeAreaView style={{flexDirection: "row", justifyContent: "space-around", alignItems: "center", borderWidth:1, width: screenWidth}}>
                        <TouchableOpacity
                            style={{width: 40}}
                            onPress={() => this.props.navigation.goBack()}
                        >
                            <Icon type={"FontAwesome5"} name={"chevron-left"} size={30} style={{color: '#000', }}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.clearCanvas}
                            style={{backgroundColor: '#000', justifyContent: "center", alignItems: "center", width: 60, height: 25}}
                        >
                            <Text style={{color: "#FFF"}}>Clear</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{width: 40}}
                            onPress={() => {
                                this.props.muteMic()
                            }}
                        >
                            <View style={{justifyContent:"center", alignItems: "center",}} >
                                <Icon type='FontAwesome5' name={(this.props.microphone) ? "microphone" : "microphone-slash"} size={30} style={{justifyContent:"center", alignItems: "center", textAlign: "center", }} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{width: 32, marginLeft: 20,}}
                            onPress={() => {
                                this.showColorMenu()
                            }}
                        >
                            <Icon
                                name="circle"
                                size={30}
                                style={{
                                    width: 30,
                                    backgroundColor: this.state.color,
                                    height: 30,
                                    borderRadius: 15,
                                    borderColor: "#000000",
                                    borderWidth: 1,
                                    overflow: "hidden"
                                }}
                                color={this.state.color}

                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{width: 32, marginLeft: 20,}}
                            onPress={() => {
                                this.showShapeMenu()
                            }}
                        >
                            <Icon
                                name={"shapes"}
                                size={30}
                                style={{}}
                            />
                        </TouchableOpacity>
                    </SafeAreaView>
                    <View style={{flex: 1}}>
                    {
                        this.state.colorMenuVisible &&
                        <ColorMenu
                            onChange={this.updateColorSelection.bind(this)}
                            paletteStyles={{zIndex: 10, alignItems: 'center'}}
                            color={this.state.color}
                            close={() => {
                                this.setState({colorMenuVisible: false})
                            }}
                        />
                    }
                    {
                        this.state.shapeMenuVisible &&
                        <ShapeMenu
                            onChange={this.updateShapeSelection.bind(this)}
                            paletteStyles={{zIndex: 10, alignItems: 'center'}}
                            shape={this.state.shape}
                            color={this.state.color}
                            close={() => {
                                this.setState({shapeMenuVisible: false, shape: null,})
                            }}
                        />
                    }
                    <Svg style={{flex: 1}} >
                        {
                            (this.state.paths) &&
                            this.state.paths.map(path => {
                                return (<Shape
                                        key={path.id}
                                        scale={this.state.scale}
                                        // removePath={this.removePath.bind(this)}
                                        // pathId={path.id}
                                        // type={path.type}
                                        path={path}
                                    />
                                )})
                        }
                        {
                            (this.path) &&
                            <Shape
                                key={this.path.id}
                                scale={this.state.scale}
                                path={this.path}
                            />

                        }
                        {
                            (this.state.users) &&
                            this.state.users.map(user => <Shape
                                key={user.drawer.id}
                                scale={this.state.scale}
                                // removePath={this.removePath.bind(this)}
                                // pathId={path.id}
                                // type={path.type}
                                path={user.drawer}
                            />)
                        }
                    </Svg>
                    </View>
                </View>
        );
    }

    inShape = (path, gestureState)  => {


        // switch(path.type){
        //     case 2:
        let mx = gestureState.x0;
        let my = gestureState.y0 - this.state.scale.yOffset;
        // console.log(path);

        // console.log((path.data[0].x - (path.data[0].width * path.zoom)/2 <= mx) && (path.data[0].x + (path.data[0].width * path.zoom)/2 >= mx)
        //     && (path.data[0].y - (path.data[0].width * path.zoom)/2 <= my) && (path.data[0].y + (path.data[0].width * path.zoom)/2 >= my));
        return (path.data[0].x - (path.data[0].width * path.zoom)/2 <= mx) && (path.data[0].x + (path.data[0].width * path.zoom)/2 >= mx)
            && (path.data[0].y - (path.data[0].height * path.zoom)/2 <= my) && (path.data[0].y + (path.data[0].height * path.zoom)/2 >= my);
        // break;
        // }

    }

    checkMove = (gestureState) => {

        let check = false;
        let current = this.state.paths;
        // console.log(current);
        for(let i = 0; i <= current.length - 1; i++){
            if(current[i].type !== 1){
                if(this.inShape(current[i], gestureState)){
                    //always grab the "newest" or shape highest on the stack
                    check = current[i].id;
                }
            }
        }

        if(check){
            // console.log(this.state.paths.filter(path => path.id === check)[0]);
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
        // console.log(this.state.scale);
        this.path = {
            id: uuid.v1(),
            timestamp: (new Date).getTime(),
            user: {
                id: this.props.user.user_id,
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

        this.path.data.push({x: Math.floor(gestureState.moveX), y: Math.floor(gestureState.moveY - this.state.scale.yOffset)});
        this.setState({
            path: this.path,
        });
        if(!this.state.shape){
            let whisper = {...this.path}; whisper.data = [{x: Math.floor(gestureState.moveX), y: Math.floor(gestureState.moveY - this.state.scale.yOffset)}];
            this.call.whisper('draw', whisper);
        }
        return <Shape
            key={this.state.path.id}
            // removePath={this.removePath.bind(this)}
            pathId={this.state.path.id}
            // type={this.state.path.type}
            path={this.state.path}
        />
    }

    _touchEnd = (gestureState) => {
        if(!this.state.shape) {
            this.call.whisper('end_draw', this.path);
            this.path.data = simplify(this.path.data, 1, true);
        }
        this.setState({
            isMoving: false,
            path: null,
            paths: [...this.state.paths, this.path],
        });
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

    getDimensions(layout){

        this.setState({
            scale: {
                width: screenWidth,
                height: screenHeight,
                yOffset: 100
            }
        });
    }

    clearCanvas = () => {
        // this.ctx.canvas.width = screenWidth;
        this.setState({
            paths: [],
        });
        this.call.whisper('clear_draw', true);
    }

    //Whisper Functions
    startDraw = (data) => {
        // console.log(data);
        this.setState({
            users: [...this.state.users, {
                id: data.user.id,
                drawer: {...data},
            }],
        });
    };

    draw = (data) => {
        //Get Active Drawer
        let user = this.state.users.filter(user => user.id === data.user.id)[0];
        let users = this.state.users.filter(user => user.id !== data.user.id);

        user.drawer.data.push(data.data[0]);

        this.setState({
            users: [...users, user],
        });
    }

    endDraw = (data) => {
        //Get Active Drawer so we can add user's drawer to path
        let user = this.state.users.filter(user => user.id === data.user.id)[0];
        let users = this.state.users.filter(user => user.id !== data.user.id);

        // user.drawer.data.push(data.data[0]);
        console.log(user);
        this.setState({
            paths: [...this.state.paths, user.drawer],
            users: [...users,],
        })
    }

    clear = (data) => {
        // console.log(data);
        this.setState({
            paths: [],
        });
    }

}

export default withSocketContext(Whiteboard);
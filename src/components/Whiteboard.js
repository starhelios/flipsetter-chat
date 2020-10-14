import React from 'react';
import { View, TouchableOpacity, Text, PanResponder, Dimensions, SafeAreaView } from 'react-native';
import {connect} from "react-redux";
import {withNavigationFocus} from "react-navigation";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Svg from 'react-native-svg';
import simplify from 'simplify-js';
import uuid from "react-native-uuid";

import ShapeMenu from "../components/Menus/ShapeMenu";
import ColorMenu from "../components/Menus/ColorMenu";
import Shape from "../components/SvgShape";
import {withSocketContext} from "./Socket";
import {Friends, Call} from "../reducers/actions";

const screenWidth = (Math.round(Dimensions.get('window').width)) ? Math.round(Dimensions.get('window').width) : 0;
const screenHeight = (Math.round(Dimensions.get('window').height)) ? Math.round(Dimensions.get('window').height) : 0;

class Whiteboard extends React.Component{
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
        this.call.listenForWhisper('end_draw', this.endDraw);
        this.call.listenForWhisper('clear_draw', this.clear);
    }

    render(){
        return(
                <View {...this._panResponder.panHandlers} style={{flex: 1}} onLayout={(event) => {this.getDimensions(event.nativeEvent.layout)}}>
                    <SafeAreaView style={{flexDirection: "row", justifyContent: "space-around", alignItems: "center", borderWidth:1, width: screenWidth}}>
                        <TouchableOpacity
                            style={{width: 40}}
                            onPress={() => this.props.navigation.navigate('Messages', {
                                thread: this.props.thread_id,
                                callEnded: true,
                            })}

                        >
                            <FontAwesome5 name={"chevron-left"} size={30} style={{color: '#000', }}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.clearCanvas}
                            style={{backgroundColor: '#000', justifyContent: "center", alignItems: "center", width: 60, height: 25}}
                        >
                            <Text style={{color: "#FFF"}}>Clear</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{width: 40}}
                            onPress={this.props.muteMic}
                        >
                            <View style={{justifyContent:"center", alignItems: "center",}} >
                                <FontAwesome5 name={(this.props.microphone) ? "microphone" : "microphone-slash"} size={30} style={{justifyContent:"center", alignItems: "center", textAlign: "center", }} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{width: 32, marginLeft: 20,}}
                            onPress={() => {
                                this.showColorMenu()
                            }}
                        >
                            <FontAwesome5
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
                            onPress={this.showShapeMenu}
                        >
                            <FontAwesome5 name="shapes" size={30} />
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

    _touchEnd = () => {
        if(!this.state.shape) {
            this.call.whisper('end_draw', this.path);
            this.path.data = simplify(this.path.data, 1, true);
        }
        this.setState({
            isMoving: false,
            path: null,
            paths: [...this.state.paths, this.path],
        });
        this.props.savePath(this.props.call.threadId, this.props.call.id, this.path);
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
        console.log("start draw", data);
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

}


const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        app: state.app,
        user: state.user,
        friends: state.friends,
        call: state.call,
    }
}

const mapDispatchToProps = {
    getList: Friends.getList,
    savePath: Call.savePath,
    callHeartbeat: Call.callHeartbeat,
};

export default connect(mapStateToProps, mapDispatchToProps)(withSocketContext(withNavigationFocus(Whiteboard)))

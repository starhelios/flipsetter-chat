import React, {Component} from 'react';
import {connect} from "react-redux";
import RNCallKeep, {CONSTANTS} from "react-native-callkeep";
import {PermissionsAndroid} from 'react-native';
import {Call} from "../reducers/actions/";
import NavigationService from "./NavigationService";

class CallService extends Component<Props> {

    constructor(props) {
        super(props);
        // console.log(this.props);

    }

    async  componentDidMount(): void {
        this._listeners();
        await RNCallKeep.setup({
           ios: {
               appName: 'FlipSetter',
               supportsVideo: true,
           },
           android: {
               alertTitle: 'Permissions required',
               alertDescription: 'This application needs to access your contacts',
               cancelButton: 'Cancel',
               okButton: 'ok',
               additionalPermissions: [PermissionsAndroid.PERMISSIONS.READ_CONTACTS]
           }
        });
        RNCallKeep.setAvailable(true);
        // console.log(this.props.navigator.mediaDevices.enumerateDevices())

    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
        if(this.props.call.status === "active" &&
            this.props.call.id && this.props.call.roomId && this.props.call.roomPin &&
            this.props.call.type === 1 && this.props.call.callerName && this.props.call.threadId
        ){
            // console.log(this.props.call);
            // We're in a call
        }
        if(!this.props.call.status && this.props.app.route === "Call"){
            NavigationService.navigate("Threads");
        }
        console.log("call",this.props.call);
        if(this.props.call.status === 'declined'){
            this.reportEndCallWithUUID(this.props.call.id, CONSTANTS.END_CALL_REASONS.ANSWERED_ELSEWHERE);
        }
    }

    _listeners(){
        // Add RNCallKeep Events
        RNCallKeep.addEventListener('didReceiveStartCallAction', this.didReceiveStartCallAction);
        RNCallKeep.addEventListener('answerCall', this.onAnswerCallAction);
        RNCallKeep.addEventListener('endCall', this.onEndCallAction);
        RNCallKeep.addEventListener('didDisplayIncomingCall', this.onIncomingCallDisplayed);
        RNCallKeep.addEventListener('didPerformSetMutedCallAction', this.onToggleMute);
        RNCallKeep.addEventListener('didToggleHoldCallAction', this.onToggleHold);
        RNCallKeep.addEventListener('didPerformDTMFAction', this.onDTMFAction);
        RNCallKeep.addEventListener('didActivateAudioSession', this.audioSessionActivated);
    }

    // Use startCall to ask the system to start a call - Initiate an outgoing call from this point
    startCall = ({ handle, localizedCallerName }) => {
        // Your normal start call action
        RNCallKeep.startCall(this.props.calls.id, handle, localizedCallerName);
    };

    reportEndCallWithUUID = (callUUID, reason) => {
        RNCallKeep.reportEndCallWithUUID(callUUID, reason);
    }

    // Event Listener Callbacks

    didReceiveStartCallAction = (data) => {
        let { handle, callUUID, name } = data;
        console.log("ReceiveStartCallAction", data);
        // Get this event after the system decides you can start a call
        // You can now start a call from within your app
    };

    onAnswerCallAction = (data) => {
        let { callUUID } = data;
        console.log("Answered", data);
        this.props.setCallId(callUUID);
        this.props.setCallStatus("active");
        NavigationService.navigate('Call');
        // console.log(this.props.call);
        // Called when the user answers an incoming call
    };

    onEndCallAction = (data) => {
        let { callUUID } = data;
        // RNCallKeep.endCall(this.props.calls.id);
        console.log("end_call");
        this.props.setCallId(null);
        this.props.setCallStatus(null);
        this.props.setCallType(0);
        this.props.setCallRoom(null);
        this.props.setCallRoomPin(null);
        this.props.setCallerName(null);
        this.props.setCallThreadId(null);
        NavigationService.navigate('Threads');
    };

    // Currently iOS only
    onIncomingCallDisplayed = (data) => {
        let { error } = data;
        // You will get this event after RNCallKeep finishes showing incoming call UI
        // You can check if there was an error while displaying
    };

    onToggleMute = (data) => {
        let { muted, callUUID } = data;
        // Called when the system or user mutes a call
    };

    onToggleHold = (data) => {
        let { hold, callUUID } = data;
        // Called when the system or user holds a call
    };

    onDTMFAction = (data) => {
        let { digits, callUUID } = data;
        // Called when the system or user performs a DTMF action
    };

    audioSessionActivated = (data) => {
        // you might want to do following things when receiving this event:
        // - Start playing ringback if it is an outgoing call
    };

    render(){
        return null;
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        app: state.app,
        call: state.call,
    }
};

const mapDispatchToProps = {
    setCallId: Call.setCallId,
    setCallStatus: Call.setCallStatus,
    setCallType: Call.setCallType,
    setCallRoom: Call.setCallRoom,
    setCallRoomPin: Call.setCallRoomPin,
    setCallerName: Call.setCallerName,
    setCallThreadId: Call.setCallThreadId,
}

export default connect(mapStateToProps, mapDispatchToProps)(CallService)
import React from 'react';
import {View} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Dimensions, Text, TouchableOpacity} from "react-native";
const screenWidth = Math.round(Dimensions.get('window').width);

export default class ShapeMenu extends React.Component{

    render(){
        let onChange = this.props.onChange;
        return(
            <View style={{zIndex: 10,flex:1, flexDirection: 'row', width: (screenWidth) ? screenWidth: 0, position: 'absolute', justifyContent: 'space-evenly', backgroundColor:"grey"}}>

                <TouchableOpacity
                    onPress={() => {this.props.onChange(2)}}
                    style={{alignItems: 'center', backgroundColor:this.props.color, width:30, height:30, marginLeft:20, marginVertical:screenWidth*.025, borderRadius:2, borderWidth:1, borderColor: '#000000', overflow:'hidden'}}
                >
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {this.props.onChange(3)}}
                    style={{alignItems: 'center',  width:30, height:30, marginLeft:20, borderRadius:15, borderWidth:2, borderColor: this.props.color, overflow:'hidden'}}
                >
                </TouchableOpacity>

            </View>
        );
    }
}

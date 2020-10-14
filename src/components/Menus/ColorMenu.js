import React from 'react';
import {View} from 'native-base';
import ColorPalette from "react-native-color-palette";
import Icon from 'react-native-vector-icons';
import {Dimensions, Text, TouchableHighlight} from "react-native";
const screenWidth = Math.round(Dimensions.get('window').width);

export default class ColorMenu extends React.Component{


    render(){
        let onChange = this.props.onChange;
        return(
          <View style={{flex:1, flexDirection: 'row', zIndex: 10, position: 'absolute', width: screenWidth, justifyContent: 'space-evenly', alignItems: 'center'}}>
            <ColorPalette
                onChange={color => onChange(color)}
                value={this.props.color}
                title={''}
                colors={['black','red', 'blue', 'green', 'yellow', 'orange']}
                paletteStyles={{...this.props.paletteStyles, marginLeft:0, marginTop:0}}

            />
          </View>
        );
    }
}

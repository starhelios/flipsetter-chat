import React from 'react';
import {Alert} from 'react-native';
import {Svg, G, Circle as Circle1} from 'react-native-svg';


export default class Square extends React.Component{
    constructor(props){
        super(props);
    }

    renderShape(){
        let path = this.props.path;

        let width = (path.data[0].width * path.zoom);
        let height = (path.data[0].height * path.zoom);

        return(
            <Circle1 strokeWidth={path.width} stroke={path.color} cx={path.data[0].x} cy={path.data[0].y} r={width/2} fill={'none'}/>
        );
    }
    render(){
        return this.renderShape();
    }
}
import React from 'react';
import {Alert} from 'react-native';
import {Svg, G, Path as Path1, Rect as Rect1} from 'react-native-svg';


export default class Square extends React.Component{
    constructor(props){
        super(props);
    }

    renderShape(){
        let path = this.props.path;

        let width = (path.data[0].width * path.zoom);
        let height = (path.data[0].height * path.zoom);

        return(
            <Rect1 fill='none' strokeWidth={path.width} stroke={path.color} width={width} height={height} x={path.data[0].x - ((width)/2)} y={path.data[0].y - ((height)/2)}/>
        );
    }
    render(){
        return this.renderShape();
    }
}
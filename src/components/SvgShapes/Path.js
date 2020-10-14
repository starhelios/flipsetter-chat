import React from 'react';
import { Path as Path1 } from 'react-native-svg';

export default class Path extends React.Component {
  getSVGPath(rawPoints) {
    let svgPath = `M ${Math.round((rawPoints[0].x / this.props.path.scale.width) * this.props.scale.width)} ${Math.round((rawPoints[0].y / (this.props.path.scale.height - this.props.scale.yOffset)) * (this.props.scale.height - this.props.scale.yOffset))}`;
    const len = rawPoints.length;

    if (len < 1) {
      return null;
    }
    for (let i = 1; i < len; i++) {
      svgPath = `${svgPath} L${Math.round((rawPoints[i].x / this.props.path.scale.width) * this.props.scale.width)} ${Math.round((rawPoints[i].y / (this.props.path.scale.height - this.props.scale.yOffset)) * (this.props.scale.height - this.props.scale.yOffset))}`;
    }

    return svgPath;
  }

  renderShape() {
    const { path } = this.props;// console.log(path);
    const d = this.getSVGPath(path.data);
    if (d == null) {
      return null;
    }

    return (<Path1 fill="none" strokeWidth={path.width} stroke={path.color} d={d} strokeLinecap="round" />);
  }

  render() {
    return this.renderShape();
  }
}

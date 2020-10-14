import React from 'react';
import uuid from 'react-native-uuid';

import Path from './SvgShapes/Path';
import Square from './SvgShapes/Square';
import Circle from './SvgShapes/Circle';

export default class Shape extends React.Component {
  constructor(props) {
    super(props);
  }

  renderShape() {
    switch (this.props.path.type) {
      case 1:
        return (
          <Path
                            // removePath={this.props.removePath}
            pathId={this.props.path.id}
            scale={this.props.scale}
                            // type={this.props.type}
            path={this.props.path}
          />
        );
      case 2:
        return (
          <Square
                            // removePath={this.props.removePath}
            pathId={this.props.path.id}
            scale={this.props.scale}
                            // shape={this.props.shape}
            path={this.props.path}
          />
        );
      case 3:
        return (
          <Circle
                    // removePath={this.props.removePath}
            pathId={this.props.path.id}
            scale={this.props.scale}
                    // shape={this.props.shape}
            path={this.props.path}
          />
        );
    }
  }

  render() {
    return this.renderShape();
  }
}

import { connect } from 'react-redux';

import { Whiteboard } from '../../../reducers/actions';

import Component from './EraserSizeMenu';

const mapStateToProps = (state) => {
  return {
    whiteboard: state.whiteboard,
  };
};

const mapDispatchToProps = {
  onChangeWidth: Whiteboard.setBrushWeight,
  onChangeColor: Whiteboard.setBrushColor,
};

export const EraserSizeMenu = connect(mapStateToProps, mapDispatchToProps)(Component);

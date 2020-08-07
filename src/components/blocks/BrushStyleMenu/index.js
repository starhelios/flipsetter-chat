import { connect } from 'react-redux';

import { Whiteboard } from '../../../reducers/actions';

import Component from './BrushStyleMenu';

const mapStateToProps = (state) => {
  return {
    whiteboard: state.whiteboard,
  };
};

const mapDispatchToProps = {
  onChangeWidth: Whiteboard.setBrushWeight,
};

export const BrushStyleMenu = connect(mapStateToProps, mapDispatchToProps)(Component);

import { connect } from 'react-redux';

import { Whiteboard } from '../../../reducers/actions';

import Component from './SelectColorMenu';

const mapStateToProps = (state) => {
  return {
    whiteboard: state.whiteboard,
  };
};

const mapDispatchToProps = {
  onChangeColor: Whiteboard.setBrushColor,
};

export const SelectColorMenu = connect(mapStateToProps, mapDispatchToProps)(Component);

import { connect } from 'react-redux';

import { Call, Whiteboard } from '../../../../reducers/actions';

import Component from './BackgroundPatternModal';

const mapStateToProps = (state) => {
  return {
    user: state.user,
    call: state.call,
  };
};

const mapDispatchToProps = {
  onSavePath: Call.savePath,
  onChangeBackground: Whiteboard.setBackgroundPattern,
};

export const BackgroundPatternModal = connect(mapStateToProps, mapDispatchToProps)(Component);

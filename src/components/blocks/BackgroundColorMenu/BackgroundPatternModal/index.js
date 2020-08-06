import { connect } from 'react-redux';
import { Call } from '../../../../reducers/actions';

import Component from './BackgroundPatternModal';

const mapStateToProps = (state) => {
  return {
    user: state.user,
    call: state.call,
  };
};

const mapDispatchToProps = {
  onSavePath: Call.savePath,
};
export const BackgroundPatternModal = connect(mapStateToProps, mapDispatchToProps)(Component);

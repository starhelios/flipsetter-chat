import { connect } from 'react-redux';
import { compose } from 'redux';
import { withNavigationFocus } from 'react-navigation';

import { withSocketContext } from '../../components/Socket';

import { Call, Friends, Whiteboard } from '../../reducers/actions';

import Component from './Whiteboard';

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    app: state.app,
    user: state.user,
    friends: state.friends,
    call: state.call,
    whiteboard: state.whiteboard,
  };
};

const mapDispatchToProps = {
  initReset: Whiteboard.reset,
  getList: Friends.getList,
  savePath: Call.savePath,
  callHeartbeat: Call.callHeartbeat,
};

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  withSocketContext,
  withNavigationFocus,
)(Component);

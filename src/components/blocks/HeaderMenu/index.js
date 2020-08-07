import { connect } from 'react-redux';

import Component from './HeaderMenu';

const mapStateToProps = ({ call }) => {
  return {
    call,
  };
};

export const HeaderMenu = connect(mapStateToProps)(Component);

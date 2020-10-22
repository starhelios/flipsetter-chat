import * as React from 'react';

import {
  Alert,
  StyleSheet,
  Platform,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  Container,
  Header,
  Icon,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text,
  Title,
} from 'native-base';

import moment from 'moment';
import {connect} from 'react-redux';
import {withSocketContext} from '../Socket';
import FastImage from 'react-native-fast-image';
import {emojify} from 'react-emojione';
import NavigationService from '../../services/NavigationService';
import config from '../../config';

class ThreadList extends React.PureComponent {
  state = {
    activeCall: false,
  };

  constructor(props) {
    super(props);
    // console.log("threadList", this.props.thread.recent_message.message_type, this.props.thread);
    // console.log("TLIST", this.props);
    // console.log(this.props.thread.thread_type);
    // console.log(this.props.thread.name)
    // console.log((this.props.thread.thread_type === 1) ? `https://tippinweb.com/${this.props.avatar}` : `https://tippinweb.com/api/v1${this.props.thread.avatar}`);
  }

  componentDidMount(): void {
    // console.log("Thread",  this.props.app.heartbeat.data.states.active_calls);
    console.log('this.props');
    console.log(this.props);
    const {app} = this.props;
    //const {active_calls} = app.heartbeat.data.states;

    if (
      app.heartbeat != null &&
      app.heartbeat.data != null &&
      app.heartbeat.data.states &&
      app.heartbeat.data.states != null &&
      app.heartbeat.data.states.active_calls != null
    ) {
      this.activeCall =
        this.props.app.heartbeat &&
        typeof this.props.app.heartbeat.data.states.active_calls !== 'undefined'
          ? this.props.app.heartbeat.data.states.active_calls.filter(call => call.thread_id === this.props.thread.thread_id)[0]
          : null;

      if (this.activeCall) {
        this.setState({
          activeCall: true,
        });
      }
    }
  }

  componentDidUpdate(
    prevProps: Readonly<P>,
    prevState: Readonly<S>,
    snapshot: SS,
  ): void {
    const {app} = this.props;
    if (this.props.app.route === 'Threads') {
      if (
        app.heartbeat != null &&
        app.heartbeat.data != null &&
        app.heartbeat.data.states &&
        app.heartbeat.data.states != null &&
        app.heartbeat.data.states.active_calls != null &&
        typeof app.heartbeat !== 'undefined'
      ) {
        this.activeCall =
          this.props.app.heartbeat &&
          typeof this.props.app.heartbeat.data.states.active_calls !== 'undefined'
            ? this.props.app.heartbeat.data.states.active_calls.filter(call => call.thread_id === this.props.thread.thread_id)[0]
            : null;

        if (this.activeCall) {
          this.setState({
            activeCall: true,
          });
        }
      }
    }
  }

  _onPress = () => {
    // NavigationService.navigate("Messages", {
    //     thread: this.props.thread_id,
    // })
    //Still set active Thread JIC
    this.props.onPressItem(this.props.thread_id);
    // this.props.navigation.navigate("Messages", {
    //     thread: this.props.thread_id,
    // })
  };

  render() {
    let date = moment(this.props.updated_at).isSame(moment(), 'd')
      ? moment(this.props.updated_at).format('h:mm')
      : moment(this.props.updated_at).format('ddd h:mm');

      console.log({
        uri: `https://${config.api.uri}${this.props.thread.avatar}`,
        headers: {Authorization: `Bearer ${this.props.auth.accessToken}`},
        priority: FastImage.priority.normal,
      });

    return (
      <ListItem thumbnail onPressOut={this._onPress}>
        <Left>
          <FastImage
            source={{
              uri: `https://${config.api.uri}${this.props.thread.avatar}`,
              headers: {Authorization: `Bearer ${this.props.auth.accessToken}`},
              priority: FastImage.priority.normal,
            }}
            style={{width: 56, height: 56}}
          />
        </Left>
        <Body>
          <Text
            style={{fontWeight: this.props.thread.unread ? '700' : 'normal'}}>
            {this.props.name}
          </Text>
          {this.state.activeCall && this.activeCall ? (
            <Text>
              There is an active{' '}
              {this.activeCall.call_type === 1
                ? 'video call'
                : 'whiteboard session'}
            </Text>
          ) : (
            <Text
              note
              numberOfLines={2}
              style={{
                fontWeight: this.props.thread.unread ? '700' : 'normal',
                color: '#000',
              }}>
              {this.props.thread.thread_type === 2 &&
                this.props.thread.recent_message.message_type !== 89 &&
                this.props.thread.recent_message.message_type !== 90 &&
                `${this.props.thread.recent_message.name}: `}
              {this.props.latest_message ??
                emojify(this.props.latest_message, {output: 'unicode'})}
            </Text>
          )}
        </Body>
        <Right>
          <Text note>{date}</Text>
        </Right>
      </ListItem>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    app: state.app,
    user: state.user,
  };
};

export default connect(mapStateToProps)(withSocketContext(ThreadList));

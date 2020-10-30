import React, {Component} from 'react';
import {
  SectionList,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Animated,
  Easing,
  UIManager,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Text,
  Title,
  View,
  Button
} from 'native-base';
import {connect} from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {withNavigationFocus} from 'react-navigation';

import {withSocketContext} from '../components/Socket';
import {App, Auth, User, Threads, Messages} from '../reducers/actions';
import SearchBar from '../components/SearchBar';
import ShareMenuThreadList from '../components/share-menu/ShareMenuThreadList';
import config from '../config';
import NavigationService from '../services/NavigationService';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

class ShareMenuScreen extends Component {
  headerHeight = 0;
  state = {
    isloading: true,
    refreshing: false,
    searchResults: null,
    focused: false,
    listData: {},
    searchHidden: true,
    // searchTimeout: null,
    keyboard: false,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    SplashScreen.hide();
  }

  _searchFocused = (focused) => {
    console.log('focused', focused);
    this.setState({
      focused: focused,
      searchHidden: !focused,
    });
  };


  listData = () => {
    //init threads
    let threads = [];
    //Grab search query and turn it into a regex for searching through threads
    let query = this.props.search.query
      ? new RegExp(this.props.search.query.split(' ').join('|'), 'i')
      : null;

    //if query is set loop through threads and see what matches
    if (query) {
      threads = Object.values(this.props.threads.threads).filter((thread) => {
        if (query.test(thread.name)) {
          return true;
        }
      });
      //eventually loop through threads and check body for match, comes later
    } else {
      //else return all threads because we haven't sorted
      threads = Object.values(this.props.threads.threads);
    }

    return threads.map(({name, thread_id, avatar}) => ({
      avatar,
      avatarSourceData: {
        uri: `https://${config.api.uri}${avatar}`,
        headers: {Authorization: `Bearer ${this.props.auth.accessToken}`},
      },
      name,
      id: thread_id,
    }));
  };

  handleShareClick = (threadId) => {
    const { navigation } = this.props;

    if (!navigation.state.params?.data) {
      const data = {...this.props.toUploadFilesIos};
      console.debug('final', this.props.toUploadFilesIos);

      this.props.updateToUploadFilesIos({
        data: [],
        mimeType: null
      })

      navigation.navigate('Messages', {
        dataToShare: data,
        thread: threadId
      })

    } else {
      navigation.navigate('Messages', {
        dataToShare: navigation.state.params.data,
        thread: threadId
      })
    }


  };

  render() {
    return (
      <Container>
        <Header onLayout={(event) => this.headerHeight}>
          <Left style={{flex: 1}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Button style={{paddingRight: 20}} title="" transparent onPress={() => NavigationService.navigate('Main')}>
                <FontAwesome5 name={'chevron-left'} size={24} color={'#FFF'} />
              </Button>
              <Title>Share with:</Title>
            </View>
          </Left>
          <Body style={{flex: 1}} />
          <Right style={{flex: 1, marginRight: 0}}>
          </Right>
        </Header>
        <Animated.View
          style={{
            height: this.searchHeight,
          }}>
          <SearchBar
            focused={this._searchFocused}
            hidden={this.state.searchHidden}
          />
        </Animated.View>

        <ShareMenuThreadList
          list={this.listData()}
          onSendClick={this.handleShareClick}
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  resultsContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#a2d',
  },
});

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    app: state.app,
    user: state.user,
    threads: state.threads,
    search: state.search,
    toUploadFilesIos: state.messages.toUploadFilesIos
  };
};

const mapDispatchToProps = {
  appHeartbeat: App.appHeartbeat,
  setErrorMsg: App.setErrorMsg,
  setIsLoading: App.setIsLoading,
  setAccessToken: Auth.setAccessToken,
  setIsLoggedIn: Auth.setIsLoggedIn,
  getThreads: Threads.getThreads,
  storeThreads: Threads.storeThreads,
  setActiveThread: Threads.setActiveThread,
  getUser: User.getUser,
  getMessages: Messages.getMessages,
  updateToUploadFilesIos: Messages.updateToUploadFilesIos
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withSocketContext(withNavigationFocus(ShareMenuScreen)));

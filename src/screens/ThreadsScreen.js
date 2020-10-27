import React, {Component} from 'react';
import {
  SectionList,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Animated,
  Easing,
  UIManager,
  Linking
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
} from 'native-base';
import {connect} from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {withNavigationFocus} from 'react-navigation';

import ThreadList from '../components/threads/ThreadList';
import {withSocketContext} from '../components/Socket';
import {App, Auth, User, Threads, Messages} from '../reducers/actions';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import ShareMenu from 'react-native-share-menu';
import NavigationService from '../services/NavigationService';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

class ThreadsScreen extends Component<Props> {
  headerHeight = 0;
  state = {
    threads: {...this.props.threads.threads},
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
    this.searchHeight = new Animated.Value(this.props.search.query ? 50 : 0);
    // this.activeCalls = setInterval(() => {
    //     if(this.props.app.heartbeat && this.props.app.heartbeat.data.states.active_calls.length > 1){
    //         this.props.appHeartbeat();
    //     }
    // }, 30000);
    // console.log(this.props);
    //
    // this.setState({
    //
    // })
  }


  handleOpenURL =  (e) =>  {
    console.debug('handleopenurl', e);
  }

  async componentDidMount(): void {

    try {
      if(Platform.OS === 'ios'){
        Linking.addEventListener('url', this.handleOpenURL);
      }
    } catch (error) {
      console.error(error)
    }

    

    await ShareMenu.getInitialShare((data) => {
      console.debug('data1', data)
      if (data) {
        NavigationService.navigate('ShareMenu', {
          data,
        });
      }

    });

    await ShareMenu.addNewShareListener((data) => {
      console.debug('data2', data)
      if (data) {
        NavigationService.navigate('ShareMenu', {
          data,
        });
      }
    });

    const {navigation} = this.props;

    this.focusListener = navigation.addListener('didFocus', async () => {
      let update = await this.props.getThreads();
      console.log('Update Threads', update);
      if (update.type === 'GET_THREADS_SUCCESS') {
        this.setState({
          threads: {...this.props.threads.threads},
        });
      }
    });

    let update = await this.props.getThreads();
    // this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
    // this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide);
    console.log('Update Threads', update);
    //lets grab the current rendered threads as well
    // let threads = this.state.threads;

    // update.map(thread => threads[thread.thread_id] = thread);

    //update threads in redux
    // this.props.storeThreads(threads);

    //Set the state to trigger the update
    if (update.type === 'GET_THREADS_SUCCESS') {
      this.setState(
        {
          threads: {...this.props.threads.threads},
        },
        SplashScreen.hide(),
      );
    }
  }

  componentWillUnmount(): void {
    // if(this.props.threads.activeThread){this.props.setActiveThread(null)}
    // this.keyboardDidHideListener.remove();
    // this.keyboardDidShowListener.remove();
    // clearInterval(this.activeCalls);
    this.focusListener.remove();
  }

  async componentDidUpdate(
    prevProps: Readonly<P>,
    prevState: Readonly<S>,
    snapshot: SS,
  ): void {
    if (prevProps.isFocused !== this.props.isFocused && this.props.isFocused) {
      //Update Threads
      // await this.props.getThreads();
      // console.log("focused Threads");
      // this.componentDidMount();
    }
    if (this.state.refreshing) {
      this.setState({
        // threads: threads,
        refreshing: false,
      });
    }
    if (this.props.navigation.getParam('newMessage')) {
      let thread = this.props.navigation.getParam('newMessage');
      this.props.navigation.setParams({newMessage: null});
      this.props.navigation.navigate('Messages', {
        thread: this.props.navigation.getParam('newMessage'),
      });
    }
    const {app} = this.props;
    if (
      app.heartbeat !== null &&
      app.heartbeat.data != null &&
      app.heartbeat.data.states &&
      app.heartbeat.data.states != null &&
      app.heartbeat.data.states.active_calls != null
    ) {
      if (
        typeof this.props.app.heartbeat.data !== 'undefined' ||
        prevProps.app.heartbeat.data.states.active_calls.length !==
          this.props.app.heartbeat.data.states.active_calls.length
      ) {
        this.activeCalls = setInterval(() => {
          if (
            this.props.app.heartbeat &&
            this.props.app.heartbeat.data.states.active_calls.length > 1
          ) {
            this.props.appHeartbeat();
          }
        }, 30000);
      }
      //Clear Interval
      if (this.props.app.heartbeat.data.states.active_calls.length === 0) {
        clearInterval(this.activeCalls);
      }
    }
  }

  // keyboardDidShow = (event) => {
  //     if(this.state.isFocused){
  //         this.setState(state =>({
  //             keyboard: !state.keyboard,
  //         }))
  //     }
  // }
  //
  // keyboardDidHide = (event) => {
  //     if(this.props.isFocused){
  //         this.setState(state => ({
  //             keyboard:!state.keyboard,
  //         }));
  //     }
  // }

  showSearch = (event) => {
    if (event === 'toggle') {
      //Button
      this.setState(
        (state) => ({
          searchHidden: !state.searchHidden,
        }),
        Animated.timing(this.searchHeight, {
          toValue: !this.state.searchHidden ? 0 : 50,
          duration: 100,
          easing: Easing.linear,
        }).start(),
      );
    } else if (
      event.nativeEvent.contentOffset.y &&
      event.nativeEvent.contentOffset.y > 0
    ) {
      this.setState({
        searchHidden: true,
      });
      Animated.timing(this.searchHeight, {
        toValue: 0,
        duration: 0,
        easing: Easing.linear(),
      }).start();
    }
    // console.log(this.state.searchHeight);
  };

  refreshThreads = async () => {
    this.setState({
      refreshing: true,
    });

    let refresh = await this.props.getThreads();
    if (refresh.type === 'GET_THREADS_SUCCESS') {
      this.setState({
        refreshing: false,
      });
    }
  };

  _renderItem = (data) => {
    // console.log("render",data);
    let item = data.item;
    switch (data.section.title) {
      case 'contacts':
        return <SearchResults item={item} />;
      case 'threads':
        return (
          <ThreadList
            thread_id={item.thread_id}
            avatar={item.avatar}
            name={item.name}
            latest_message={item.recent_message.body}
            updated_at={item.updated_at}
            onPressItem={this._onPressItem}
            title={item.name}
            thread={item}
          />
        );
    }
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

    let list = [
      {
        title: 'threads',
        data: threads,
      },
    ];

    if (
      Object.values(this.props.search.results).length > 0 ||
      this.props.search.query
    ) {
      list.unshift({
        title: 'contacts',
        data: Object.values(this.props.search.results),
      });
    }

    return [
      {
        title: 'contacts',
        data: Object.values(this.props.search.results),
      },
      {
        title: 'threads',
        data: threads,
      },
    ];
  };

  _onPressItem = (item) => {
    //Store active thread for app state, also marks thread as read

    // this.props.setActiveThread(item);

    this.props.navigation.navigate('Messages', {
      thread: item,
    });
  };

  _searchFocused = (focused) => {
    console.log('focused', focused);
    this.setState({
      focused: focused,
      searchHidden: !focused,
    });
  };

  render() {
    return (
      <Container>
        <Header onLayout={(event) => this.headerHeight}>
          <Left style={{flex: 1}}>
            <Title>Messages</Title>
          </Left>
          <Body style={{flex: 1}} />
          <Right style={{flex: 1, marginRight: 0}}>
            <TouchableOpacity
              onPress={() => this.showSearch('toggle')}
              style={{width: 30}}>
              <FontAwesome5
                name={'search'}
                style={{
                  fontSize: 24,
                  color: '#FFF',
                }}
              />
            </TouchableOpacity>
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

        <View
          style={{
            backgroundColor: this.state.focused ? 'rgba(0,0,0,0.3)' : '#FFF',
            opacity: this.state.focused && !this.props.search.query ? 0.5 : 1,
            flex: 1,
          }}>
          <SectionList
            sections={this.listData()}
            keyExtractor={(item) =>
              item.thread_id ? `thread_${item.thread_id}` : `search_${item.id}`
            }
            renderItem={this._renderItem}
            renderSectionHeader={({section}) => {
              if (this.props.search.query) {
                return (
                  <Text style={{fontSize: 25, flex: 1, flexDirection: 'row'}}>
                    {section.title.charAt(0).toUpperCase() +
                      section.title.slice(1)}
                  </Text>
                );
              }
            }}
            renderSectionFooter={({section}) => {
              if (section.title === 'contacts' && section.data.length > 0) {
                return <View style={{marginBottom: 25}} />;
              }
            }}
            stickySectionHeadersEnabled={true}
            style={{flex: 1}}
            onRefresh={this.refreshThreads}
            refreshing={this.state.refreshing}
            onScroll={this.showSearch}
            initialNumToRender={15} //Render first 15 quickly, stops flicker on threads refresh
            // scrollEventThrottle={500}
          />
        </View>
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withSocketContext(withNavigationFocus(ThreadsScreen)));

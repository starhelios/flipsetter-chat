import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
//
import TabBarIcon from '../components/tabbar/TabBarIcon';

// Main Tab Screens
import ThreadsScreen from '../screens/ThreadsScreen';
import ContactsScreen from '../screens/ContactsScreen';
// import EventsScreen from '../screens/EventsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ShareMenuScreen from '../screens/ShareMenuScreen';

// Threads Stack
import MessagesScreen from '../screens/MessagesScreen';
import CallScreen from '../screens/CallScreen';

// import CanvasScreen from '../screens/CanvasScreen';
// import SvgScreen from '../screens/SvgScreen';

import TabBar from '../components/tabbar/TabBar';
//
const ThreadsStack = createStackNavigator({
  Threads: ThreadsScreen,
  Messages: MessagesScreen,
  ShareMenu: ShareMenuScreen
}, {

});

ThreadsStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
    tabBarLabel: 'Threads',
    tabBarIcon: ({ focused }) => (
      <TabBarIcon
        focused={focused}
        name={Platform.OS === 'ios' ? 'comment' : 'comment'}
      />
    ),
  };
};

const ContactsStack = createStackNavigator({
  Contacts: ContactsScreen,
}, {
  headerMode: 'screen',
});

ContactsStack.navigationOptions = {
  tabBarLabel: 'Contacts',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'address-book' : 'address-book'}
    />
  ),
};

// const EventsStack = createStackNavigator({
//     Events: EventsScreen,
// },{
//     headerMode: 'screen',
// });
//
// EventsStack.navigationOptions = {
//     tabBarLabel: 'Events',
//     tabBarIcon: ({ focused }) => (
//         <TabBarIcon
//             focused={focused}
//             name={Platform.OS === 'ios' ? 'calendar' : 'calendar'}
//         />
//     ),
// };

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
}, {
  headerMode: 'screen',
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name="cog"
    />
  ),
};

export default createBottomTabNavigator({
  ThreadsStack,
  ContactsStack,
  // EventsStack,
  SettingsStack,

}, {
  tabBarComponent: (props) => (
    <TabBar
      {...props}
    />
  ),
  tabBarOptions: {
    showLabel: false,
    keyboardHidesTabBar: false,

  },

});

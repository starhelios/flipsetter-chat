import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';

import CallScreen from '../screens/CallScreen';

const CallStack = createStackNavigator({
    Call: CallScreen,
},{
    headerMode: "none",
});

export default CallStack
import React from 'react';
import { Platform } from 'react-native';
import {createSwitchNavigator} from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';

import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import ForgotScreen from "../screens/Auth/ForgotScreen";

const AuthStack = createStackNavigator({
    Login: LoginScreen,
    Register: RegisterScreen,
    Forgot: ForgotScreen,
},{
    headerMode: 'none',
});

export default AuthStack;
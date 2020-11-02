import { createAppContainer, createSwitchNavigator, } from 'react-navigation';
import AuthLoadingScreen from '../screens/Auth/AuthLoadingScreen';

import MainTabNavigator from './MainTabNavigator';
import AuthStack from './AuthStack';
import CallStack from './CallStack';
import WhiteboardStack from './WhiteboardStack';

import ShareMenu from '../screens/ShareMenuScreen';

import { createStackNavigator } from 'react-navigation-stack';

const MainStack = createStackNavigator({
  Main: MainTabNavigator,
}, {
  initialRouteName: 'Main',
  headerMode: 'none',
});

export default createAppContainer(createSwitchNavigator(
  {
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    ShareMenu: ShareMenu,
    AuthLoading: AuthLoadingScreen,
    Main: MainStack,
    WhiteboardStack,
    Auth: AuthStack,
    Call: CallStack,
  },
  {
    initialRouteName: 'AuthLoading',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#24422e',
      },
    },
  },
));

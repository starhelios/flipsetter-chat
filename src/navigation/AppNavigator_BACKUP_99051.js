import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator} from "react-navigation-stack";
import AuthLoadingScreen from '../screens/Auth/AuthLoadingScreen';

import MainTabNavigator from './MainTabNavigator';
import AuthStack from './AuthStack';
import CallStack from './CallStack';
import WhiteboardStack from './WhiteboardStack';

export default createAppContainer(createSwitchNavigator(
  {
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    AuthLoading: AuthLoadingScreen,
    Main: MainTabNavigator,
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
  }
));

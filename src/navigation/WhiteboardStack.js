import { createStackNavigator } from 'react-navigation-stack';

import WhiteboardScreen from '../screens/Whiteboard';

const WhiteboardStack = createStackNavigator({
  Whiteboard: WhiteboardScreen,
}, {
  initialRouteName: 'Whiteboard',
  headerMode: 'none',
});

export default WhiteboardStack;

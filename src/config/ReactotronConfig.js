import Reactotron, { trackGlobalErrors, networking } from 'reactotron-react-native';

Reactotron
  .configure({
    name: 'RN Chat', // would you like to see your app's name?
  })
  .useReactNative() //

// forward all errors to Reactotron
  .use(trackGlobalErrors({
    // ignore all error frames from react-native (for example)
    veto: (frame) => frame.fileName.indexOf('/node_modules/react-native/') >= 0,
  }))
  .use(networking())

// let's connect!
  .connect();

// Totally hacky, but this allows you to not both importing reactotron-react-native
// on every file.  This is just DEV mode, so no big deal.
console.tron = Reactotron;

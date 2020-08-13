const Sound = require('react-native-sound');

export function playSound() {
  const whoosh = new Sound('tabmusic.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      return;
    }
    whoosh.play();
  });
}

export function ringPhn() {
  playSound();
}

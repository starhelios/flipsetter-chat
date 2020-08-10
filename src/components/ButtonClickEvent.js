import React from 'react';
import {
    
    View, Vibration,Platform
} from 'react-native';
import RingerMode from 'react-native-ringer-mode';
var Sound = require('react-native-sound');


export function ringPhn(){
     if(Platform.OS === 'android'){
    RingerMode.getRingerMode()
    .then(mode => {
      switch(mode){
        case 'NORMAL': 
        playSound()  ;   
        return ;
        case 'SILENT':
        return;
        case 'VIBRATE':
        Vibration.vibrate(1000);
        return;
        default :
        return;
      }
    });
}
else
{
    playSound();
}   
}


export function  playSound (){
    var whoosh = new Sound('tabmusic.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      // loaded successfully
      console.log(
        'duration in seconds: ' +
        whoosh.getDuration() +
        'number of channels: ' +
        whoosh.getNumberOfChannels(),
      );
      // Play the sound with an onEnd callback
      whoosh.play(success => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    });
  };
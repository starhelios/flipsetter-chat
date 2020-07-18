import React from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';

const ActivityLoader = props => {
  return (
    <View style={styles.loader}>
    <MaterialIndicator color='#04b600'  style={{alignSelf:'center',}} size={60}/>

    </View>
  );
};
export default ActivityLoader;
const styles = StyleSheet.create({
  loader: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    zIndex:1,
    justifyContent: "center",
  }
});

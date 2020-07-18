import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import YoutubePlayer from "react-native-yt-player";

export default class CustomViewPlayerView extends Component {
    onFullScreen = fullScreen => {
        console.log("fullscreen ", fullScreen);
    };
    render() {
        return (
            <View style={{ paddingTop: 60 }}>
                <YoutubePlayer
                    loop
                    topBar={TopBar}
                    videoId="Z1LmpiIGYNs"
                    autoPlay
                    onFullScreen={this.onFullScreen}
                    onStart={() => console.log("onStart")}
                    onEnd={() => alert("on End")}
                />

                <View>
                    <Text>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi,
                        aspernatur rerum, deserunt cumque ipsam unde nam voluptatum tenetur
                        cupiditate veritatis autem quidem ad repudiandae sapiente odit
                        voluptates fugit placeat ut!
              </Text>
                </View>
            </View>
        );
    }
}

const TopBar = ({ play, fullScreen }) => (
    <View
        style={{
            alignSelf: "center",
            position: "absolute",
            top: 0
        }}
    >
        <Text style={{ color: "#FFF" }}> Custom Top bar</Text>
    </View>
);
import React, {Component} from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';

import FastImage from 'react-native-fast-image';

export class ShareMenuThreadItem extends Component {
  render() {
    const {data, onSendClick} = this.props;

    console.log(data.avatarSourceData);

    return (
      <View style={styles.container}>
        <FastImage
          source={{
            ...data.avatarSourceData,
            priority: FastImage.priority.normal,
          }}
          style={{width: 45, height: 45, borderRadius: 45 / 2}}
        />
        <View style={styles.rightBlock}>
          <View style={styles.nameWrapper}>
            <Text style={styles.name}>{data.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.btn}
            onPress={onSendClick}
            title="Send">
            <Text style={styles.btnText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default ShareMenuThreadItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  rightBlock: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    paddingVertical: 0,
    paddingHorizontal: 10,
  },
  nameWrapper: {flex: 1},
  name: {fontWeight: '600', fontSize: 16, paddingRight: 10},
  btn: {
    backgroundColor: '#509450',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  btnText: {fontWeight: '700', color: 'white'},
});

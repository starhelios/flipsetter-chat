import React, {Component} from 'react';
import {Text, View, FlatList} from 'react-native';

import ShareMenuThreadItem from './ShareMenuThreadItem';

export class ShareMenuThreadList extends Component {
  render() {
    const {list} = this.props;

    return (
      <FlatList
        data={list}
        keyExtractor={({id}) => id}
        renderItem={({item}) => {
          return <ShareMenuThreadItem data={item} onSendClick={() => {}} />;
        }}
      />
    );
  }
}

export default ShareMenuThreadList;

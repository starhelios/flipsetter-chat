import React, {Component} from 'react';
import {Text, View, FlatList} from 'react-native';

import ShareMenuThreadItem from './ShareMenuThreadItem';

export class ShareMenuThreadList extends Component {
  render() {
    const {list, onSendClick} = this.props;

    return (
      <FlatList
        data={list}
        keyExtractor={({id}) => id}
        renderItem={({item}) => {
          return (
            <ShareMenuThreadItem
              data={item}
              onSendClick={() => onSendClick(item.id)}
            />
          );
        }}
      />
    );
  }
}

export default ShareMenuThreadList;

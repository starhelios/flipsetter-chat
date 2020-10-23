import React, {Component} from 'react';
import {
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  View,
  StyleSheet,
} from 'react-native';
import {
  Container,
  Header,
  ListItem,
  Left,
  Body,
  Right,
  Text,
  Title,
} from 'native-base';
import {connect} from 'react-redux';
import {withSocketContext} from '../components/Socket';
import FastImage from 'react-native-fast-image';
import config from '../config';

import {PermissionsAndroid} from 'react-native';

import Contacts from 'react-native-contacts';
import {noUserAvatar} from '../images';

class PhoneContactsStack extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    contactList: [],
  };

  async componentDidMount() {
    try {
      const isGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts',
        },
      );

      if (!isGranted) {
        throw new Error('Permission is not granted');
      }

      const res = await Contacts.getAll();
      console.debug('contats', res);
      this.setState({
        contactList: res,
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  _keyExtractor = (item) => {
    return item.recordID;
  };

  _handleInvitePress = (recordId) => {};

  _renderItem = ({item}) => {
    return (
      <ListItem thumbnail>
        <Left>
          <Image
            style={{width: 56, height: 56}}
            source={
              item.thumbnailPath
                ? {
                    uri: item.thumbnailPath,
                  }
                : require('../images/pictures/no-user-image-icon.jpg')
            }
          />
        </Left>
        <Body>
          <View style={styles.body}>
            <Text style={styles.name}>{item.displayName}</Text>
            <TouchableOpacity style={styles.btn}>
              <Text
                style={styles.btnText}
                onPress={() => this.handleInvitePress(item.recordID)}>
                Invite
              </Text>
            </TouchableOpacity>
          </View>
        </Body>
        <Right></Right>
      </ListItem>
    );
  };

  render() {
    return (
      <Container>
        <Header>
          <StatusBar backgroundColor={'#24422e'} />
          <Left></Left>
          <Body>
            <Title>Contacts</Title>
          </Body>
          <Right></Right>
        </Header>
        <FlatList
          data={this.state.contactList}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          maxToRenderPerBatch={1}
          noIndent={true}
        />
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    app: state.app,
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withSocketContext(PhoneContactsStack));

const styles = StyleSheet.create({
  btn: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingLeft: 27,
    paddingVertical: 5,
    borderWidth: 3,
    borderColor: 'grey',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  btnText: {textTransform: 'uppercase', textAlign: 'center'},
  body: {flexDirection: 'row', alignItems: 'center'},
  name: {flex: 1},
});

import React, {Component} from 'react';
import {
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  View,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
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

import {PermissionsAndroid} from 'react-native';

import Contacts from 'react-native-contacts';

import SendSMS from 'react-native-sms';

class PhoneContactsStack extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    contactList: [],
    sentInvitations: [],
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
      const sentInvitations = await AsyncStorage.getItem('sentInvitations');

      this.setState({
        contactList: res.filter((data) => data.phoneNumbers.length),
        sentInvitations: sentInvitations ? JSON.parse(sentInvitations) : [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  _keyExtractor = (item) => {
    return item.recordID;
  };

  _handleInvitePress = (recordID) => {
    const foundContact = this.state.contactList.find(
      (cont) => recordID === cont.recordID,
    );
    const isInvitationSent = this.state.sentInvitations.some(
      (data) => data.recordID === recordID,
    );

    if (!foundContact || isInvitationSent) {
      return;
    }

    SendSMS.send(
      {
        body: 'Some message',
        recipients: [foundContact.phoneNumbers[0].number],
        successTypes: ['sent', 'queued'],
        allowAndroidSendWithoutReadPermission: true,
      },
      async (completed, cancelled, error) => {
        if (completed) {
          const updatedSentInvitations = [
            ...this.state.sentInvitations,
            {
              recordID,
              phone: foundContact.phoneNumbers[0].number,
            },
          ];

          AsyncStorage.setItem(
            'sentInvitations',
            JSON.stringify(updatedSentInvitations),
          );

          this.setState({
            sentInvitations: updatedSentInvitations,
          });
        }
      },
    );
  };

  _renderItem = ({item}) => {
    const isInvitationSent = this.state.sentInvitations.some(
      (data) => data.recordID === item.recordID,
    );

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
            <TouchableOpacity
              onPress={() => this._handleInvitePress(item.recordID)}
              activeOpacity={isInvitationSent ? 0.5 : 1}
              style={[
                styles.btn,
                {
                  opacity: isInvitationSent ? 0.5 : 1,
                },
              ]}>
              <Text style={styles.btnText} disabled={isInvitationSent}>
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

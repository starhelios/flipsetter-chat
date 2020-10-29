import React, {Component} from 'react';
import {
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  View,
  StyleSheet,
  Platform,
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

import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';

import SendSMS from 'react-native-sms';

const IOS_TEXT_MESSAGE = `Step 1: Be sure to update your iPhone to the latest iOS which can be found in your Settings
Step 2: Download and install TestFlight (a free app that deposits the Collaborate app file)
Step 3: After your install TestFlight on your phone, click on the link - (iPhone link) and it will prompt you to the install

If you have any questions or comments, please email us at f̲l̲i̲p̲s̲e̲t̲t̲e̲r̲.̲c̲o̲n̲t̲a̲c̲t̲@̲g̲m̲a̲i̲l̲.̲c̲o̲m̲ and include the following parts to your email:

Name:
Email:
Phone Type:
Problem, Comment or Issue:

All information is kept 100% confidential`;

const ANDROID_TEXT_MESSAGE = `Step 1: Go to your Google Drive
Step 2: Go to the folder you were given acess to - Public Test Group
Step 3: Click on the app file and click on Open With Package Installer (it will prompt the download)

If you have any questions or comments, please email us at f̲l̲i̲p̲s̲e̲t̲t̲e̲r̲.̲c̲o̲n̲t̲a̲c̲t̲@̲g̲m̲a̲i̲l̲.̲c̲o̲m̲ and include the following parts to your email:

Name:
Email:
Phone Type:
Problem, Comment or Issue:

All information is kept 100% confidential`;

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
      if (Platform.OS === 'android') {
        const isGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Contacts',
          },
        );

        if (!isGranted) {
          throw new Error('Permission is not granted');
        }
      } else {
        const permission = await Contacts.requestPermission();

        if (permission !== 'authorized') {
          throw new Error('Permission is not granted');
        }
      }

      const res = await Contacts.getAll();
      // await AsyncStorage.removeItem('sentInvitations');
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

  _handleInvitePress = (recordID, platform) => {
    const foundContact = this.state.contactList.find(
      (cont) => recordID === cont.recordID,
    );
    const foundInvitation = this.state.sentInvitations.find(
      (data) => data.recordID === recordID,
    );

    if (
      !foundContact ||
      (foundInvitation && foundInvitation.platforms.includes(platform))
    ) {
      return;
    }

    const image = require('../images/pictures/testFlight.png');
    const metadata = resolveAssetSource(image);
    const url = metadata.uri;

    const additionalFields =
      platform === 'android'
        ? {}
        : {
            attachment: {
              url: url,
              iosType: 'public.jpeg',
              iosFilename: 'testFlight.png',
              androidType: 'image/*',
            },
          };

    SendSMS.send(
      {
        ...additionalFields,
        body: platform === 'ios' ? IOS_TEXT_MESSAGE : ANDROID_TEXT_MESSAGE,
        recipients: [foundContact.phoneNumbers[0].number],
        successTypes: ['sent', 'queued'],
        allowAndroidSendWithoutReadPermission: true,
      },
      async (completed, cancelled, error) => {
        if (completed) {
          const updatedPlatform = this.state.sentInvitations.find(
            (inv) => inv.platforms,
          );
          const updatedSentInvitations = [
            ...this.state.sentInvitations,
            {
              recordID,
              platforms: foundInvitation
                ? [...foundInvitation.platforms, platform]
                : [platform],
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

  _renderInviteBtn = (recordID, platform, isDisabled) => {
    return (
      <TouchableOpacity
        onPress={() => this._handleInvitePress(recordID, platform)}
        disabled={isDisabled}
        activeOpacity={isDisabled ? 0.3 : 1}
        style={[
          styles.btn,
          {
            opacity: isDisabled ? 0.3 : 1,
          },
        ]}>
        <View style={{alignItems: 'center'}}>
          <Image
            style={{width: 20, height: 20}}
            source={
              platform === 'ios'
                ? require('../images/pictures/ios.png')
                : require('../images/pictures/android.png')
            }
          />
          <Text style={styles.btnText} disabled={isDisabled}>
            Invite
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  _renderItem = ({item}) => {
    const isInvitationAndroidSent = this.state.sentInvitations.some(
      (data) =>
        data.recordID === item.recordID && data.platforms.includes('android'),
    );

    const isInvitationIosSent = this.state.sentInvitations.some(
      (data) =>
        data.recordID === item.recordID && data.platforms.includes('ios'),
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
        <View style={styles.body}>
          <Text
            style={
              styles.name
            }>{`${item?.givenName} ${item?.familyName}`}</Text>
          <View style={{flexDirection: 'row'}}>
            {this._renderInviteBtn(
              item.recordID,
              'android',
              isInvitationAndroidSent,
            )}
            {this._renderInviteBtn(item.recordID, 'ios', isInvitationIosSent)}
          </View>
        </View>
        <Right></Right>
      </ListItem>
    );
  };

  render() {
    return (
      <Container>
        <Header>
          <StatusBar backgroundColor={'#24422e'} />
          <Left style={{flex: 1}}>
              <Title>Contacts</Title>
          </Left>
          <Body style={{flex: 1}} />
          <Right></Right>
        </Header>
        <FlatList
          data={this.state.contactList}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          extraData={this.state}
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
    paddingHorizontal: 10,
    marginLeft: 10,
    paddingVertical: 5,
    borderWidth: 2,
    borderColor: 'grey',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  btnText: {textTransform: 'uppercase', fontSize: 12},
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 0.8,
    marginLeft: 15,
    paddingVertical: 5,
  },
  name: {flex: 1},
});

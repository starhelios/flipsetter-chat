import React from 'react';
import {
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Images from '../config/Images';

const CustomModal = (props) => {
  return (
    <Modal
      isVisible
      // swipeDirection={['down']}
      // propagateSwipe={true}
      style={styles.modal}>
      <TouchableOpacity
        style={{
          right: 0,
          backgroundColor: 'green',
          position: 'absolute',
          top: -25,
          zIndex: 1,
          height: wp('10%'),
          width: wp('10%'),
          borderRadius: 100,
          justifyContent: 'center',
          alignItems: 'center',
          margin: 5,
        }}
        onPress={() => props.imageSelected()}>
        <Text style={{color: 'white', fontWeight: 'bold', fontSize: wp('5%')}}>
          OK
        </Text>
      </TouchableOpacity>
      <View style={[styles.scrollableModal]}>
        <FlatList
          data={props.data}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator
          renderItem={({item, index}) => (
            <View style={{margin: 10}}>
              <TouchableOpacity
                style={{
                  right: -9,
                  position: 'absolute',
                  top: -10,
                  zIndex: 1,
                }}
                onPress={() => props.cancel(index)}>
                <Image
                  style={{
                    height: props.doc ? wp('7%') : wp('9%'),
                    width: props.doc ? wp('7%') : wp('9%'),
                  }}
                  source={Images.cancelIcon}
                />
              </TouchableOpacity>
              {props.doc ? (
                <View
                  style={{
                    height: hp('10%'),
                    backgroundColor: '#d3d3d3',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: 'green',
                      padding: 5,
                      fontWeight: 'bold',
                      fontSize: wp('3%'),
                    }}>
                    {item.name?.length > 25 ? item.name.substring(0, 25) + '...' : item.name}
                  </Text>
                </View>
              ) : (
                <Image
                  style={{height: hp('22%'), width: wp('45%')}}
                  source={{uri: item.absolutePath}}
                />
              )}
            </View>
          )}
        />
      </View>
    </Modal>
  );
};

export default CustomModal;
const styles = StyleSheet.create({
  modal: {
    bottom: 0,
    position: 'absolute',
    alignSelf: 'center',
    marginBottom: 0,
  },

  scrollableModal: {
    backgroundColor: 'white',
    width: wp('100%'),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});

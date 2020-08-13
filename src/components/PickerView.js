import React from 'react';
import {
  View, Text, Image, TouchableOpacity, Platform, Dimensions,
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Images from '../config/Images';
import { useOrientation } from '../helper/useOrientation';

const CustomPickerView = (props) => {
  const orientation = useOrientation();
  const marginBottom = orientation === 'LANDSCAPE' ? (Platform.OS === 'ios' ? 75 : 45) : (Platform.OS === 'ios' ? 85 : 45);
  return (
    <View style={{
      bottom: 0, alignSelf: 'center', justifyContent: 'center', position: 'absolute', backgroundColor: 'transparent', height: Platform.OS === 'ios' ? hp('11%') : hp('12.5%'), alignItems: 'center', width: '100%', marginBottom,
    }}
    >
      <TouchableOpacity
        onPress={() => props.cancel()}
        style={{
          height: hp('4.5%'), width: hp('4.5%'), borderRadius: 50, alignSelf: 'center', justifyContent: 'center', top: 0, right: 0, position: 'absolute', marginRight: 8, zIndex: 1,
        }}
      >
        <Image resizeMode="contain" source={Images.cancelIcon} style={{ height: hp('4.5%'), width: hp('4.5%'), alignSelf: 'center' }} />
      </TouchableOpacity>
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', bottom: 0, position: 'absolute', backgroundColor: 'green',
      }}
      >
        <TouchableOpacity
          style={{
            margin: 10,
            width: '20%',
            alignSelf: 'center',
            justifyContent: 'center',
          }}
          onPress={() => props.openCamera()}
        >
          <Image resizeMode="contain" source={Images.cameraIcon} style={{ height: hp('4.5%'), width: hp('4.5%'), alignSelf: 'center' }} />
          <Text style={{
            fontSize: hp('1.7%'), padding: 2, color: 'white', textAlign: 'center',
          }}
          >
            Camera
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            margin: 10,
            width: '20%',
            alignSelf: 'center',
            justifyContent: 'center',
          }}
          onPress={() => props.openGallery()}
        >
          <Image resizeMode="contain" source={Images.galleryIcon} style={{ height: hp('4.5%'), width: hp('4.5%'), alignSelf: 'center' }} />
          <Text style={{
            fontSize: hp('1.7%'), padding: 2, color: 'white', textAlign: 'center',
          }}
          >
            Gallery
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            margin: 10,
            width: '20%',
            alignSelf: 'center',
            justifyContent: 'center',
          }}
          onPress={() => props.pickDocument()}
        >
          <Image resizeMode="contain" source={Images.docIcon} style={{ height: hp('4.5%'), width: hp('4.5%'), alignSelf: 'center' }} />
          <Text style={{
            fontSize: hp('1.7%'), padding: 2, color: 'white', textAlign: 'center',
          }}
          >
            Document
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default CustomPickerView;

export function isiPhoneX() {
  if (
    Platform.OS === 'ios'
        && Dimensions.get('window').height >= 812
  ) {
    return true;
  }
  return false;
}

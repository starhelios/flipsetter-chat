import React, { Component } from 'react';
import {
    View, Text, Image,
    TouchableOpacity,
<<<<<<< HEAD
} from 'react-native';
import Images from '../config/Images';

const CustomPickerView = (props) => {
    return (
        <View style={{ bottom: 0, alignSelf: 'center', justifyContent: 'center', position: 'absolute',  backgroundColor:'transparent', height: '16%', alignItems: 'center', width: '100%',marginBottom:'15%' }}>
                    <TouchableOpacity onPress={() => props.cancel()} style={{ backgroundColor: 'red', height: 30, width: 30,borderRadius:50, alignSelf: 'center', justifyContent: 'center',top:0,right:0,position:'absolute',marginRight:8,zIndex:1 }}>
                    <Image resizeMode='contain' source={Images.cancelIcon} style={{height:30,width:30, alignSelf: 'center' }} />
            </TouchableOpacity>
                   <View style={{ flexDirection:'row',alignItems:'center',justifyContent:'center',width:'100%', bottom:0,position:'absolute',backgroundColor:'green'}}> 
                   <TouchableOpacity style={{
                        margin:10,width:'20%',
                        alignSelf: 'center', justifyContent: 'center',}} onPress={() => props.openCamera()}>
                        <Image resizeMode='contain' source={Images.cameraIcon} style={{height:40,width:40, alignSelf: 'center' }} />
                   <Text style={{fontSize:13,padding:5,color:'white',textAlign:'center'}}>Camera</Text>
                    </TouchableOpacity>
=======
    Platform,
} from 'react-native';
import Images from '../config/Images';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const CustomPickerView = (props) => {
    return (
        <View style={{ bottom: 0, alignSelf: 'center', justifyContent: 'center', position: 'absolute',  backgroundColor:'transparent', height:Platform.OS === 'ios'? hp('11%'):hp('12.5%'), alignItems: 'center', width: '100%',marginBottom:Platform.OS ==='ios'? hp('9.5%'):hp('8%')}}>
                     <TouchableOpacity onPress={() => props.cancel()} style={{height:hp('4.5%'),width:hp('4.5%'),borderRadius:50, alignSelf: 'center', justifyContent: 'center',top:0,right:0,position:'absolute',marginRight:8,zIndex:1 }}>
                    <Image resizeMode='contain' source={Images.cancelIcon} style={{height:hp('4.5%'),width:hp('4.5%'), alignSelf: 'center' }} />
            </TouchableOpacity>
                 <View style={{ flexDirection:'row',alignItems:'center',justifyContent:'center',width:'100%', bottom:0,position:'absolute',backgroundColor:'green'}}> 
                   <TouchableOpacity style={{
                        margin:10,width:'20%',
                        alignSelf: 'center', justifyContent: 'center',}} onPress={() => props.openCamera()}>
                        <Image resizeMode='contain' source={Images.cameraIcon} style={{height:hp('4.5%'),width:hp('4.5%'), alignSelf: 'center' }} />
                   <Text style={{fontSize:hp('1.7%'),padding:2,color:'white',textAlign:'center'}}>Camera</Text>
                    </TouchableOpacity> 
>>>>>>> alex-dev
                     <TouchableOpacity style={{
                        margin:10,width:'20%',
                        alignSelf: 'center', justifyContent: 'center',
                    }} onPress={() => props.openGallery()}>
<<<<<<< HEAD
                        <Image resizeMode='contain'  source={Images.galleryIcon} style={{height:40,width:40, alignSelf: 'center' }} />
                        <Text style={{fontSize:13,padding:5,color:'white',textAlign:'center'}}>Gallery</Text>
=======
                        <Image resizeMode='contain'  source={Images.galleryIcon} style={{height:hp('4.5%'),width:hp('4.5%'), alignSelf: 'center' }} />
                        <Text style={{fontSize:hp('1.7%'),padding:2,color:'white',textAlign:'center'}}>Gallery</Text>
>>>>>>> alex-dev

                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        margin:10,width:'20%',
                        alignSelf: 'center', justifyContent: 'center',
                    }} onPress={() => props.pickDocument()}>
<<<<<<< HEAD
                        <Image resizeMode='contain'  source={Images.docIcon} style={{height:40,width:40, alignSelf: 'center' }} />
                        <Text style={{fontSize:13,padding:5,color:'white',textAlign:'center'}}>Document</Text>
                    </TouchableOpacity>
                    </View> 
        </View>
=======
                        <Image resizeMode='contain'  source={Images.docIcon} style={{height:hp('4.5%'),width:hp('4.5%'), alignSelf: 'center' }} />
                        <Text style={{fontSize:hp('1.7%'),padding:2,color:'white',textAlign:'center'}}>Document</Text>
                    </TouchableOpacity>
                    </View>     
                         </View>
>>>>>>> alex-dev
    )
}
export default CustomPickerView;
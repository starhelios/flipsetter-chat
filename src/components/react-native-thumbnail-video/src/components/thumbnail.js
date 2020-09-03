import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  ImageBackground,
  Image,
  ViewPropTypes,
  View,
  Linking,
  StyleSheet, Text
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

import {DEFAULT_WIDTH, TYPES} from './constants';
import {getVideoId} from '../helpers';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default class Thumbnail extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      videoId: getVideoId(props.url),
      title: '',
      provider: ''
    };
  }

  static propTypes = {
    ...ImageBackground.propTypes,
    children: PropTypes.node,
    containerStyle: ViewPropTypes.style,
    imageHeight: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    imageWidth: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    iconStyle: Image.propTypes.style,
    onPress: PropTypes.func,
    onPressError: PropTypes.func,
    style: ViewPropTypes.style,
    type: PropTypes.oneOf(Object.keys(TYPES)),
    url: PropTypes.string.isRequired,
    showPlayIcon: PropTypes.bool
  };

  static defaultProps = {
    type: 'high',
    imageHeight: 200,
    imageWidth: DEFAULT_WIDTH,
    onPressError: () => {
    },
    showPlayIcon: true
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const videoId = getVideoId(nextProps.url);

    if (videoId !== prevState.videoId) {
      return {videoId};
    }

    return null;
  }

  UNSAFE_componentWillUpdate(nextProps) {
    if (this.props.url === nextProps.url || !nextProps.url) {
      return;
    }

    this.setState({
      videoId: getVideoId(nextProps.url),
    });
  }

  getType = () => TYPES[this.props.type];

  onPress = () => {
    const {url, onPress, onPressError} = this.props;

    if (onPress) {
      return onPress(url);
    }

    Linking.canOpenURL(url).then((supported) => {
      if (!supported) {
        return;
      }

      return Linking.openURL(url);
    }).catch(onPressError);
  };

  componentDidMount() {
    this.videoDetail()
  }

  videoDetail = () => {
    let url = 'https://www.youtube.com/oembed?url=' + this.props.url + '&format=json';
    RNFetchBlob
      .fetch('GET',url)
      .then((res) => {
        let mm = res.json();
        this.setState({title: mm.title, provider: mm.provider_url}, () => {
        })
      })
  }


  render() {
    const {videoId} = this.state;

    if (!videoId) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`Invalid "url" could not extract videoId from "${this.props.url}"`);
      }

      return null;
    }

    const {
      imageWidth,
      imageHeight,
      containerStyle,
      iconStyle,
      children,
      showPlayIcon,
      ...props
    } = this.props;

    const imageURL = `https://img.youtube.com/vi/${videoId}/${this.getType()}.jpg`;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={this.onPress}
      >
        <View style={[containerStyle, {width: '100%',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,}]}>
          <View style={{
            backgroundColor: 'green',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,}} >
          <Text style={{
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            fontWeight: 'bold',
            fontSize: 10,
            padding: 3,
            color: 'white',
            textAlign: 'center',
          }}>{this.props.url}</Text>
          </View>

        <ImageBackground
          resizeMode='cover'
          source={{uri: imageURL}}
          style={[
            styles.imageContainer,
            {
              flex: 1, height: hp('13%'),
             borderRadius: 10, backgroundColor: 'green', opacity: 0.8
            },
          ]}
          testId='thumbnail-image-background'
          {...props}
        >
          {
            showPlayIcon && (
              <Image
                resizeMode='contain'
                source={require('../assets/play.png')}
                style={[styles.playIcon, iconStyle]}
                testId='thumbnail-image'
              />
            )
          }
          {children}
        </ImageBackground>

          <View style={{
            flex:1,
            paddingTop: -1,
            paddingVertical: 8,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
        <Text style={{
          fontSize: 11, fontWeight: 'bold', margin: 3, backgroundColor: 'black',
          color: 'white', textAlign: 'center'
        }}>{this.state.title}</Text>

        <Text style={{
          borderBottomRightRadius: 10, fontWeight: '900',
          borderBottomLeftRadius: 10, fontSize: 10, paddingLeft: 5,
          color: 'white', textAlign: 'center'
        }}>{this.state.provider}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    tintColor: 'white',
    height: 30, width: 30
  },
});

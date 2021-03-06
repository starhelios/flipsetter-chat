import PropTypes from 'prop-types'
import React from 'react'
import { Platform, StyleSheet, TextInput } from 'react-native'
import { MIN_COMPOSER_HEIGHT, DEFAULT_PLACEHOLDER } from 'react-native-gifted-chat/lib/Constant'
import Color from 'react-native-gifted-chat/lib/Color'
import { StylePropType } from 'react-native-gifted-chat/lib/utils'

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    ...Platform.select({
      web: {
        paddingTop: 6,
        paddingLeft: 4,
      },
    }),
    marginTop: Platform.select({
      ios: 6,
      android: 0,
      web: 6,
    }),
    marginBottom: Platform.select({
      ios: 0,
      android: 3,
      web: 4,
    }),
  },
})

class Composer extends React.Component {


  contentSize = undefined

onContentSizeChange = (e) => {
  const { contentSize } = e.nativeEvent

  // Support earlier versions of React Native on Android.
  if (!contentSize) {
    return
  }

  if (
    !this.contentSize ||
    (this.contentSize &&
      (this.contentSize.width !== contentSize.width ||
        this.contentSize.height !== contentSize.height))
  ) {
    this.contentSize = contentSize
    this.props.onInputSizeChanged(this.contentSize)
  }
}

onChangeText = (text) => {
  this.props.onTextChanged(text)
}

render() {
  return (
    <TextInput
      testID={this.props.placeholder}
      accessible
      accessibilityLabel={this.props.placeholder}
      placeholder={this.props.placeholder}
      placeholderTextColor={this.props.placeholderTextColor}
      multiline={this.props.multiline}
      editable={!this.props.disableComposer}
      onChange={this.onContentSizeChange}
      onContentSizeChange={this.onContentSizeChange}
      onChangeText={this.onChangeText}
      style={[
        styles.textInput,
        this.props.textInputStyle,
        {
          height: this.props.composerHeight,
          ...Platform.select({
            web: {
              outlineWidth: 0,
              outlineColor: 'transparent',
              outlineOffset: 0,
            },
          }),
        },
      ]}
      autoFocus={this.props.textInputAutoFocus}
      value={this.props.text}
      enablesReturnKeyAutomatically
      underlineColorAndroid='transparent'
      keyboardAppearance={this.props.keyboardAppearance}
      {...this.props.textInputProps}
    />
  )
}
}

Composer.propTypes = {
  composerHeight: PropTypes.number,
  text: PropTypes.string,
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  textInputProps: PropTypes.object,
  onTextChanged: PropTypes.func,
  onInputSizeChanged: PropTypes.func,
  multiline: PropTypes.bool,
  disableComposer: PropTypes.bool,
  textInputAutoFocus: PropTypes.bool,
  keyboardAppearance: PropTypes.string,
}

Composer.defaultProps = {
  composerHeight: MIN_COMPOSER_HEIGHT,
  text: '',
  placeholderTextColor: Color.defaultColor,
  placeholder: DEFAULT_PLACEHOLDER,
  textInputProps: null,
  multiline: true,
  disableComposer: false,
  textInputAutoFocus: false,
  keyboardAppearance: 'default',
  onTextChanged: () => {},
  onInputSizeChanged: () => {},
}

export { Composer }

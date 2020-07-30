import PropTypes from 'prop-types'
import React from 'react'
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
} from 'react-native'
import Color from 'react-native-gifted-chat/lib/Color'
import { StylePropType } from 'react-native-gifted-chat/lib/utils'

import { clipIcon, smileIcon } from '../../../../images';


class Actions extends React.Component {
  static defaultProps = {
    options: {},
    optionTintColor: Color.optionTintColor,
    icon: undefined,
    containerStyle: {},
    iconTextStyle: {},
    wrapperStyle: {},
  }

  static propTypes = {
    onSend: PropTypes.func,
    options: PropTypes.object,
    optionTintColor: PropTypes.string,
    icon: PropTypes.func,
    onPressActionButton: PropTypes.func,
    wrapperStyle: StylePropType,
    containerStyle: StylePropType,
  }

  static contextTypes = {
    actionSheet: PropTypes.func,
  }

  onActionsPress = () => {
    const { options } = this.props
    const optionKeys = Object.keys(options)
    const cancelButtonIndex = optionKeys.indexOf('Cancel')
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options: optionKeys,
        cancelButtonIndex,
        tintColor: this.props.optionTintColor,
      },
      (buttonIndex) => {
        const key = optionKeys[buttonIndex]
        if (key) {
          options[key](this.props)
        }
      },
    )
  }

  renderIcon() {
    if (this.props.icon) {
      return this.props.icon()
    }
    return (
      <View style={[styles.wrapper, this.props.wrapperStyle]}>
        <Image resizeMode='contain' source={clipIcon} style={[styles.iconText, this.props.iconTextStyle]} />
        <Image resizeMode='contain' source={smileIcon} style={[styles.iconText, this.props.iconTextStyle]} />
    </View>
    )
  }

  render() {
    return (
      <TouchableOpacity
        style={[styles.container, this.props.containerStyle]}
        onPress={this.props.onPressActionButton || this.onActionsPress}
      >
        {this.renderIcon()}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
    marginTop: 5,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 60,
  },
  iconText: {
    color: Color.defaultColor,
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: Color.backgroundTransparent,
    textAlign: 'center',
    height: 25,
    width: 25,
  },
})

export { Actions };

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
      <View style={[styles.container, styles.wrapper, this.props.wrapperStyle]}>

        <TouchableOpacity
          style={[styles.wrapper, this.props.containerStyle]}
          onPress={this.props.onPressActionButton || this.onActionsPress}
        >
        <Image resizeMode='contain' source={clipIcon} style={[styles.iconText, this.props.iconTextStyle]} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.wrapper, this.props.containerStyle]}
          onPress={this.props.onPressActionButton || this.onActionsPress}
        >
        <Image resizeMode='contain' source={smileIcon} style={[styles.iconText, this.props.iconTextStyle]} />
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return this.renderIcon()
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 10,
    top: -3,
    right: -5,
  },
  iconText: {
<<<<<<< HEAD
    color: Color.defaultColor,
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: Color.backgroundTransparent,
    textAlign: 'center',
=======
    backgroundColor: Color.backgroundTransparent,
>>>>>>> artemBranch
    height: 25,
    width: 25,
  },
})

export { Actions };

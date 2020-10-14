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

  render() {
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
}

Actions.contextTypes = {
  actionSheet: PropTypes.func,
}

Actions.defaultProps = {
  options: {},
  optionTintColor: Color.optionTintColor,
  icon: undefined,
  iconTextStyle: {},
}

Actions.propTypes = {
  onSend: PropTypes.func,
  options: PropTypes.object,
  optionTintColor: PropTypes.string,
  icon: PropTypes.func,
  onPressActionButton: PropTypes.func,
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
    backgroundColor: Color.backgroundTransparent,
    height: 25,
    width: 25,
  },
})

export { Actions };

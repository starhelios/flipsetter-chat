import PropTypes from 'prop-types'
import React from 'react'
import {
  StyleSheet,
  View,
  Keyboard,
} from 'react-native'
import { Send } from 'react-native-gifted-chat'
import { Composer } from '../Composer'
import { Actions } from '../Actions'
import Colors from '../../../../config/Colors';

import { StylePropType } from 'react-native-gifted-chat/lib/utils'

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.menuSideSeparator,
    backgroundColor: Colors.white,
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  primary: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.menuSideSeparator,
    borderRadius: 6,

  },
  accessory: {
    height: 44,
  },
})


class InputToolbar extends React.Component{


  state = {
    position: 'absolute',
  }

  keyboardWillShowListener = undefined
  keyboardWillHideListener = undefined

  componentDidMount() {
    this.keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      this.keyboardWillShow,
    )
    this.keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      this.keyboardWillHide,
    )
  }

  componentWillUnmount() {
    if (this.keyboardWillShowListener) {
      this.keyboardWillShowListener.remove()
    }
    if (this.keyboardWillHideListener) {
      this.keyboardWillHideListener.remove()
    }
  }

  keyboardWillShow = () => {
    if (this.state.position !== 'relative') {
      this.setState({
        position: 'relative',
      })
    }
  }

  keyboardWillHide = () => {
    if (this.state.position !== 'absolute') {
      this.setState({
        position: 'absolute',
      })
    }
  }

  renderActions() {
    const { containerStyle, ...props } = this.props
    if (this.props.renderActions) {
      return this.props.renderActions(props)
    } else if (this.props.onPressActionButton) {
      return <Actions {...props} />
    }
    return null
  }

  renderSend() {
    if (this.props.renderSend) {
      return this.props.renderSend(this.props)
    }
    return <Send {...this.props} />
  }

  renderComposer() {
    if (this.props.renderComposer) {
      return this.props.renderComposer(this.props)
    }

    return <Composer {...this.props} />
  }

  renderAccessory() {
    if (this.props.renderAccessory) {
      return (
        <View style={[styles.accessory, this.props.accessoryStyle]}>
          {this.props.renderAccessory(this.props)}
        </View>
      )
    }
    return null
  }

  render() {
    return (
      <View
        style={
          [
            styles.container,
            { position: this.state.position },
            this.props.containerStyle,
          ]
        }
      >
        <View style={[styles.primary, this.props.primaryStyle]}>
          {this.renderComposer()}
          {this.renderSend()}
          {this.renderActions()}
        </View>
        {this.renderAccessory()}
      </View>
    )
  }
}

InputToolbar.propTypes = {
  renderAccessory: PropTypes.func,
  renderActions: PropTypes.func,
  renderSend: PropTypes.func,
  renderComposer: PropTypes.func,
  onPressActionButton: PropTypes.func,
}

InputToolbar.defaultProps = {
  renderAccessory: null,
  renderActions: null,
  renderSend: null,
  renderComposer: null,
  onPressActionButton: () => {},
}

export {InputToolbar}

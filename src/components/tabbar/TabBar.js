import React from 'react'
import {Keyboard, Platform} from 'react-native'
import { BottomTabBar } from 'react-navigation-tabs'

class TabBar extends React.PureComponent {

    constructor(props) {
        super(props)

    //     this.keyboardWillShow = this.keyboardWillShow.bind(this)
    //     this.keyboardWillHide = this.keyboardWillHide.bind(this)
    //     if(Platform.OS === 'android'){
    //         this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow);
    //         this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide);
    //     }
    //     else{
    //         this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    //         this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
    //     }
    //     this.state = {
    //         isVisible: true
    //     }
    }

    componentWillUnmount(){
        // this.keyboardWillShowSub.remove()
        // this.keyboardWillHideSub.remove()
    }
    //
    // keyboardWillShow = event => {
    //     this.setState({
    //         isVisible: false
    //     })
    // }
    //
    // keyboardWillHide = event => {
    //     this.setState({
    //         isVisible: true
    //     })
    // }

    render() {
        // return this.state.isVisible ?
            return <BottomTabBar {...this.props} />
            // :
            // null
    }
}

export default TabBar
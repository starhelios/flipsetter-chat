import React, { Component } from "react";
import {
    Dimensions,
    StyleSheet,
    TextInput,
    View,
    KeyboardAvoidingView,
    Keyboard,
    Text,
    TouchableWithoutFeedback,
    Platform
} from "react-native";
import {connect} from "react-redux";
import {IMAGE_HEIGHT} from "./Login";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {App, Auth, Messages, Search, Threads, User} from "../reducers/actions";
const window = Dimensions.get('window');

class SearchBar extends Component{
    searchInput;
    state = {
        focused: false,
        query: null,
        keyboard: false,
    }

    constructor(props) {
        super(props);

    }

    componentDidMount(){
        // this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
        // this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide);

    }

    componentWillUnmount(){
        // this.keyboardDidHideListener.remove();
        // this.keyboardDidShowListener.remove();
    }



    keyboardDidShow = (event) => {
        console.log("open", event);
        this.setState(state =>({
            keyboard: !state.keyboard,
        }))
    }

    keyboardDidHide = (event) => {
        this.setState(state => ({
            keyboard:!state.keyboard
        }), () => {
            if(this.state.focused){
                this._onFocus();
            }
        });

    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
        if(this.props.hidden && this.state.focused){
            this._onFocus();
            this.searchInput.blur();
        }
    }

    _onFocus = () => {

        this.setState({
            focused: !this.state.focused,
        },

            this.props.focused(!this.state.focused)

        );
    }

    _onChange = (input) => {
        this.props.getSearch(input);
    }

    _cancel = () => {
        this._onFocus();
        this.searchInput.blur();
        this.props.clearSearch();
        Keyboard.dismiss();
    }

    cancelButton = () => {
        if(this.state.focused || this.props.search.query)
        {
            return (
                <TouchableWithoutFeedback
                    onPress={this._cancel}
                >
                    <Text style={styles.cancel}>Cancel</Text>
                </TouchableWithoutFeedback>
            )
        }
        return null;
    }

    render(){
        return(
            <View
                style={styles.container}
            >
                    <FontAwesome5 style={{...styles.icon}} name={"search"} size={24}/>
                    <TextInput
                        value={this.props.search.query}
                        style={styles.input}
                        placeholder={"Search"}
                        placeholderTextColor={"#878787"}
                        placeholderStyle={styles.placeholder}
                        onFocus={this._onFocus}
                        onChangeText={this._onChange}
                        ref={(input) => {this.searchInput = input}}
                    />
                    {this.cancelButton()}
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height:50,
        alignItems:'center',
        justifyContent: 'center',
        borderBottomWidth:1,
        borderColor:"#d9d9d9",
    },
    icon:{
        alignItems:'center',
        justifyContent: 'center',
        color:"#878787",
        marginLeft: 10,

    },
    placeholder:{

    },
    cancel:{
        fontSize: 15,
        width: "auto",
        marginRight:10,
    },
    input: {
        flex:1,
        fontSize:24,
        marginHorizontal: 10,
        marginVertical: 5,
        paddingRight: 48,
        color: '#000',
        paddingHorizontal: 10,
    },
});

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        app: state.app,
        user: state.user,
        threads: state.threads,
        search: state.search,
    }
}

const mapDispatchToProps = {
    getSearch: Search.getSearch,
    clearSearch: Search.clearSearch,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
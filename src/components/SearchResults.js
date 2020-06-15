import React, { Component } from "react";
import {Dimensions, FlatList, StyleSheet, TextInput, View, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback} from "react-native";
import { Container, Header, Icon, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, Title} from 'native-base';
import {connect} from "react-redux";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {App, Auth, Messages, Search, Threads, User} from "../reducers/actions";
import FastImage from "react-native-fast-image";
import {emojify} from "react-emojione";
const window = Dimensions.get('window');

class SearchResults extends React.PureComponent{

    state = {
        focused: false,
        query: null,
    }

    constructor(props) {
        super(props);
        this.item = {...this.props.item};
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
        // console.log(this.state)
        // this.item = this.props.data.item;
    }

    render(){
        // return null
        return(
            <ListItem thumbnail>
                <Left>
                   <FastImage
                       source={{
                           uri: `https://tippinweb.com/api/v0${this.props.item.avatar}`,
                           headers: {Authorization: `Bearer ${this.props.auth.accessToken}`},
                           priority: FastImage.priority.normal,
                       }}
                       style={{width: 56, height: 56}}
                   />
                </Left>
                <Body>
                    <Text>{this.props.item.name}</Text>
                </Body>
                <Right>

                </Right>
            </ListItem>
        )
    }

}

const styles = StyleSheet.create({

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
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
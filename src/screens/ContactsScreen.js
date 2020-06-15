import React, { Component } from 'react';
import {StyleSheet, Platform, StatusBar, FlatList} from 'react-native';
import { Container, Header, Icon, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, Title, View } from 'native-base';
import {Friends} from "../reducers/actions";
import {connect} from "react-redux";
import {withSocketContext} from "../components/Socket";
import FastImage from "react-native-fast-image";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

class ContactsScreen extends Component<Props> {

    constructor(props) {
        super(props);
    }

    componentDidMount(): void {
        this.props.getList();

    }

    _keyExtractor = (item) => {
        return item.owner_id;
    }

    _renderItem = ({item}) => {
        console.log(item);
        return(
            <ListItem thumbnail>
                <Left>
                    <FastImage
                        source={{
                            uri: `https://tippinweb.com/api/v0${item.avatar}`,
                            headers: {Authorization: `Bearer ${this.props.auth.accessToken}`},
                            priority: FastImage.priority.normal,
                        }}
                        style={{width: 56, height: 56}}
                    />
                </Left>
                <Body>
                    <Text>{item.name}</Text>
                </Body>
                <Right>
                    <Text>Online: {(item.online) ?
                        <FontAwesome5 name={"circle"} color={"green"} size={15} solid /> :
                        <FontAwesome5 name={"circle"} color={"red"} size={15} solid />}</Text>
                </Right>
            </ListItem>

        )
    }

    render(){
        return(
            <Container>
                <Header>
                    <StatusBar backgroundColor={"#24422e"} />
                    <Left></Left>
                    <Body><Title>Contacts</Title></Body>
                    <Right></Right>
                </Header>
                <FlatList
                    data={Object.values(this.props.friends.list)}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    maxToRenderPerBatch={1}
                    noIndent={true}
                />

            </Container>
        )
    }

}


const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        app: state.app,
        friends: state.friends
    }
}

const mapDispatchToProps = {
    getList: Friends.getList,
};

export default connect(mapStateToProps, mapDispatchToProps)(withSocketContext(ContactsScreen))
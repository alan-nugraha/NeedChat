import React, { Component } from 'react';
import {
    ScrollView,
    Image,
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
} from 'react-native';
import * as firebase from 'firebase';
import fire from '../Config/firebase';

class Contact extends Component {
    constructor() {
        super();
        this.state = {
            data: [],
            userUID: '',
            data2: {},
        };
        this.getAllUser();
    }

    getAllUser = async () => {
        const uid = firebase.auth().currentUser.uid;
        const ref = firebase.database().ref('/users');

        await ref.on('value', async snapshot => {
            let data = [];
            let data2 = [];
            let data3 = [];
            let data4 = {};
            await Object.keys(snapshot.val()).map(async key => {
                const friendUID = snapshot.val()[key].uid;
                const noRead = [];
                let x = [];
                const ref2 = firebase.database().ref(`/chat/${friendUID}/${uid}/`);
                await ref2.on('value', async snapshot => {
                    if (snapshot.val() != null) {
                        await Object.keys(snapshot.val()).map(key => {
                            if (snapshot.val()[key].isRead != undefined) {
                                noRead.push(snapshot.val()[key].isRead);
                                console.log('READDDD', snapshot.val()[key].isRead);
                                x = snapshot.val()[key];
                                x['total'] = noRead.length;
                            }
                        });
                    }
                    if (x.messages != undefined) {
                        data2.push(x);
                        data3.push(x.messages.user);
                    }
                });
                await data.push({
                    uid: key,
                    data: snapshot.val()[key],
                });
            });
            console.log('data22', data2);
            console.log('data3', data3);
            for (let i = 0; i < data3.length; i++) {
                data4[`${data3[i]._id}`] = data2[i].total;
            }
            await this.setState({
                data: data,
                data2: data4,
            });
            console.log('data4', data4);
        });
    };

    getUser = async () => {
        const uid = firebase.auth().currentUser.uid;
        this.setState({
            userUID: uid,
        });
    };

    handleChat = async friendUID => {
        const uid = firebase.auth().currentUser.uid;
        const ref = firebase.database().ref(`/chat/${friendUID}/${uid}/`);
        ref.on('value', async snapshot => {
            if (Object.keys(snapshot.val()) != null) {
                await Object.keys(snapshot.val()).map(async key => {
                    const ref2 = firebase
                        .database()
                        .ref(`/chat/${friendUID}/${uid}/${key}/isRead`);
                    ref2.remove();
                });
                delete this.state.data2[`${friendUID}`];
                this.forceUpdate();
                console.log('dadadat2', this.state.data2);
                this.getAllUser();
            }
        });
        this.props.navigation.push('Chat', {
            uid: friendUID,
        });
    };

    componentDidMount() {
        this.getUser();
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.friendContainer}>
                    <Text style={{ fontSize: 20, color: '#FFF' }}>Friend List</Text>
                </View>
                <ScrollView style={{ flex: 0.5 }}>
                    {this.state.data.map(data => {
                        const { userUID } = this.state;
                        return userUID == data.uid ? null : (
                            <TouchableOpacity
                                onPress={() => this.handleChat(data.uid)}
                                activeOpacity={0.5}
                                style={styles.contactList}
                                key={data.uid}>
                                <Image
                                    source={{ uri: `${data.data.imageUrl}` }}
                                    style={styles.profile}
                                />
                                <View>
                                    <Text style={{ fontSize: 16 }}>{data.data.displayName}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
        );
    }
}

export default Contact

const styles = StyleSheet.create({
    friendContainer: {
        height: 60,
        backgroundColor: '#5C93C4',
        alignItems: 'center',
        paddingHorizontal: 30,
        flexDirection: 'row',
    },
    contactList: {
        height: 75,
        backgroundColor: '#F8F7F2',
        borderBottomColor: '#BEDAFA',
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    profile: {
        height: 60,
        width: 60,
        borderRadius: 40,
        marginRight: 20,
    },
})
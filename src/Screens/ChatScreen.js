import React, { Component } from 'react';
import { View, Image, Text, ToastAndroid, AppState, TouchableOpacity, StyleSheet } from 'react-native'
import { GiftedChat, Send, Bubble } from 'react-native-gifted-chat';
import * as firebase from 'firebase';
import Fire from '../Config/firebase'
import Icon from 'react-native-vector-icons/FontAwesome';

class Chat extends Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            displayName: '',
            uid: '',
            imageUrl: '',

            friendUID: '',
            friendName: '',
            friendUrl: '',
            friendStatus: '',
        };
        this.getUser();
        this.getChat()
        this.getFriendUser()
    }

    getUser = async () => {
        const uid = firebase.auth().currentUser.uid;
        const ref = firebase.database().ref(`/users/${uid}`);
        ref.on('value', (snapshot) => {
            this.setState({
                displayName: snapshot.val().displayName,
                uid: snapshot.val().uid,
                url: snapshot.val().imageUrl,
            });
        })
    };

    getFriendUser = async () => {
        const friendUID = await this.props.navigation.getParam('uid');
        const ref = firebase.database().ref(`/users/${friendUID}`);
        ref.on('value', (snapshot) => {
            console.log(snapshot.val().displayName)
            this.setState({
                friendName: snapshot.val().displayName,
                friendUrl: snapshot.val().imageUrl,
                friendStatus: snapshot.val().status
            })
        });
    }

    getChat = async () => {
        const uid = firebase.auth().currentUser.uid;
        const ref = firebase.database().ref(`/chat/${uid}/${this.state.friendUID}`)
        const ref2 = firebase.database().ref(`/chat/${this.state.friendUID}/${uid}`);
        let data = [];
        ref.on('child_added', async snapshot => {
            data.push(snapshot.val().messages)
        });

        ref2.on('child_added', async snapshot => {
            data.push(snapshot.val().messages)
        });

        data = data.sort((a, b) => {
            if (a.createdAt < b.createdAt) {
                return 1
            } else if (a.createdAt > b.createdAt) {
                return -1
            }
            return 0
        })
        this.setState(previousState => ({
            messages: data,
        }));
    };

    async onSend(messages) {
        const { friendUID } = this.state;
        const uid = firebase.auth().currentUser.uid;
        const ref = firebase.database().ref(`/chat/${uid}/${friendUID}/`)
        // const ref2 = firebase.database().ref(`/isread/${uid}/${friendUID}/`)

        await ref.push({
            isRead: 'no',
            messages: {
                _id: Math.floor(Math.random() * 10000000000000) + 1,
                text: messages[0].text,
                createdAt: firebase.database.ServerValue.TIMESTAMP,
                user: {
                    _id: uid,
                    avatar: `${this.state.imageUrl}`,
                    dipslayName: `${this.state.displayName}`,
                },
            },
        });
        await this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages)
        }));
    }

    interval = 0
    lastSeenInterval = 0

    async componentDidMount() {
        const friendUID = await this.props.navigation.getParam('uid');
        await this.setState({
            friendUID,
        })
        await this.getUser()
        this.getChat()
        this.getFriendUser()
        this.getLastSeen()
        this.interval = setInterval(() => {
            this.getChat()
        }, 2000);
    }

    componentWillUnmount() {
        clearInterval(this.interval)
        clearInterval(this.lastSeenInterval)
    }

    renderSend(props) {
        return (
            <Send
                {...props}
            >
                <View style={{ marginRight: 15, paddingVertical: 5 }}>
                    <Icon name="send" size={30} color="#5C93C4" />
                </View>
            </Send>
        );
    }

    renderBubble = props => {
        return (
            <Bubble
                {...props}
                textStyle={{
                    right: {
                        color: '#FAF8F0',
                    },
                    left: {
                        color: '#000'
                    }
                }}
                wrapperStyle={{
                    left: {
                        backgroundColor: '#ECECEC',
                    },
                    right: {
                        backgroundColor: '#5fc9f8'
                    }
                }}

            />
        );
    }

    render() {
        return (
            <>
                <View style={styles.header}>
                    <Icon name="chevron-left" size={20} color="#FAF8F0"
                        onPress={() => this.props.navigation.navigate('Contact')} />
                    <TouchableOpacity activeOpacity={0.5}
                        onPress={() => this.props.navigation.push('FriendProfile', {
                            uid: this.state.friendUID,
                        })}>
                        <Image source={{ uri: `${this.state.friendUrl || 'none'}` }} style={styles.imageContainer} />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.nameContainer}>{this.state.friendName}</Text>
                        <Text style={styles.statusContainer}>{this.state.friendStatus}</Text>
                    </View>
                </View>
                <GiftedChat
                    messagesContainerStyle={{ backgroundColor: '#FFF' }}
                    renderBubble={this.renderBubble}
                    renderSend={this.renderSend}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: this.state.uid,
                        displayName: `${this.state.displayName}`,
                        avatar: `${this.state.imageUrl}`,
                    }}
                />
            </>
        );
    }
}

export default Chat;

const styles = StyleSheet.create({
    header: {
        height: 60,
        backgroundColor: '#5C93C4',
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15
    },
    imageContainer: {
        marginLeft: 15,
        height: 50,
        width: 50,
        borderRadius: 50
    },
    nameContainer: {
        marginLeft: 15,
        fontSize: 18,
        color: '#FAF8F0'
    },
    statusContainer: {
        marginLeft: 15,
        fontSize: 12,
        color: '#FAF8F0'
    }
})
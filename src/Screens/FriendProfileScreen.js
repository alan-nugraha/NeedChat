import React, { Component } from 'react';
import { Text, View, Image, TouchableHighlight, TextInput, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from 'firebase'
import fire from '../Config/firebase'

class friendProfile extends Component {
    state = {
        displayName: '',
        uid: '',
        imageUrl: '',
        phone: '',
        status: '',
    }

    getLastSeen = async () => {
        const uid = await this.props.navigation.getParam('uid');
        const ref = firebase.database().ref(`/users/${uid}`);
        ref.on('value', async snapshot => {
            this.setState({
                status: snapshot.val().status,
            });
        })
    };

    async componentDidMount() {
        await this.setState({
            uid: await this.props.navigation.getParam('uid'),
        });
        const ref = firebase.database().ref(`/users/${this.state.uid}`)
        await ref.on('value', async snapshot => {
            console.log('snappppp', snapshot.val())
            await this.setState({
                displayName: snapshot.val().displayName,
                imageUrl: snapshot.val().imageUrl,
                phone: snapshot.val().phone,
                status: snapshot.val().status,
                latitude: snapshot.val().latitude,
                longitude: snapshot.val().longitude
            })
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.containerHeader}>
                    <TouchableHighlight
                        style={styles.touchChat}
                        onPress={() =>
                            this.props.navigation.push('Chat', {
                                uid: this.state.uid,
                            })
                        }
                        underlayColor="white"
                        activeOpacity={0.5}>
                        {/* <Icon name="gear" style={{alignSelf:'center'}} size={30} color="gray" /> */}
                        <Icon
                            name="comments-o"
                            style={{ alignSelf: 'center' }}
                            size={25}
                            color="#BEDAFA"
                        />
                    </TouchableHighlight>
                </View>
                <View style={styles.containerBottom}>
                    <Image style={styles.circle} source={{ uri: this.state.imageUrl }} />
                    <View style={styles.main} >
                        <View style={styles.profileItems}>
                            <Text style={{ fontSize: 18 }}>Name</Text>
                            <Text style={{ fontSize: 18 }}>{this.state.displayName}</Text>
                        </View>
                        <View style={styles.profileItems}>
                            <Text style={{ fontSize: 18 }}>Phone</Text>
                            <Text style={{ fontSize: 18 }}>{this.state.phone}</Text>
                        </View>
                        <View style={styles.profileItems}>
                            <Text style={{ fontSize: 18 }}>Status</Text>
                            <Text style={{ fontSize: 18 }}>{this.state.status}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}
export default friendProfile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5C93C4',
    },
    containerHeader: {
        padding: 40,
        height: '30%',
        width: '100%',
        justifyContent: 'space-between',
        flex: 1,
        flexDirection: 'row'
        // backgroundColor: 'pink'
    },
    containerBottom: {
        padding: 40,
        width: '100%',
        height: '70%',
        flexDirection: 'column',
        // alignItems: 'center',
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        backgroundColor: 'white',
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    circle: {
        // backgroundColor: '#262626',
        width: 160,
        height: 160,
        borderRadius: 100,
        borderWidth: 4,
        borderColor: '#384B60',
        top: -120,
        alignSelf: 'center'
    },
    saveButton: {
        marginTop: 10,
        width: '100%',
        backgroundColor: '#262626',
        borderRadius: 15,
        padding: 15,
    },
    profileItems: {
        flexDirection: 'row',
        fontSize: 24,
        justifyContent: 'space-between',
        alignContent: 'space-between',
        marginBottom: 20,

    },
    main: {
        // backgroundColor: 'red',
        top: -90
    },
    touchChat: {
        height: 50,
        width: 50,
        backgroundColor: '#FAF8F0',
        elevation: 4,
        borderRadius: 50,
        justifyContent: 'center',
        position: 'absolute',
        top: 30,
        left: 30,
    }
})
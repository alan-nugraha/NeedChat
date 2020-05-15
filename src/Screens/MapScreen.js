import React, { Component } from 'react';
import { Text, Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import fire from '../Config/firebase';

export default class Map extends Component {
    constructor() {
        super();
        this.state = {
            tracksViewChanges: true,
            userData: [],
            isVisible: false,
            imageUrl: '',
            uid: '',
            friendName: '',

            userUID: '',

            friendLatitude: '',
            friendLongitude: ''
        };
        this.getAllUser();
        // this.isVisible = true;
    }

    getAllUser = async () => {
        const ref = firebase.database().ref('/users');

        ref.on('value', async snapshot => {
            let data = [];
            await Object.keys(snapshot.val()).map(key => {
                data.push({
                    uid: key,
                    data: snapshot.val()[key],
                });
            });
            await this.setState({
                userData: data,
            });
            console.log('userdata', this.state.userData);
            console.log('laatitidute', this.state.userData[0].data.latitude);
        });
    };

    getUserData = async () => {
        const uid = firebase.auth().currentUser.uid
        this.setState({
            userUID: uid
        })
    }

    handleProfile = async (url, uid) => {
        this.setState({
            isVisible: !this.state.isVisible,
            imageUrl: url,
            uid
        })
        const ref = firebase.database().ref(`users/${uid}`)
        await ref.on('value', snapshot => {
            this.setState({
                friendName: snapshot.val().displayName,
            });
        })
    };

    stopTrackingViewChanges = () => {
        this.setState(() => ({
            tracksViewChanges: false,
        }));
    };

    componentDidMount() {
        this.getUserData()
    }

    render() {
        const { tracksViewChanges } = this.state;
        return (
            <>
                <MapView
                    onPress={() => this.setState({ isVisible: false })}
                    provider={PROVIDER_GOOGLE}
                    style={{ flex: 1 }}
                    initialRegion={{
                        latitude: -7.7584874,
                        longitude: 110.3781121,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}>
                    {this.state.userData.map(data => {
                        {
                            console.log('dataaaq', data.data.latitude);
                        }
                        return (
                            <Marker
                                onPress={() =>
                                    this.handleProfile(data.data.imageUrl, data.data.uid)
                                }
                                coordinate={{
                                    // latitude: -7.7584874,
                                    // longitude: 110.3781121,
                                    // latitudeDelta: 0.0922,
                                    // longitudeDelta: 0.0421,
                                    latitude: Number(data.data.latitude),
                                    longitude: Number(data.data.longitude),
                                }}
                                title={data.data.displayName}
                                description={data.data.status}
                                key={data.data.uid}>
                                <View style={styles.marker}>
                                    <Image style={styles.imageProfile} source={{ uri: `${data.data.imageUrl}` }} />
                                </View>
                            </Marker>
                        );
                    })}
                </MapView>
                {this.state.isVisible ? (
                    <View
                        style={{
                            flexDirection: 'row',
                            backgroundColor: '#fff',
                            paddingVertical: 10,
                        }}>
                        <View
                            style={{
                                flex: 0.5,
                                justifyContent: 'center',
                                paddingHorizontal: 20,
                            }}>
                            <Image
                                source={{ uri: `${this.state.imageUrl}` }}
                                style={styles.profileMap}
                            />
                        </View>
                        <View
                            style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                            <Text style={{ fontSize: 16, color: '#000' }}>
                                {this.state.friendName}
                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                                {this.state.uid === this.state.userUID ? (
                                    <TouchableOpacity style={styles.profile}
                                        onPress={() =>
                                            this.props.navigation.push('Profile', {
                                                uid: this.state.uid,
                                            })
                                        }>
                                        <Text style={{ color: 'white', fontSize: 16 }}>Profile</Text>
                                    </TouchableOpacity>
                                ) : (
                                        <TouchableOpacity style={styles.profile}
                                            onPress={() =>
                                                this.props.navigation.push('FriendProfile', {
                                                    uid: this.state.uid,
                                                })
                                            }>
                                            <Text style={{ color: 'white', fontSize: 16 }}>Profile</Text>
                                        </TouchableOpacity>
                                    )}
                                {this.state.uid == this.state.userUID ? null : (
                                    <TouchableOpacity style={styles.chat}
                                        onPress={() =>
                                            this.props.navigation.push('Chat', {
                                                uid: this.state.uid,
                                            })
                                        }>
                                        <Text style={{ color: 'white', fontSize: 16 }}>Chat</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>
                ) : null}
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    marker: {
        padding: 5,
        borderRadius: 20,
        elevation: 10,
    },
    imageProfile: {
        height: 40,
        width: 40,
        borderRadius: 20,
        borderColor: 'white',
        borderWidth: 1,
    },
    profile: {
        marginTop: 10,
        backgroundColor: '#5C93C4',
        width: 80,
        height: 30,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    chat: {
        marginTop: 10,
        backgroundColor: '#5C93C4',
        width: 80,
        height: 30,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileMap: {
        height: 110,
        width: 110,
        borderRadius: 100,
        borderColor: '#BEDAFA',
        borderWidth: 4,
        justifyContent: 'center',
    }
});
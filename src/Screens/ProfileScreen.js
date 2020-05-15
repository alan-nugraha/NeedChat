import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, ToastAndroid, PermissionsAndroid } from 'react-native'
import Firebase from '../Config/firebase'
import firebase from 'firebase'
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/FontAwesome';


class Profile extends Component {
    constructor() {
        super()
        this.state = {
            displayName: '',
            uid: '',
            imageUrl: '',
            phone: '',
            status: '',
            longitude: '',
            latitude: ''
        }
        this.getProfile()
        this.updateLocation()
    }

    getProfile = async () => {
        const uid = firebase.auth().currentUser.uid
        const ref = firebase.database().ref(`users/${uid}`)
        ref.on('value', snapshot => {
            this.setState({
                displayName: snapshot.val() != null ? snapshot.val().displayName : '',
                imageUrl: snapshot.val() != null ? snapshot.val().imageUrl : '',
                phone: snapshot.val() != null ? snapshot.val().phone : '',
                status: snapshot.val() != null ? snapshot.val().status : '',
                longitude: snapshot.val() != null ? snapshot.val().longitude : '',
                latitude: snapshot.val() != null ? snapshot.val().latitude : '',
            })
        })
    }

    updateLocation = async () => {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'ReactNativeCode Location Permission',
                message: 'ReactNativeCode App needs access to your location',
            }
        )
        if (granted) {
            await Geolocation.getCurrentPosition(
                async position => {
                    console.log('My current location', JSON.stringify(position))
                    await this.setState({
                        latitude: position.coords.latitude.toString(),
                        longitude: position.coords.longitude.toString()
                    })
                },
                error => {
                    console.log(error.code, error.message)
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 10000,
                },
            )
        }
    }

    handleUpdateLocation = async () => {
        const uid = firebase.auth().currentUser.uid;
        const { displayName, imageUrl, latitude, longitude, phone, status } = this.state
        const email = firebase.auth().currentUser.email;
        const ref = firebase.database().ref(`/users/${uid}`);
        setTimeout(async () => {
            await ref.set({
                email,
                uid,
                displayName,
                latitude,
                longitude,
                imageUrl: imageUrl,
                phone,
                status,
            })
            ToastAndroid.showWithGravity(
                `Location Updated`,
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
            )
        }, 2000)
    }

    componentDidMount() {
        const { displayName } = firebase.auth().currentUser
        this.setState({ displayName })
        this.getProfile()
        this.updateLocation()
    }
    signOutUser = () => {
        firebase
            .auth()
            .signOut().then(() => {
                this.props.navigation.navigate('LoginScreen')
            })
    }

    editHandler = () => {
        this.props.navigation.navigate('SetupProfileScreen')
        console.log('test', this.props.navigation);

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.containerHeader}>
                    <Text onPress={this.editHandler}><Icon style={{}} name='edit' size={30} /></Text>
                    <Text onPress={this.signOutUser}><Icon style={{}} name='sign-out' size={30} /></Text>
                </View>
                <View>

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
                        <Text style={styles.displayLocation} onPress={this.handleUpdateLocation}>
                            <Icon name="map-marker" size={20} /> Tap Here to Update Location
                        </Text>
                        {(this.latitude && this.longitude === '') || undefined || null ? (
                            <Text style={styles.displayLocation}>
                                Location is undefined please update your location
                            </Text>
                        ) : (
                                <Text style={styles.displayLocation}>
                                    {this.state.latitude}, {this.state.longitude}
                                </Text>
                            )}
                    </View>
                </View>
            </View>
        )
    }
}

export default Profile

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
        top: -120,
        alignSelf: 'center',
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
    displayLocation: {
        top: 10,
        textAlign: 'center',
        width: '100%',
        // backgroundColor: '#fff',
        marginTop: 10,
        fontSize: 18,
    },
})

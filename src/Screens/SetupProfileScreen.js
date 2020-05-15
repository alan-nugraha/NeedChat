import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid, Image, PermissionsAndroid, ScrollView } from 'react-native';
import Firebase from '../Config/firebase'
import firebase from 'firebase'
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/FontAwesome';


class Edit extends Component {
    static navigationOptions = {
        headerShown: false
    }
    constructor() {
        super()
        this.state = {
            displayName: "",
            imageUrl: "",
            phone: "",
            status: "",
            birthday: "",
            latitude: "",
            longitude: "",
        }
        this.getProfile()
    }
    componentDidMount() {
        const { displayName } = firebase.auth().currentUser
        this.setState({ displayName: displayName })
        this.getProfile()
    }
    updateProfile = async () => {
        const { displayName, status, phone, imageUrl, latitude, longitude } = this.state
        const uid = firebase.auth().currentUser.uid
        const email = firebase.auth().currentUser.email
        const ref = firebase.database().ref(`/users/${uid}`)

        setTimeout(async () => {
            await ref.set({
                uid: uid,
                email: email,
                displayName,
                status,
                phone,
                imageUrl,
                latitude,
                longitude
            })
            ToastAndroid.showWithGravity(
                'Data Updated',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
            )
        }, 3000)

        setTimeout(async () => {
            await this.props.navigation.navigate('Profile')
        }, 4000)
    }
    getProfile = async () => {
        const uid = firebase.auth().currentUser.uid
        let ref = firebase.database().ref(`/users/${uid}`)

        ref.on('value', snapshot => {
            this.setState({
                imageUrl: snapshot.val() != null ? snapshot.val().imageUrl : '',
                phone: snapshot.val() != null ? snapshot.val().phone : '',
                status: snapshot.val() != null ? snapshot.val().status : '',
                latitude: snapshot.val() != null ? snapshot.val().latitude : '',
                longitude: snapshot.val() != null ? snapshot.val().longitude : ''
            })
        })
    }

    backButtonHandler = () => {
        this.props.navigation.navigate('Profile')
        console.log('aoa', this.props.navigation);

    }
    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.arrowIcon} activeOpacity={1} onPress={this.backButtonHandler}>
                    <Icon name="arrow-left" style={styles.backIcon} />
                </TouchableOpacity>
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.ImageIcon}
                        source={require('../../assets/register.png')}
                    />
                </View>
                <View style={styles.headerContainer}>
                    <Text style={{ fontSize: 30 }}>Hi, {this.state.displayName}</Text>
                    <Text style={{ fontSize: 17, color: '#262626' }}>
                        Configure your profile
                    </Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} style={styles.formContainer}>
                    <View >
                        <TextInput
                            onChangeText={value => this.setState({ imageUrl: value })}
                            style={styles.inputForm}
                            placeholder="Profile Image URL"
                        />
                        <TextInput
                            onChangeText={value => this.setState({ phone: value })}
                            style={styles.inputForm}
                            placeholder="Phone Number"
                            keyboardType="numeric"
                        />
                        <TextInput
                            onChangeText={value => this.setState({ status: value })}
                            style={styles.inputFormBio}
                            placeholder="Bio"
                            multiline={true}
                        />
                    </View>

                    <View style={styles.formButtonContainer}>
                        <TouchableOpacity
                            style={styles.formSaveButton}
                            onPress={this.updateProfile}>
                            <Text style={{ color: '#fff', fontSize: 20, textAlign: 'center' }}>
                                Save
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export default Edit;

const styles = StyleSheet.create({
    container: {
        padding: 15,
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center'
    },
    imageContainer: {
        width: 230,
        height: 150
    },
    ImageIcon: {
        width: '100%',
        height: '100%'
    },
    headerContainer: {
        marginTop: 20,
        width: '100%',
        textAlign: 'left',
    },
    formContainer: {
        marginTop: 15,
        width: '100%',
    },
    inputForm: {
        height: 50,
        marginBottom: 15,
        padding: 10,
        borderRadius: 10,
        fontSize: 17,
        borderWidth: 1,
        borderColor: '#B2B2B2',
    },
    inputFormBio: {
        height: 80,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 10,
        fontSize: 17,
        borderWidth: 1,
        borderColor: '#B2B2B2',
    },
    formButtonContainer: {
        width: '100%',
    },

    formSaveButton: {
        backgroundColor: '#5C93C4',
        padding: 10,
        marginVertical: 10,
        borderRadius: 10,
    },
    signUpLinkContainer: {
        marginVertical: 10,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    circleImageContainer: { width: 500, height: 210 },
    circleImage: {
        zIndex: -1,
        position: 'absolute',
        bottom: 5,
        width: 260,
        height: '100%',
    },
    errorMessage: {
        marginTop: 10,
        width: '100%',
    },
    errorText: {
        textAlign: 'center',
        color: 'red',
        fontSize: 16
    },
    backIcon: {
        fontSize: 24,
        fontWeight: 'normal',
    },
    arrowIcon: {
        paddingRight: '90%',
    }
})
import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, TextInput, PermissionsAndroid } from 'react-native'
import Firebase from '../Config/firebase'
import firebase from 'firebase'

class Register extends Component {

    static navigationOptions = {
        headerShown: false
    }
    state = {
        displayName: "",
        email: "",
        password: "",
        errorMessage: null
    }

    handleRegister = () => {
        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(userCredentials => {
                return userCredentials.user.updateProfile({
                    displayName: this.state.displayName,
                })
            })
            .then(async () => {
                const uid = await firebase.auth().currentUser.uid
                const email = await firebase.auth().currentUser.email
                const ref = await firebase.database().ref(`/users/${uid}`)
                const imageUrl = 'https://www.securities-services.societegenerale.com/uploads/tx_bisgbio/default-profile.png'
                await ref.set({
                    uid: uid,
                    email: email,
                    displayName: this.state.displayName,
                    imageUrl: imageUrl,
                    latitude: '',
                    longitude: '',
                    status: '',
                    phone: ''
                })
            })
            .catch(error => this.setState({ errorMessage: error.message }))
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.greeting}>Register</Text>

                <View style={styles.errorMessage}>
                    {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                </View>

                <View style={styles.form}>
                    <View>
                        <Text style={styles.inputTitle}>Full Name</Text>
                        <TextInput style={styles.input}
                            autoCapitalize="none"
                            onChangeText={displayName => this.setState({ displayName })}
                            value={this.state.displayName}
                        ></TextInput>
                    </View>

                    <View style={{ marginTop: 32 }}>
                        <Text style={styles.inputTitle}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            autoCapitalize="none"
                            onChangeText={email => this.setState({ email })}
                            value={this.state.email}
                        ></TextInput>
                    </View>

                    <View style={{ marginTop: 32 }}>
                        <Text style={styles.inputTitle}>Password</Text>
                        <TextInput style={styles.input}
                            autoCapitalize="none"
                            secureTextEntry
                            onChangeText={password => this.setState({ password })}
                            value={this.state.password}
                        ></TextInput>
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={this.handleRegister}>
                    <Text style={{ color: '#fff' }}>Sign up</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ alignSelf: 'center', marginTop: 32 }} onPress={() => this.props.navigation.navigate('Login')}>
                    <Text style={{ color: '#000', fontSize: 13 }}>Sign in</Text>
                </TouchableOpacity>
            </View >

        )
    }
}
export default Register

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    greeting: {
        marginTop: 32,
        fontSize: 18,
        textAlign: 'center',
        color: '#5C93C4',
        fontWeight: "400"
        // marginBottom: 50
    },
    errorMessage: {
        height: 72,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 30
    },
    error: {
        color: '#E9446A',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center'
    },
    form: {
        marginBottom: 48,
        marginHorizontal: 30,
    },
    inputTitle: {
        color: '#8A8F9E',
        fontSize: 10,
        textTransform: 'uppercase',
    },
    input: {
        borderBottomColor: '#8A8F9E',
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        fontSize: 15,
        color: '#161F3D',
    },
    button: {
        marginHorizontal: 30,
        backgroundColor: '#5C93C4',
        borderRadius: 4,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
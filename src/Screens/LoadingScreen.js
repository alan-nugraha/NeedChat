import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as firebase from 'firebase';
// import {useNavigation} from '@react-navigation/native';
const LoadingScreen = props => {
    // const navigation = useNavigation();
    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            props.navigation.navigate(user ? 'App' : 'Auth');
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <View style={styles.container}>
            <Text>Loading ...</Text>
            <ActivityIndicator size="large" />
        </View>
    );
};

export default LoadingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
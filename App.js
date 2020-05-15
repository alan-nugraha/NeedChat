import React from 'react'
import Login from './src/Screens/LoginScreen'
import Register from './src/Screens/RegisterScreen'
import Loading from './src/Screens/LoadingScreen'
import Contact from './src/Screens/ContactScreen'
import Chat from './src/Screens/ChatScreen'
import Map from './src/Screens/MapScreen'
import FriendProfile from './src/Screens/FriendProfileScreen'
import SetupProfile from './src/Screens/SetupProfileScreen'
import Profile from './src/Screens/ProfileScreen'
import { createStackNavigator } from 'react-navigation-stack'
import { createSwitchNavigator, createAppContainer } from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Firebase from './src/Config/firebase'
import Icon from 'react-native-vector-icons/FontAwesome';

const ContactStack = createStackNavigator(
  {
    Chat: {
      screen: Chat
    },
    Contact: {
      screen: Contact
    },
  },
  {
    initialRouteName: "Contact",
    headerMode: 'none'
  }
)

const MapStack = createStackNavigator(
  {
    Map: {
      screen: Map
    },
    FriendProfile: {
      screen: FriendProfile
    },
    Profile: {
      screen: Profile
    },
    Chat: {
      screen: Chat
    }
  },
  {
    initialRouteName: "Map",
    headerMode: 'none'
  }
)

const AppTabNavigator = createBottomTabNavigator(
  {
    Map: {
      screen: MapStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon color={tintColor} name="compass" size={30} />
        ),
        header: null,
      },
    },
    Contact: {
      screen: ContactStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon color={tintColor} name="comments" size={30} />
        ),
        header: null,
      },
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon color={tintColor} name="user" size={30} />
        ),
        header: null,
      },
    },
  },
  {
    initialRouteName: "Profile",
    tabBarOptions: {
      activeTintColor: '#5C93C4',
      inactiveTintColor: '#b2b2b2',
      showLabel: false,
      inactiveBackgroundColor: '#fff',
    },
  },
);

const AuthStack = createStackNavigator({
  Login: Login,
  Register: Register,
})

const SetupProfileStack = createStackNavigator({
  SetupProfileScreen: SetupProfile,
})

AuthStack.navigationOptions = {
  headerMode: 'none'
}

export default createAppContainer(
  createSwitchNavigator(
    {
      Loading: Loading,
      App: AppTabNavigator,
      Auth: AuthStack,
      Setup: SetupProfileStack,
    },
    {
      initialRouteName: "Loading",
    }
  )
)
import Firebase from 'firebase';

let config = {
    apiKey: "AIzaSyCu69OF4Zjc0avOtERhxsD4Q8B8vaUN37A",
    authDomain: "needchat-8f63a.firebaseapp.com",
    databaseURL: "https://needchat-8f63a.firebaseio.com",
    projectId: "needchat-8f63a",
    storageBucket: "needchat-8f63a.appspot.com",
    messagingSenderId: "1023482728",
    appId: "1:1023482728:web:8b605fdd85fd82000214dd"
};

let app = Firebase.initializeApp(config)
export const db = app.database()
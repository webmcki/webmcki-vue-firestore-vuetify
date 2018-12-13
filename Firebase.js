import firebase from 'firebase/app'
import 'firebase/firestore'
const settings = { timestampsInSnapshots: true}

const config = {
    apiKey: "AIzaSyDUMSy8RdxPXM0IH-715U4882mQM5iAwmM",
    authDomain: "webmcki-vue-firestore-vuetify.firebaseapp.com",
    databaseURL: "https://webmcki-vue-firestore-vuetify.firebaseio.com",
    projectId: "webmcki-vue-firestore-vuetify",
    storageBucket: "webmcki-vue-firestore-vuetify.appspot.com",
    messagingSenderId: "83105738804"
}

firebase.initializeApp(config)

firebase.firestore().settings(settings)

export default firebase
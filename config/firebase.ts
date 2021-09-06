import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBIl8PliTg140lUo2dTr7XEFuy51xwW5tY",
    authDomain: "tcc-project-dev.firebaseapp.com",
    projectId: "tcc-project-dev",
    storageBucket: "tcc-project-dev.appspot.com",
    messagingSenderId: "429551380261",
    appId: "1:429551380261:web:d7a886afec6c1635abdccc"
  };
  
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const app = firebase.app();
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
export { auth, db, storage};
console.log(app.name ? 'Firebase mode Activated!' : 'Firebase not working :(');
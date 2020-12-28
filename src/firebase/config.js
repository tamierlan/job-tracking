import app from 'firebase/app';
import 'firebase/firestore';


var firebaseConfig = {
  apiKey: "AIzaSyCwNDhYEsNsihtMeY_Bec3DAGgrch_ieEY",
  authDomain: "job-listing-39005.firebaseapp.com",
  projectId: "job-listing-39005",
  storageBucket: "job-listing-39005.appspot.com",
  messagingSenderId: "1093635462678",
  appId: "1:1093635462678:web:c71ea9a70773ebc90a4737"
};
const firebase = app.initializeApp(firebaseConfig);

const firestore = firebase.firestore();



export { firebase, firestore, app };

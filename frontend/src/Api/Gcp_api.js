import axios from 'axios';
import firebase from "firebase";

const firebaseConfig = {
    apiKey: process.env.GCP_apiKey,
    authDomain: process.env.GCP_authDomain,
    projectId: process.env.GCP_projectId,
    storageBucket: process.env.GCP_storageBucket,
    messagingSenderId: process.env.GCP_messagingSenderId,
    appId: process.env.GCP_appId,
    measurementId: process.env.GCP_measurementId,
  };

  export default class Gcp_api {

    firebaseApp = firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();

    userCollectionTable = "users"

    async addUserInfo(userInfo) {
        
        db.settings({
            timestampsInSnapshots: true
          });

        this.db.collection(this.userCollectionTable).add(userInfo)
    }

  }




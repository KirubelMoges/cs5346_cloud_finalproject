import axios from 'axios';

  export default class Gcp_api {

    url = 'http://localhost:8000'

    config = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
    };

    userCollectionTable = "users"

    async addUserInfo(userInfo) {

        db.settings({
            timestampsInSnapshots: true
          });

        this.db.collection(this.userCollectionTable).add(userInfo)
    }

  }




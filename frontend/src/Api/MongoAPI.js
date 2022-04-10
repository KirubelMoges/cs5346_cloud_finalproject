import axios from 'axios';

  export default class MongoAPI {

    url = 'http://localhost:8000'

    config = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
    };

    async addUserInfo(userInfo) {
      const {data} = await axios.post(this.url + '/addUserInfo', JSON.stringify({userInfo}), this.config);
      return data
    }

    async getUserInfo(faceId) {
      const {data} = await axios.get(this.url + '/getUserInfo', JSON.stringify({faceId}), this.config);
      return data
    }

    async addProductInfo(productInfo) {
      const {data} = await axios.post(this.url + '/addProductInfo', JSON.stringify({productInfo}), this.config);
      return data
    }

    async addPurchaseInfo(purchaseInfo) {
      const {data} = await axios.post(this.url + '/addPurchaseInfo', JSON.stringify({purchaseInfo}), this.config);
      return data
    }

  }




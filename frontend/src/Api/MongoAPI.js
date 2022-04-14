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

    async getUserInfoByFaceId(faceId) {
      const {data} = await axios.get(this.url + `/getUserInfoByFaceId?faceId=${faceId}`, this.config);
      return data
    }

    async getUserInfoById(id) {
      const {data} = await axios.get(this.url + `/getUserById?id=${id}`, this.config);
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

    async deleteUserInfo(id) {
      const {data} = await axios.delete(this.url + `/deleteUserById?id=${id}`, this.config);
      return data
    }

  }




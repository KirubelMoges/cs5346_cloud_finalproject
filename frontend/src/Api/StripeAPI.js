import axios from 'axios';

  export default class StripeAPI {
    url = 'http://localhost:8000'

    config = {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
      };

    async createCustomerPaymentProfile(userPaymentInfo) {
        console.log("Inside stripe frontend: ", userPaymentInfo)
        const {data} = await axios.post(this.url + '/initialPaymentInfo', JSON.stringify({userPaymentInfo}), this.config);
        return data
    }
  }
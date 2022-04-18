import axios from 'axios';
import * as Host from '../cloud'
  export default class StripeAPI {

    url = Host.isHostedOnCloud? Host.hostedIpAddress : 'http://localhost:8000'

    config = {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
      };

    async createCustomerPaymentProfile(userPaymentInfo) {
        const {data} = await axios.post(this.url + '/initialPaymentInfo', JSON.stringify({userPaymentInfo}), this.config);
        return data
    }

    async chargeCustomer(content) {
      const {data} = await axios.post(this.url + '/payment', JSON.stringify({content}), this.config);
      return data
  }

  }
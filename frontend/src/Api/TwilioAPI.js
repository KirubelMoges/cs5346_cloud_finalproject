import axios from 'axios';
import * as Host from '../cloud'
  export default class TwilioAPI {

    url = Host.isHostedOnCloud? Host.hostedIpAddress : 'http://localhost:8000'

    config = {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
      };

    async sendMessage(messageContent) {
        const data = await axios.post(this.url + '/twilioMessage', JSON.stringify({messageContent}), this.config);
        return data
    }
  }
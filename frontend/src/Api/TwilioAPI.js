import axios from 'axios';

  export default class TwilioAPI {
    url = 'http://localhost:8000'

    config = {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
      };

    async sendMessage(messageContent) {
        const {data} = await axios.post(this.url + '/twilioMessage', JSON.stringify({messageContent}), this.config);
        return data
    }
  }
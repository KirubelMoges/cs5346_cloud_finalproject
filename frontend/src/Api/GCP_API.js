import axios from 'axios';
import * as Host from '../cloud'
export default class GCP_API {

  url = Host.isHostedOnCloud? Host.hostedIpAddress : 'http://localhost:8000'

    config = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
    };


    async processSpeech(sentence) {
        const {data} = await axios.post(this.url + "/processSpeechGCP", JSON.stringify({sentence}), this.config)
        return data
    }

}
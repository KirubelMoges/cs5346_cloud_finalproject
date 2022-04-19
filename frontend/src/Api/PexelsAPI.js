import axios from 'axios';
import * as Host from '../cloud'
export default class Pexels_API {

  url = Host.isHostedOnCloud? Host.hostedIpAddress : Host.localIpAddress
    
    config = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    };

    async searchForImages(query) {
        const {data} = await axios.get(this.url + `/searchPexels?query=${query}`, this.config);
        return data
    }
}

import axios from 'axios';

export default class Pexels_API {

    url = 'http://localhost:8000'
    
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

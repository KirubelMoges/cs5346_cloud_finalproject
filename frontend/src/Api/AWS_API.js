import axios from 'axios';
import * as Host from '../cloud'

export default class AWS_API {

    url = Host.isHostedOnCloud? Host.hostedIpAddress : 'http://localhost:8000'

    config = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
    };

    async searchUser(userImage) {
        const {data} = await axios.post(this.url + '/searchuser', JSON.stringify({userImage}), this.config);
        return data
    }

    async detectFaces(userImage) {
        const {data} = await axios.post(this.url + '/detectfaces', JSON.stringify({userImage}), this.config);
        return data
    }

    async detectLabels(productImage) {
        const {data} = await axios.post(this.url + '/detectLabels', JSON.stringify({productImage}), this.config);
        return data
    }

    async addFacialFeature(userImage) {
        const {data} = await axios.post(this.url + '/indexFacialFeatureToCollection', JSON.stringify({userImage}), this.config);
        return data
    }

    async deleteUserByFaceId(faceId) {
        const {data} = await axios.delete(this.url + `/deleteUserFeatureByFaceId?faceId=${faceId}`, this.config)
        return data
    }

    async processSpeech(sentence) {
        const {data} = await axios.post(this.url + "/processSpeechAWS", JSON.stringify({sentence}), this.config)
        return data
    }
};

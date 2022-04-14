import axios from 'axios';

export default class AWS_Rekognition_API_Repository {

    url = 'http://localhost:8000'

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
        console.log("AWS API deleteUserByFaceId: ",{faceId})
        const {data} = await axios.delete(this.url + `/deleteUserFeatureByFaceId?faceId=${faceId}`, this.config)
        return data
    }
};

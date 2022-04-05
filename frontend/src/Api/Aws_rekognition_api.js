import axios from 'axios';

export default class AWS_Rekognition_API_Repository {

    url = 'http://localhost:8000'

    config = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
    };

    async searchUser(userImageFile) {
      const errors = {};
        const { data, status } = await axios.get(this.url + '/searchuser', {
            params: { userImageFile }
          });

          if (status >= 201) {
            console.log(data);
            errors.request = 'Bad Request';
          } 
    
          return [data.data, errors];
    }

    async detectFaces(userImage) {
      console.log("Inside frontend detect faces...", userImage)

      const errors = {};

       const { data, status } = await axios.post(this.url + '/detectfaces', JSON.stringify({userImage}), config);

          if (status >= 201) {
            console.log(data);
            errors.request = 'Bad Request';
          } 
    
          return [data.data, errors];
    }

    async addFace(userImageFile) {
      const errors = {};
        const { data, status } = await axios.get(this.url + '/addface', {
            params: { userImageFile }
          });

          if (status >= 201) {
            console.log(data);
            errors.request = 'Bad Request';
          } 
    
          return [data.data, errors];
    }

    async deleteUser(userImageFile) {
      const errors = {};
        const { data, status } = await axios.get(this.url + '/deleteuser', {
            params: { userImageFile }
          });

          if (status >= 201) {
            console.log(data);
            errors.request = 'Bad Request';
          } 
    
          return [data.data, errors];
    }
};

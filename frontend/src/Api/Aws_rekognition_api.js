import axios from 'axios';

export default class AWS_Rekognition_API_Repository {

    url = 'http://localhost:8000'

    async searchUser(userImageFile) {
      const errors = {};
        const { data, status } = await axios.get(this.url + '/searchuser', {
            params: { userImageFile }
          });

          if (status >= 201) {
            console.log(data);
            errors.request = 'Bad Request';
          } else if (data.status === 1) {
            errors.reason = 'ERROR_Rekog1';
          } else errors.success = true;
      
          return [data.data, errors];
    }

    async detectFaces(userImage) {
      console.log("Inside frontend detect faces...")
      const errors = {};
        const { data, status } = await axios.get(this.url + '/detectfaces', {
            params: {userImage}
          });

          if (status >= 201) {
            console.log(data);
            errors.request = 'Bad Request';
          } else if (data.status === 1) {
            errors.reason = 'ERROR_Rekog2';
          } else errors.success = true;
      
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
          } else if (data.status === 1) {
            errors.reason = 'ERROR_Rekog3';
          } else errors.success = true;
      
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
          } else if (data.status === 1) {
            errors.reason = 'ERROR_Rekog4';
          } else errors.success = true;
      
          return [data.data, errors];
    }
};

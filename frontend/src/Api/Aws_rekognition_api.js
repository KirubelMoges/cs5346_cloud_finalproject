import axios from 'axios';

export default class AWS_Rekognition_API_Repository {

    URL = 'http://localhost:8000'

    async searchUser(userImageFile) {
      const errors = {};
        const { data, status } = await axios.get(URL + '/searchuser', {
            params: { userImageFile }
          });

          if (status >= 201) {
            console.log(data);
            errors.request = 'Bad Request';
          } else if (data.status === 1) {
            errors.reason = 'Still clocked in, clock out before clocking in.';
          } else errors.success = true;
      
          return [data.data, errors];
    }

    async detectFaces(userImageFile) {
      const errors = {};
        const { data, status } = await axios.get(URL + '/detectfaces', {
            params: { userImageFile }
          });

          if (status >= 201) {
            console.log(data);
            errors.request = 'Bad Request';
          } else if (data.status === 1) {
            errors.reason = 'Still clocked in, clock out before clocking in.';
          } else errors.success = true;
      
          return [data.data, errors];
    }

    async addFace(userImageFile) {
      const errors = {};
        const { data, status } = await axios.get(URL + '/addface', {
            params: { userImageFile }
          });

          if (status >= 201) {
            console.log(data);
            errors.request = 'Bad Request';
          } else if (data.status === 1) {
            errors.reason = 'Still clocked in, clock out before clocking in.';
          } else errors.success = true;
      
          return [data.data, errors];
    }

    async deleteUser(userImageFile) {
      const errors = {};
        const { data, status } = await axios.get(URL + '/deleteuser', {
            params: { userImageFile }
          });

          if (status >= 201) {
            console.log(data);
            errors.request = 'Bad Request';
          } else if (data.status === 1) {
            errors.reason = 'Still clocked in, clock out before clocking in.';
          } else errors.success = true;
      
          return [data.data, errors];
    }
};

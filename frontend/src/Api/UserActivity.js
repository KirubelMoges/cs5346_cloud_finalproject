import MongoAPI from "./MongoAPI";
import AWS_API from './AWS_API'
export class UserActivity {
  mongoAPI = new MongoAPI()
  awsAPI = new AWS_API()
    currentUser() {
        const mgid = localStorage.getItem("mgid");
        if (!mgid) return {};
        return JSON.stringify({mgid})
      }


    async getUserInfo() {
      const mgid = localStorage.getItem("mgid");
      let id = mgid
      if(id) {
        try{
          const user = await this.mongoAPI.getUserInfoById(id)
          if(user['data']) {
            return user['data']
          }
        } catch(e) {
          return {}
        }
        return {}
      }
      return {}
    }

    isUserLoggedIn() {
        return Object.keys(this.currentUser()).length !== 0;
      }

    logOutUser() {
        localStorage.removeItem("mgid");
        window.location.reload()
    }

    logInUser(documentId) {
        localStorage.setItem("mgid", documentId)
        window.location.reload()
    }

    async deleteUserData() {
      const mgid = localStorage.getItem("mgid");
      let id = mgid

      try{
        const data1 = await this.mongoAPI.getUserInfoById(id)
        const res_mongo = await this.mongoAPI.deleteUserInfo(id)
        const res_aws = await this.awsAPI.deleteUserByFaceId(data1['data']['faceId'])
        this.logOutUser()
      } catch(e) {
        console.log("Error Deleting User Account in UserActivity.js")
      }

    }
}
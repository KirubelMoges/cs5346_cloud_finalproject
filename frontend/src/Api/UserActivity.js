import MongoAPI from "./MongoAPI";
export class UserActivity {
  mongoAPI = new MongoAPI()
    currentUser() {
        const mgid = localStorage.getItem("mgid");
        if (!mgid) return {};
        return JSON.stringify({mgid})
      }


    async getUserInfo() {
      const {mgid: id} = localStorage.getItem("mgid");
      if(id) {
        const user = await this.mongoAPI.getUserInfoById(id)
        if(user['data']) {
          return JSON.stringify(user['data'])
        }
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

    logInUser(userId) {
        localStorage.setItem("mgid", userId)
        window.location.reload()
    }
}
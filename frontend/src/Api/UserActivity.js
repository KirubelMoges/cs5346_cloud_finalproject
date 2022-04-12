import MongoAPI from "./MongoAPI";
export class UserActivity {
  mongoAPI = new MongoAPI()
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

    logInUser(userId) {
        localStorage.setItem("mgid", userId)
        window.location.reload()
    }
}
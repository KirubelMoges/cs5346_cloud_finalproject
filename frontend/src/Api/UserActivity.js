export class UserActivity {
    currentUser() {
        const user = localStorage.getItem("mustang-go-userId");
        if (!user) return {};
        return JSON.stringify(user)
      }

    isUserLoggedIn() {
        return Object.keys(this.currentUser()).length !== 0;
      }

    logOutUser() {
        localStorage.removeItem("user");
        window.location.reload()
    }

    logInUser(userId) {
        localStorage.setItem("user", userId)
        window.location.reload()
    }
}
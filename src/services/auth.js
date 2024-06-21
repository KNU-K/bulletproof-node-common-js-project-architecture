class AuthService {
    /** DB가 들어가야할듯 */
    /**
     *
     * @param {userModel} userModel
     */
    constructor(userModel) {
        this.userModel = userModel
    }
    join = async (user) => {
        return ['user', 'token']
    }
    login = async ({ email, password }) => {
        return ['user', 'token']
    }
}

module.exports = AuthService

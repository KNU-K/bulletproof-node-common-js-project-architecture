const UserPublisher = require('../publishers/user')
const userModel = require('../models/user')
const { userEvents } = require('../subscribers/events')
class AuthService {
    /** DB가 들어가야할듯 */
    /**
     *
     * @param {userModel} userModel
     * @param {UserPublisher} userPublisher
     */
    constructor(userModel, userPublisher) {
        this.userModel = userModel
        this.userPublisher = userPublisher
    }
    join = async (user) => {
        try {
            const newUser = new this.userModel(user)
            await newUser.save()
            await this.userPublisher.publish(userEvents.join, { email: user.email })

            //해당 토큰 자리에 실제 jwt 로 token을 만들어서 넣으면 됩니다.
            return ['user', 'token']
        } catch (err) {
            console.log(err)
            throw new Error('유저를 만드는 것 실패')
        }
    }
    login = async ({ email, password }) => {
        try {
            //   this.UserPublisher.publish('onUserJoin')
            const foundUser = await this.userModel.findOne({ email: email })
            if (foundUser.password !== password) throw new Error('로그인에 실패하였습니다.')
            await this.userPublisher.publish(userEvents.login, { email: email })

            //해당 토큰 자리에 실제 jwt 로 token을 만들어서 넣으면 됩니다.
            return ['user', 'token']
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}

module.exports = AuthService

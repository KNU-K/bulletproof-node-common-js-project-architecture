const { default: Container } = require('typedi')
const UserController = require('../api/controllers/user')
const AuthController = require('../api/controllers/auth')
const AuthService = require('../services/auth')
const { Logger } = require('./logger')
const UserPublisher = require('../publishers/user')

module.exports = async (models) => {
    try {
        models.forEach((model) => Container.set(model.name, model.model))
        const userModel = Container.get('userModel')
        if (!userModel) {
            throw new Error('User model not found in container')
        }

        /**Publisher 주입 */
        // const userPublisher = new UserPublisher()
        // Container.set('serPublisher', userPublisher)

        /**서비스 주입 **/

        const authServiceInstance = new AuthService(userModel)
        //        const authServiceInstance = new AuthService(userModel, userPublisher)
        Container.set('authService', authServiceInstance)

        // 컨트롤러 주입
        const userControllerInstance = new UserController()
        const authControllerInstance = new AuthController(authServiceInstance)
        Container.set('userController', userControllerInstance)
        Container.set('authController', authControllerInstance)
    } catch (err) {
        Logger.error('🔥 Error on dependency injector loader: %o', err)
        throw err
    }
}

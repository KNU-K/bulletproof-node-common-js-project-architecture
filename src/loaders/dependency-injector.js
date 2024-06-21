const { default: Container } = require('typedi')
const UserController = require('../api/controllers/user')
const AuthController = require('../api/controllers/auth')
const AuthService = require('../services/auth')

module.exports = async (mongoConnection, models) => {
    try {
        models.forEach((model) => Container.set(model.name, model.model))
        const userModel = Container.get('userModel')
        if (!userModel) {
            throw new Error('User model not found in container')
        }
        const authServiceInstance = new AuthService(userModel)
        Container.set('authService', authServiceInstance)

        // 컨트롤러 주입
        const userControllerInstance = new UserController()
        const authControllerInstance = new AuthController(authServiceInstance)
        Container.set('userController', userControllerInstance)
        Container.set('authController', authControllerInstance)
    } catch (err) {
        LoggerInstance.error('🔥 Error on dependency injector loader: %o', e)
        throw e
    }
}

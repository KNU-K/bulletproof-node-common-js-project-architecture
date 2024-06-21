const { Router } = require('express')
const user = require('./routes/user')
const auth = require('./routes/auth')

const { default: Container } = require('typedi')

module.exports = () => {
    const app = Router()
    const userController = Container.get('userController')
    const authController = Container.get('authController')
    user(app, userController)
    auth(app, authController)
    return app
}

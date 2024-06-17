const { Router } = require('express')
const user = require('./routes/user')
const auth = require('./routes/auth')
const UserController = require('./controllers/user')
const AuthController = require('./controllers/auth')

module.exports = () => {
    const app = Router()
    user(app, new UserController())
    auth(app, new AuthController())
    return app
}

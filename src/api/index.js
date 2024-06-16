const { Router } = require('express')
const user = require('./routes/user')
const auth = require('./routes/auth')

module.exports = () => {
    const app = Router()
    user(app)
    auth(app)
    return app
}

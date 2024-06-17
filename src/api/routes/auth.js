const { Router } = require('express')
const AuthController = require('../controllers/auth')
const route = Router()
/**
 *
 * @param {Router} app
 * @param {AuthController} authController
 */
module.exports = (app, authController) => {
    app.use('/auth', route)
}

const { Router } = require('express')
const UserController = require('../controllers/user')
const route = Router()
/**
 *
 * @param {Router} app
 * @param {UserController} userController
 */
module.exports = (app, userController) => {
    app.use('/user', route)
    /**마이페이지에 대한 API 추가 */
}

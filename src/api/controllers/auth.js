const { default: Container } = require('typedi')
const AuthService = require('../../services/auth')
const User = require('../../utils/user-builder')

class AuthController {
    /**
     *
     * @param {AuthService} authService
     */
    constructor(authService) {
        this.authService = authService
    }
    /**
     * @param {import("express").Request}req
     * @param {import("express").Response}res
     * @param {import("express").NextFunction}next
     */
    join = async (req, res, next) => {
        try {
            /**input initial Data */
            const { name, email, password, role } = req.body
            const newUser = new User()
                .setName(name)
                .setEmail(email)
                .setPassword(password)
                .setRole(role)
                .build()

            /**processing */
            const [user, token] = await this.authService.join(newUser)
            /**response */
            return res.status(200).json({ user, token })
        } catch (err) {
            return next(err)
        }
    }

    /**
     * @param {import("express").Request}req
     * @param {import("express").Response}res
     * @param {import("express").NextFunction}next
     */
    login = async (req, res, next) => {
        try {
            /**input initial Data */
            const { email, password } = req.body
            /**processing */
            const [user, token] = await this.authService.login({
                email,
                password,
            })
            return res.status(200).json({ user, token })
        } catch (error) {
            return next(error) // Pass error to the error handling middleware
        }
    }
}

module.exports = AuthController

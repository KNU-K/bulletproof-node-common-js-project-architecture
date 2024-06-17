class UserController {
    /**
     * @param {import("express").Request}req
     * @param {import("express").Response}res
     * @param {import("express").NextFunction}next
     */
    async join(req, res, next) {
        return res.status(200).send('join')
    }
    /**
     * @param {import("express").Request}req
     * @param {import("express").Response}res
     * @param {import("express").NextFunction}next
     */
    async login(req, res, next) {
        return res.status(200).send('login')
    }
}

module.exports = UserController

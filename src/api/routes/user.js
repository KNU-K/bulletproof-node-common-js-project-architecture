const { Router } = require('express')
const route = Router()
/**
 *
 * @param {Router} app
 */
module.exports = (app) => {
    app.use('/user', route)
    /** example
     * route.get("/test", (req, res) => {
     *         res.send("hello");
     *     });
     */
}

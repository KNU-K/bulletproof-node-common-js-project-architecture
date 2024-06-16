const express = require('express')
const loader = require('./loaders')
async function createApp() {
    const app = express()

    await loader.init({ expressApp: app })

    return app
}

module.exports = createApp

const createApp = require('./app')
const { Logger } = require('./loaders/logger')

async function startServer() {
    const app = await createApp()
    const port = process.env.PORT || 8000
    app.listen(port, () => {
        Logger.info(`Server is running on port ${port}`)
    })
}
startServer()

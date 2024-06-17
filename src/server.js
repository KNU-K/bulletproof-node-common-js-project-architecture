const createApp = require('./app')
const { port } = require('./config')
const { Logger } = require('./loaders/logger')

async function startServer() {
    const app = await createApp()
    app.listen(port, () => {
        Logger.info(`Server is running on port ${port}`)
    })
}
startServer()

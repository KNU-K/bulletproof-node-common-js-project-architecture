const Queue = require('bull')
const { Logger } = require('./logger')

module.exports = async () => {
    const queue = new Queue('queue', { redis: { port: 6379, host: 'localhost' } })
    await queue
        .isReady()
        .then(() => {
            Logger.info('Queue loaded and connected')
        })
        .catch((err) => {
            Logger.error('Queue loaded and errored')
        })
    return queue
}

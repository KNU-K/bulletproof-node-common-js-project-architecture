class UserPublisher {
    constructor(queue) {
        this.queue = queue
    }

    publish = async (event, data) => {
        console.log(data)
        console.log('queue')
        await this.queue.add(event, data)
        console.log(`Dispatched ${event} task`)
    }
}

module.exports = UserPublisher

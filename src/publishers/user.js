class UserPublisher {
    constructor(queue) {
        this.queue = queue
    }

    async publish(event, data) {
        await this.queue.add(event, data)
        console.log(`Dispatched ${event} task`)
    }
}

module.exports = UserPublisher

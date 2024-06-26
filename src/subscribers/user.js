class UserSubscriber {
    constructor(queue) {
        this.queue = queue
        this.initialize()
    }

    processJob = async (job) => {
        const { name, data } = job
        switch (name) {
            case 'onUserLogin':
                await this.handleLogin(data)
                break
            case 'onUserJoin':
                await this.handleJoin(data)
                break
            default:
                console.error(`Unknown event: ${event}`)
        }
    }

    async handleLogin({ email }) {
        try {
            console.log(`Handling login for: ${email}`)
            // 최근 로그인 상태 기록 로직 추가
        } catch (err) {}
    }

    async handleJoin({ email }) {
        try {
            console.log(`Sent welcome email to: ${email}`)
        } catch (error) {
            console.error(`Failed to send welcome email to: ${email}`, error)
        }
    }

    initialize() {
        this.queue.process('onUserLogin', this.processJob.bind(this))
        this.queue.process('onUserJoin', this.processJob.bind(this))

        this.queue.on('completed', (job) => {
            console.log(`Completed job: ${job.id}`)
        })

        this.queue.on('failed', (job, err) => {
            console.log(`Failed job: ${job.id} with error ${err.message}`)
        })
    }
}

module.exports = UserSubscriber

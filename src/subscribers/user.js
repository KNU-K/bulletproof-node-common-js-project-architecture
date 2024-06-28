const { user } = require('./events')

class UserSubscriber {
    constructor(queue) {
        this.queue = queue
        this.initialize()
    }

    processJob = async (job) => {
        const { name, data } = job
        switch (name) {
            case user.userEvents:
                await this.handleLogin(data)
                break
            case user.userEvents:
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
            // 가입 메일 보내는 로직 추가
        } catch (error) {
            console.error(`Failed to send welcome email to: ${email}`, error)
        }
    }

    initialize() {
        this.queue.process(userEvents.login, this.processJob.bind(this))
        this.queue.process(userEvents.join, this.processJob.bind(this))

        this.queue.on('completed', (job) => {
            console.log(`Completed job: ${job.id}`)
        })

        this.queue.on('failed', (job, err) => {
            console.log(`Failed job: ${job.id} with error ${err.message}`)
        })
    }
}

module.exports = UserSubscriber

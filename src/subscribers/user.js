// UserSubscriber.js

const { userQueue } = require('./dispatcher')

// subscriber.js

class UserSubscriber {
    constructor(queue, emailService) {
        this.queue = queue
        this.emailService = emailService
        this.initialize()
    }

    async processJob(job) {
        const { event, data } = job.data

        switch (event) {
            case 'onLogin':
                await this.handleLogin(data)
                break
            case 'onJoin':
                await this.handleJoin(data)
                break
            default:
                console.error(`Unknown event: ${event}`)
        }
    }

    async handleLogin({ email }) {
        console.log(`Handling login for: ${email}`)
        // 여기서 최근 로그인 상태를 기록하는 로직을 추가합니다.
    }

    async handleJoin({ email, name }) {
        try {
            await this.emailService.sendEmail(
                email,
                'Welcome!',
                `Hello ${name}, welcome to our service!`,
            )
            console.log(`Sent welcome email to: ${email}`)
        } catch (error) {
            console.error(`Failed to send welcome email to: ${email}`, error)
        }
    }

    initialize() {
        this.queue.process(this.processJob.bind(this))
        this.queue.on('completed', (job) => {
            console.log(`Completed job: ${job.id}`)
        })
        this.queue.on('failed', (job, err) => {
            console.log(`Failed job: ${job.id} with error ${err.message}`)
        })
    }
}

module.exports = UserSubscriber

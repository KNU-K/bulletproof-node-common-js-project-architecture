const nodemailer = require('nodemailer')

class EmailService {
    /**
     *
     * @param {nodemailer.Transporter} transporter
     */
    constructor(transporter) {
        this.transporter = transporter
    }

    async send(to, subject, text) {
        await this.transporter.sendMail()
    }
}

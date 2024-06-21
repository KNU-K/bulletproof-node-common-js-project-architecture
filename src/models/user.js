const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter a full name'],
            index: true,
        },

        email: {
            type: String,
            lowercase: true,
            unique: true,
            index: true,
        },

        password: String,

        salt: String,

        role: {
            type: String,
            default: 'user',
        },
    },
    { timestamps: true },
)

module.exports = mongoose.model('Users', UserSchema)

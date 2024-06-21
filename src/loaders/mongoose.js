const express = require('express')
const routes = require('../api')
const { default: mongoose } = require('mongoose')
module.exports = async () => {
    // 구현 내용은 여기에 작성합니다

    mongoose.set('strictQuery', false)
    const connection = await mongoose.connect(
        'mongodb://localhost:27017/local',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
        },
    )

    return connection.connection.db
}

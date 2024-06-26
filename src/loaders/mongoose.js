const express = require('express')
const routes = require('../api')
const { default: mongoose } = require('mongoose')
module.exports = async () => {
    // 구현 내용은 여기에 작성합니다

    mongoose.set('strictQuery', false)
    const connection = await mongoose.connect('mongodb://localhost:27017/testdb', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
    })
    if (connection.connections[0].readyState !== 1) {
        throw new Error('MongoDB connection not established.')
    }

    console.log('MongoDB connected successfully.')

    return connection.connection.db
}

const request = require('supertest')
const createApp = require('../src/app')
const { Logger } = require('../src/loaders/logger')
const mongoose = require('mongoose')
const { default: Container } = require('typedi')
describe('e2e 간단하게 테스트', () => {
    let app = null
    beforeAll(async () => {
        app = await createApp()
        if (!app) Logger.error('failed loading app')
    })

    // 각 테스트 시작 전 사용자 데이터 초기화
    beforeAll(async () => {
        await Container.get('userModel').deleteMany() // 모든 사용자 데이터 삭제
    })

    // 테스트 종료 후 MongoDB 연결 해제
    afterAll(async () => {
        await mongoose.disconnect()
    })
    it('/api/auth/join', async () => {
        const res = await request(app).post('/api/auth/join').send({
            name: 'test',
            email: 'test@example.com',
            password: 'qwe123',
            role: 'asd123',
        })
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('user')
    })
    it('/api/auth/login', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'test@example.com',
            password: 'qwe123',
        })
        expect(res.status).toEqual(200)
        expect(res.body).toHaveProperty('user')
    })
})

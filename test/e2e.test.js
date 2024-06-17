const request = require('supertest')
const createApp = require('../src/app')
const { Logger } = require('../src/loaders/logger')
describe('e2e 간단하게 테스트', () => {
    let app = null
    beforeAll(async () => {
        app = await createApp()
        if (!app) Logger.error('failed loading app')
    })
    it('/api/user/join', async () => {
        const res = await request(app).post('/api/user/join')
        expect(res.statusCode).toEqual(200)
        expect(res).toHaveProperty('text')
        expect(res.text).toEqual('join')
    })
    it('/api/user/login', async () => {
        const res = await request(app).post('/api/user/login')
        expect(res).toHaveProperty('text')
        expect(res.text).toEqual('login')
    })
})

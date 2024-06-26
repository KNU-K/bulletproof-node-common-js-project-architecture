const expressLoader = require('./express')
const mongooseLoader = require('./mongoose')
const UserModel = require('../models/user')
const { Logger } = require('./logger')
const dependencyInjector = require('./dependency-injector')
const bullLoader = require('./bull')
/**
 * loaders 기능을 초기화합니다.
 *
 * @param {Object} params - 함수의 매개변수 객체입니다.
 * @param {import("express").Application} params.expressApp - 작업을 수행할 Express 애플리케이션 인스턴스입니다.
 *   이 인스턴스는 Express 애플리케이션을 구성하고 있는 여러 기능에 접근할 수 있습니다.
 * @returns {Promise<void>} - 함수가 완료될 때 해결되는 프로미스입니다.
 *   이 함수는 비동기적으로 작업을 수행하며, 반환 값이 없습니다.
 */
async function init({ expressApp }) {
    const mongoConnection = await mongooseLoader()
    Logger.info('DB loaded and connected')

    const queue = await bullLoader()
    /**DI 에 넣어주는거 포함 */
    await dependencyInjector(queue, [
        {
            name: 'userModel',
            model: UserModel,
        },
    ])
    Logger.info('dependencyInjector successfully loaded')

    //models.forEach(({ name, model }) => Container.set(name, model))
    await expressLoader({ app: expressApp, queue: queue })
    Logger.info('express successfully loaded')
}
module.exports = {
    init,
}

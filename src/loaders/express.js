const express = require('express')
const routes = require('../api')
/**
 * 주어진 Express 애플리케이션을 이용하여 특정 작업을 수행하는 함수입니다.
 *
 * 이 함수는 주어진 Express 애플리케이션 인스턴스를 사용하여
 * 특정 작업을 처리하고, 그 결과를 Promise로 반환합니다.
 *
 * @param {Object} params - 함수의 매개변수 객체입니다.
 * @param {import("express").Application} params.app - 작업을 수행할 Express 애플리케이션 인스턴스입니다.
 *   이 인스턴스는 Express 애플리케이션을 구성하고 있는 여러 기능에 접근할 수 있습니다.
 * @returns {Promise<void>} - 함수가 완료될 때 해결되는 프로미스입니다.
 *   이 함수는 비동기적으로 작업을 수행하며, 반환 값이 없습니다.
 */
module.exports = async ({ app }) => {
    // 구현 내용은 여기에 작성합니다
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use('/api', routes())
}

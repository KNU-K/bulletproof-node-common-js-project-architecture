module.exports = (req, res, next) => {
    if (!req.headers) throw new Error('헤더가 존재하지않습니다.')
    if (req.headers !== 'token') throw new Error('토큰이 올바르지 않습니다.')
    /** token 파싱해서 옳은 유저인지 가져오기 */
}

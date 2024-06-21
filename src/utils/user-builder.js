module.exports = class UserBuilder {
    constructor() {
        // 초기화 없음
    }

    setName(name) {
        this.name = name
        return this
    }

    setEmail(email) {
        this.email = email
        return this
    }

    setPassword(password) {
        this.password = password
        return this
    }

    setRole(role) {
        this.role = role
        return this
    }

    // build 메서드: 설정된 속성만을 포함하는 user 객체를 생성
    build() {
        const user = {}

        if (this.name) {
            user.name = this.name
        }

        if (this.email) {
            user.email = this.email
        }

        if (this.password) {
            user.password = this.password
        }

        if (this.role) {
            user.role = this.role
        }

        return user
    }
}

// authService.test.js

const AuthService = require('../../src/services/auth')
const UserModel = require('../../src/models/user')

// jest.mock을 사용하여 UserModel과 UserPublisher를 모킹합니다.
jest.mock('../../src/models/user')

describe('AuthService', () => {
    beforeEach(() => {
        // UserModel의 mockClear를 호출하여 이전 호출 기록을 지웁니다.
        UserModel.mockClear()
    })

    // 테스트 케이스: join 메소드를 테스트합니다.
    it('should join a new user', async () => {
        const mockUserModelInstance = {
            save: jest.fn().mockResolvedValue(),
        }

        // UserModel의 생성자를 모킹하여 인스턴스를 반환하도록 설정합니다.
        UserModel.mockImplementation(() => mockUserModelInstance)

        const authService = new AuthService(UserModel, null)

        const user = {
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password',
        }

        await expect(authService.join(user)).resolves.toEqual(['user', 'token'])

        // UserModel의 생성자가 올바르게 호출되었는지 확인합니다.
        expect(UserModel).toHaveBeenCalledWith(user)

        // save 메소드가 호출되었는지 확인합니다.
        expect(mockUserModelInstance.save).toHaveBeenCalled()
    })

    // 테스트 케이스: login 메소드를 테스트합니다.
    it('should login a user', async () => {
        const mockUserInstance = {
            email: 'testuser@example.com',
            password: 'password',
            findOne: jest.fn().mockResolvedValue({ password: 'password' }),
        }

        UserModel.findOne.mockImplementation(() => mockUserInstance)

        const authService = new AuthService(UserModel, null)

        const credentials = {
            email: 'testuser@example.com',
            password: 'password',
        }

        await expect(authService.login(credentials)).resolves.toEqual(['user', 'token'])

        // UserModel의 findOne 메소드가 올바르게 호출되었는지 확인합니다.
        expect(UserModel.findOne).toHaveBeenCalledWith({ email: credentials.email })
    })
})

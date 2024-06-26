const AuthController = require('../../src/api/controllers/auth')

describe('AuthController unit test', () => {
    let authController
    let authServiceMock

    beforeEach(() => {
        // Mock AuthService methods
        authServiceMock = {
            join: jest.fn(),
            login: jest.fn(),
        }

        // Initialize AuthController instance with mocked authService
        authController = new AuthController(authServiceMock)
    })

    describe('😊 join 기능 테스트!', () => {
        it('✅ join 기능 테스트[성공했을 때]', async () => {
            // Arrange
            const req = {
                body: {
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    password: 'password123',
                    role: 'user',
                },
            }

            authServiceMock.join.mockResolvedValue(['user', 'token'])

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }

            const next = jest.fn()

            // Act
            await authController.join(req, res, next)

            // Assert
            expect(authServiceMock.join).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ user: 'user', token: 'token' })
            expect(next).not.toHaveBeenCalled()
        })

        // it('should handle errors during join', async () => {
        //     // Arrange
        //     const req = {
        //         body: {
        //             name: 'John Doe',
        //             email: 'john.doe@example.com',
        //             password: 'password123',
        //             role: 'user',
        //         },
        //     }

        //     const mockError = new Error('Join error')
        //     authServiceMock.join.mockRejectedValue(mockError)

        //     const res = {
        //         status: jest.fn().mockReturnThis(),
        //         json: jest.fn(),
        //     }

        //     const next = jest.fn()

        //     // Act
        //     await authController.join(req, res, next)

        //     // Assert
        //     expect(next).toHaveBeenCalledWith(mockError)
        //     expect(res.status).not.toHaveBeenCalled()
        //     expect(res.json).not.toHaveBeenCalled()
        // })
    })

    describe('😊 login 기능 테스트!', () => {
        it('✅ login 기능 테스트[성공했을 때]', async () => {
            // Arrange
            const req = {
                body: {
                    email: 'john.doe@example.com',
                    password: 'password123',
                },
            }

            authServiceMock.login.mockResolvedValue(['user', 'token'])

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }

            const next = jest.fn()

            // Act
            await authController.login(req, res, next)

            // Assert
            expect(authServiceMock.login).toHaveBeenCalledTimes(1)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ user: 'user', token: 'token' })
            expect(next).not.toHaveBeenCalled()
        })

        // it('should handle errors during join', async () => {
        //     // Arrange
        //     const req = {
        //         body: {
        //             name: 'John Doe',
        //             email: 'john.doe@example.com',
        //             password: 'password123',
        //             role: 'user',
        //         },
        //     }

        //     const mockError = new Error('Join error')
        //     authServiceMock.join.mockRejectedValue(mockError)

        //     const res = {
        //         status: jest.fn().mockReturnThis(),
        //         json: jest.fn(),
        //     }

        //     const next = jest.fn()

        //     // Act
        //     await authController.join(req, res, next)

        //     // Assert
        //     expect(next).toHaveBeenCalledWith(mockError)
        //     expect(res.status).not.toHaveBeenCalled()
        //     expect(res.json).not.toHaveBeenCalled()
        // })
    })
})

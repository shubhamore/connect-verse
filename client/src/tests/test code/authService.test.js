// authService.test.js

const { login } = require('../test functions/authService');

// Mock the fetch function
global.fetch = jest.fn();

describe('AuthService login function', () => {
    beforeEach(() => {
        // Clear any previous mocks before each test
        jest.clearAllMocks();
    });

    it('should handle successful login', async () => {
        const mockFormData = { email: 'a@a.a', password: '123456' };
        const mockLoggedInResponse = {
            user: {
                email: 'a@a.a',
                name: 'test',
            },
            accessToken: 'mockAccessToken',
        };

        // Mock the successful fetch response
        global.fetch.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(mockLoggedInResponse),
        });

        const result = await login(mockFormData);
        // console.log("result",result)

        // Check that the fetch function was called with the correct parameters
        expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BASE_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify(mockFormData),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Check that the result matches the expected response
        expect(result).toEqual(mockLoggedInResponse);
    });

    it('should handle login failure with incorrect credentials', async () => {
        const mockFormData = { email: 'a@a.a', password: '1234567' };
        const mockErrorResponse = 'wrong password';

        // Mock the fetch response for incorrect credentials
        global.fetch.mockResolvedValue({
            ok: false,
            json: jest.fn().mockResolvedValue({ message: mockErrorResponse }),
        });

        // Ensure that the login function rejects with the correct error message
        await expect(login(mockFormData)).rejects.toThrow(`Login failed: ${mockErrorResponse}`);
    });

    it('should handle login failure with network error', async () => {
        const mockFormData = { email: 'a@a.a', password: '123456' };
      
        // Mock a network error
        global.fetch.mockRejectedValue(new Error('Network error'));
      
        // Ensure that the login function rejects with the correct error message
        await expect(login(mockFormData)).rejects.toThrow('Login failed: Network error');
      });
});

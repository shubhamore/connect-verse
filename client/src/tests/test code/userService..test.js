// userService.test.js

const { getUser } = require('../test functions/userService');

global.fetch = jest.fn();

describe('UserService getUser function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch a user successfully', async () => {
    const mockUserId = '655f0cc04dd67229964d11ac';
    const mockUser = {
      _id: mockUserId,
      name: 'test',
      email: 'a@a.a',
    };

    // Mock the successful fetch response
    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockUser),
    });

    const result = await getUser(mockUserId);

    // Check that the fetch function was called with the correct parameters
    expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BASE_URL}/user/${mockUserId}`);

    // Check that the result matches the expected user data
    expect(result).toEqual(mockUser);
  });

  it('should handle fetch failure', async () => {
    const mockUserId = '655f0cc04dd67229964d11ac';
    const mockErrorResponse = { message: 'User not found' };

    // Mock the fetch response for failure
    global.fetch.mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue(mockErrorResponse),
    });

    // Ensure that the getUser function rejects with the correct error message
    await expect(getUser(mockUserId)).rejects.toThrow('Failed to fetch user: User not found');
  });

  it('should handle network error', async () => {
    const mockUserId = '655f0cc04dd67229964d11ac';

    // Mock a network error
    global.fetch.mockRejectedValue(new Error('Network error'));

    // Ensure that the getUser function rejects with the correct error message
    await expect(getUser(mockUserId)).rejects.toThrow('Failed to fetch user: Network error');
  });
});

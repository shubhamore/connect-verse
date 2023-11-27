// userService.js

const getUser = async (userId) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/user/${userId}`);
        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message || "Failed to fetch user");
        }

        const user = await response.json();
        return user;
    } catch (error) {
        throw new Error(`Failed to fetch user: ${error.message}`);
    }
};

// Export the login function
module.exports = { getUser };

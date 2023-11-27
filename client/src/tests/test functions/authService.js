// authService.js

const login = async (formData) => {
    // console.log("login function called with",formData)
    try {
        // Construct the fetch request
        const loggedInResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/login`, {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json",
            },
        });
        //   console.log("login response",await loggedInResponse.json())

        // Check if the response is not OK (status code other than 2xx)
        if (!loggedInResponse.ok) {
            // Handle incorrect credentials (wrong password, etc.)
            const errorResponse = await loggedInResponse.json();
            throw new Error(errorResponse.message || "Login failed");
        }

        // Parse and return the successful response
        const loggedIn = await loggedInResponse.json();
        return loggedIn;
    } catch (error) {
        // Catch and rethrow any errors that occur during the fetch
        throw new Error(`Login failed: ${error.message}`);
    }
};

// Export the login function
module.exports = { login };

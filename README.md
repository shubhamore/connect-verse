# Connect-Verse

Connect-Verse is a social media website built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It allows users to register, login, create posts, connect with other users, like posts, and perform various other social interactions.

## Demo

You can access the live demo of Connect-Verse at [https://connect-verse.onrender.com/](https://connect-verse.onrender.com/)

## Features

Connect-Verse provides the following features:

- **Register:** Users can create an account by providing necessary details.
- **Login:** Registered users can log in securely.
- **Edit Profile:** Users can edit their profile information.
- **Create Post:** Users can create new posts.
- **Edit Post:** Users can edit the content of their posts.
- **Delete Post:** Users can delete their own posts.
- **Add Comment:** Users can add comments to posts.
- **Edit Comment:** Users can edit their own comments.
- **Delete Comment:** Users can delete their own comments.
- **Switch Theme:** Users can switch between light and dark themes.
- **Connect with User:** Users can connect with other users.
- **Like Post:** Users can like posts.
- **Visit User Profile:** Users can visit other users' profiles.
- **Share Post:** Users can share posts.
- **Share User Profile:** Users can share user profiles.
- **Cloudinary Integration:** Images uploaded by users are stored in the cloud using Cloudinary.
- **Google OAuth:** Allows users to log in using their Google accounts securely.

## Technologies Used

Connect-Verse is built using the following technologies:

- **Frontend:** React.js, Redux Toolkit (for state management), React Router (for routing), Material-UI (for UI components), Formik and Yup (for form management and validation)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (using Mongoose as ODM)
- **Authentication:** JSON Web Tokens (JWT), Google OAuth
- **Image Storage:** Cloudinary
- **Deployment:** Render (for hosting frontend and backend)
- **Version Control:** Git, GitHub

## Installation

To run Connect-Verse locally, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the `client` directory and run `npm install` to install frontend dependencies.
3. Create a `.env` file in the `client` directory and set the necessary environment variables (e.g., REACT_APP_BASE_URL, REACT_APP_DEFAULT_USER_IMAGE).
4. Navigate to the `server` directory and run `npm install` to install backend dependencies.
5. Create a `.env` file in the `server` directory and set the necessary environment variables (e.g., MONGO_URL, PORT, JWT_SECRET, CLOUD_NAME, CLOUD_KEY, CLOUD_KEY_SECRET).
6. Run `npm start` in both the `client` and `server` directories to start the frontend and backend servers respectively.


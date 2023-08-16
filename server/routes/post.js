import express from "express"
import { createPost, getFeedPosts, getUserPosts, likePost } from "../controllers/post.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

router.post("/", verifyToken, createPost)
router.get("/", verifyToken, getFeedPosts)
router.get("/:userId", verifyToken, getUserPosts)
router.patch("/:postId/like", verifyToken, likePost)

export default router
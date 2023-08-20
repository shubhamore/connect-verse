import express from "express"
import { createPost, getFeedPosts, getUserPosts, likePost, deletePost,editPost } from "../controllers/post.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

router.post("/", verifyToken, createPost)
router.get("/", verifyToken, getFeedPosts)
router.get("/:userId", verifyToken, getUserPosts)
router.patch("/:postId/like", verifyToken, likePost)
router.post("/delete", verifyToken, deletePost)
router.put("/edit", verifyToken, editPost)

export default router
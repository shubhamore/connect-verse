import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {
    try {
        const { userId, desc, postImg } = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            name: user.name,
            desc,
            postImg,
            likes: new Map(),
        })
        await newPost.save();
        const posts = await Post.find();
        res.status(200).json(posts)
    } catch (error) {
        console.log("error in createPost", error)
        res.status(500).json(error)
    }
}

export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find();
        res.status(200).json(post)
    } catch (error) {
        console.log("error in getFeedPosts", error)
        res.status(404).json(error)
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const post = await Post.find({ userId: req.params.userId });
        res.status(200).json(post)
    } catch (error) {
        console.log("error in getUserPosts", error)
        res.status(404).json(error)
    }
}

export const likePost = async (req, res) => {
    try {
        const { postId } = req.params
        const { userId } = req.body
        const post = await Post.findById(postId)
        const isLiked = post.likes.get(userId)
        if (isLiked) {
            post.likes.delete(userId)
        } else {
            post.likes.set(userId, true)
        }
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { likes: post.likes },
            { new: true }
        )
        res.status(200).json(updatedPost)
    } catch (error) {
        console.log("error in likePost", error)
        res.status(404).json(error)
    }
}

export const deletePost = async (req, res) => {
    try {
        const { postId } = req.body
        await Post.findByIdAndDelete(postId)
        const posts = await Post.find()
        res.status(200).json(posts)
    } catch (error) {
        console.log("error in deletePost", error)
        res.status(404).json(error)
    }
}
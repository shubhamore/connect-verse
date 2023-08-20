import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        name: String,
        desc: String,
        postImg: String,
        likes: {
            type: Map,
            of: Boolean
        },
        comments: {
            type: Array,
            default: []
        },
        isEdited: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
)

export default mongoose.model("Post", postSchema);
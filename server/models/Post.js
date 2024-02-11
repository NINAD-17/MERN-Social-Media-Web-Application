import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    location: String,
    description: String,
    picturePath: String, // Post image
    userPicturePath: String, // Profile image
    likes: {
        type: Map,  // Instead of array use map it's efficient.
        of: Boolean // It checks if the user Id is exists in the map and value is true if it's exist.
    },
    comments: {
        type: Array,
        default: []
    }
}, { timestamps: true });

const Post = mongoose.model("Post", PostSchema);

export default Post;
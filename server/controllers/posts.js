import Post from "../models/Post.js";
import User from "../models/User.js";

// CREATE 
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {}, // {"someId": true}
            comments: []
        });

        await newPost.save();

        const post = await Post.find(); // Once we add the post we need all posts to be returned to the frontend
        res.status(201).json(post);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
}

// READ
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find(); // Getting all the posts from DB
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getUserPosts = async(req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({ userId });

        res.status(200).json(posts);
    } catch(err) {
        res.status(404).json({ message: err.message });
    }
}

// UPDATE 
export const likePost = async(req, res) => {
    try {
        const { id } = req.params; // Grabbing the particular user
        const { userId } = req.body;

        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId); // It will check in all likes that this particular userId is exist in likes or not // Post liked by particular person

        if(isLiked) {
            post.likes.delete(userId); // Unlike the post
        } else {
            post.likes.add(userId, true);
        }

        res.status(200).json();

        const updatedPost = await Post.findByIdAndUpdate( 
            id,
            { likes: post.likes },
            { new: true }
        );

        res.status(200).json(updatedPost); // To update the frontend we pass updaatedPost.
    } catch(err) {
        res.status(404).json({ message: err.message });
    }
}
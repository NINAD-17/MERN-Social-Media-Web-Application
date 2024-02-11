import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// READ
router.get("/", verifyToken, getFeedPosts); // Homepage post feed // It will give you every single post from database. // In actual production there're some algorithms running to give you relevant feed (by using AI)
router.get("/:userId/posts", verifyToken, getUserPosts);

// UPDATE
router.patch("/:id/like", verifyToken, likePost);

export default router;

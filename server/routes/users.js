import express from 'express';
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
} from '../controllers/users.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// READ ROUTE - Routes from which grab information and not saving anything to database
router.get("/:id", verifyToken, getUser); // users/:id
router.get("/:id/friends", verifyToken, getUserFriends); 

// UPDATE ROUTE
router.patch("/:id/:friendId", verifyToken, addRemoveFriend); // Follow or unfollow

export default router;
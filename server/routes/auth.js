import express from 'express';
import { login } from '../controllers/auth.js';

const router = express.Router(); // This will allow express to identify that these routes will all be configured and allows us to have it in a separate file.

// app.use("/auth", authRoutes); This route that we've specified in index.js will be prefix on login --> /auth/login
router.post("/login", login);

export default router;
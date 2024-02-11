// PACKAGES
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import helmet from 'helmet';
import dotenv from 'dotenv';
import morgan from 'morgan';

// NODE NATIVE PACKAGES
import path from 'path'; // path and fileURLToPath allows us to properly set the path when we configure directories.
import { fileURLToPath } from 'url';
import { register } from 'module';

// PACKAGES DEFINED BY DEVELOPERS
import { register } from './controllers/auth.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/post.js';
import { verifyToken } from './middlewares/auth.js';
import { createPost } from './controllers/posts.js';

// CONFIGURATIONS (ALL MIDDLEWARE AS WELL AS PACKAGE CONFIGURATIONS)
const __filename = fileURLToPath(import.meta.url); // When you use type:module then it's reqired.
const __dirname = path.dirname(__filename);
dotenv.config(); // Loading environment variables
const app = express();
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
app.use(morgan("common"));
app.use(express.json({limit: "30mb"})); // used to parse incoming request bodies in a middleware before your handlers, available under the req.body property. The limit option sets the maximum request body size. If the body ends up being larger, a ‘413 Payload Too Large’ error will be thrown.
app.use(express.urlencoded({ limit: "30mb", extended: true })); // 'extended: true' option allows for rich objects and arrays to be encoded into the URL-encoded format, allowing for a JSON-like experience.
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets"))); // In real project we need to stored it in cloud storage.

// FILE STORAGE CONFIGURATION 
const storage = multer.diskStorage({
    destination: function(req, res, cb) {
        cb(null, "public/assets"); // When someone uploads a file on website then that file will be save on this location
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
}); // You can find this on github repo of multer

const upload = multer({storage});

// ROUTES WITH FILES
// upload.single middleware will upload picture locally in assets folder. And register is an actual function where's the code of register.
app.post("/auth/register", upload.single("picture"), register); // If your wants to register then app will call this API // We've not added this route to 'routes' folder and import it because it's depend on 'upload' variable.
app.post("/posts", verifyToken, upload.single("picture"), createPost); // To create posts

// ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// MONGOOSE SETUP
const PORT = process.env.PORT || 6001; // If 3001 port doesn't work then we'll use 6001
mongoose.connect(process.env.MONGO_URL) // You no longer need to pass options such as useNewUrlParser and useUnifiedTopology 
    .then(() => {
        app.listen(PORT, () => console.log(`Listening on ${PORT}`));
    })
    .catch((error) => console.log(`${error} \n:( Didn't connect`));

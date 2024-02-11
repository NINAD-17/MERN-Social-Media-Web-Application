import bcrypt from 'bcrypt'; // To encrypt our password
import jwt from 'jsonwebtoken'; // This will give us a way to send user a web token that they can use for authorization
import User from '../models/User.js'; // User model

// REGISTER USER
export const register = async (req, res) => {
    // We're calling mongoDB so it's an async function
    // req we get from frontend and res is the response we're going to send to frontend
    try {
        const {
            firstName,
            lastName, 
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body; // Destructuring parameters from req.body

        // Encrypting the password
        const salt = await bcrypt.genSalt(); // Creating random salt
        const passwordHash = await bcrypt.hash(password, salt); // Hashing password and salt

        // Saving the new user's information in database
        const newUser = new User({
            firstName,
            lastName, 
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        });
        
        const savedUser = await newUser.save(); // This function will return all the fields of document. (It will also includes properties added by mongodb and mongoose by default. Ex- _id for unique identity, _v for version)
        res.status(201).json(savedUser); 

        // Always make sure that front-end will get a correct response and data in correct structure/order.
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}


// LOGGING IN
export const login = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email }); // Trying to find user with requested email id

        if(!user) return res.status(400).json({ msg: ":( User not found!"})
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ msg: "Invalid creditionals!"});

        // If both email and password are correct then,
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); // Signing jwt token with user._id and pass secret string
        delete user.password; // So that it doesn't get sent back to the front-end

        // This is basic authentication. When you login then it gives you some kind of token/ validation and then user use that to sign in and verification 
        res.status(200).json({ token, user }); // It will send user's information except his password.
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}
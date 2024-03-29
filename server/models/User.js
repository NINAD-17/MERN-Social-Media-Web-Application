// Schema for User
import mongoose from 'mongoose'; // To set up our model

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 2,
        max: 50
    },
    lastName: {
        type: String,
        required: true,
        min: 2,
        max: 50
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true // Duplicate emails aren't allowed
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    picturePath: {
        type: String,
        default: '',
    },
    friends: {
        type: Array,
        default: []
    },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number
}, { timestamps: true }); // 'timestamps: true' will give us automatic dates for when it's created and updated

const User = mongoose.model("User", UserSchema); // Creating User table with the User schema
export default User;
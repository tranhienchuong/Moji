import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true
    },
    hashedPassword: {
        type: String,
        required: true,
     },

     email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
     },

     displayName: {
        type: String,
        requiried: true,
        trim: true,

     },

     avatarUrl: {
        type: String, // linl CDN
     },

     avatarID: {
        type: String, // Cloudiary public_id to delete
     },

     bio: {
        type: String,
        maxlength: 500,
     },

     phone: {
        type: String,
        sparse: true, // accept null but not same 
     },
     
},
{
timestamps = true,
}
);

const User = mongoose.model("User", userSchema);
export default User;
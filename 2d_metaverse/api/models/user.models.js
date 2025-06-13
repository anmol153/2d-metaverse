import mongoose from "mongoose";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const UserSchema = new mongoose.Schema({ 
    fullname: {
        type: String,
        required: true,
        min:[3, "Fullname must be at least 3 characters"],
        max:[50, "Fullname must be at most 50 characters"],
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min:[8, "Password must be at least 8 characters"],
        max:[20, "Password must be at most 20 characters"],
    },
    avatar:{
        type: String,
        default:"https://static.vecteezy.com/system/resources/previews/020/765/399/large_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
    },
    friends:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"User",
    },
    blocks:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
}, { timestamps: true });

UserSchema.pre("save", async function(next) {
    if(!this.isModified("password")) {
        next();
    } else {
        
        this.password = await bycrypt.hash(this.password, 10);
        next();
    }  
});
UserSchema.methods.isPasswordMatched = async function(enteredPassword) {
    return await bycrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.generateToken = function(){
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY }
    );
}
export const User = mongoose.model("User", UserSchema);
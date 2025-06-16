import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/AsyncHandler.js';
import { User } from '../models/user.models.js';
import mongoose from 'mongoose';
import { Message } from '../models/messages.model.js';
import { uploadOnChoudinary } from '../db/cloudinary.js';
import { getReceiverId } from '../socket.js';
import { io } from '../socket.js';
const getUserSideBar = asyncHandler(async (req, res, next) => {
    const id = req.user_id;
    if (!id) throw new ApiError(500, "Something went wrong");

    const userWithFriends = await User.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        {
            $lookup: {
                from: "users",
                localField: "friends",
                foreignField: "_id",
                as: "friendlist"
            }
        },
        {
            $addFields: {
                friendlist: {
                    $filter: {
                        input: "$friendlist",
                        as: "friend",
                        cond: { $ne: ["$$friend._id", new mongoose.Types.ObjectId(id)] }
                    }
                }
            }
        },
        {
            $project: {
                password: 0,
                "friendlist.password": 0
            }
        }
    ]);

    res.status(200).json(
        new ApiResponse(200, userWithFriends, "Friends Fetched Successfully")
    );
});


const getMessage = asyncHandler(async(req,res,next)=>{
    try {
        const {id:userToChild} = req.params;
        const senderId = req.user_id;
        
        const messages = await Message.find({
            $or:[
                {senderId:senderId,receiverId:userToChild},
                {senderId:userToChild,receiverId:senderId},
            ]
        })

        return res.status(200)
        .json(new ApiResponse(200,messages,"messages"))

    } catch (error) {
        next(error);
    }
})

const sendMessage = asyncHandler(async(req,res,next) =>{
    try {
        const {text} = req.body;
        const LocalPath = req.files?.image?.[0]?.path ?? undefined;
        let avatar = undefined;
        const senderId  = req.user_id;
        if(LocalPath)  avatar = await uploadOnChoudinary(LocalPath);
        const {id:receiverUsername} = req.params;
        const receiverId = await User.findOne({username:receiverUsername});
        if(!receiverId) throw ApiError(500,"Something wnent wrong");
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            ...(avatar && { image: avatar.secure_url })
            });

        await newMessage.save();
        
        const receSocketId = getReceiverId(receiverUsername);
        if(receSocketId) {
            io.to(receSocketId).emit("newMessage",newMessage);
        }
        
        res.status(201).json(new ApiResponse(200,newMessage,"Message Send Successfully"));
    } catch (error) {
        next(error);
    }
})
export {getUserSideBar,getMessage,sendMessage};

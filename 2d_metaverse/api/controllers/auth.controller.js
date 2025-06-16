import { User } from "../models/user.models.js";
import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { deleteOnCloudinary, uploadOnChoudinary } from "../db/cloudinary.js";
const generate = async (id) => {
    const user = await User.findById(id);
    if(!user) {
        throw new ApiError(500, "User not found");
    }
    const token  =  user.generateToken();
    return token;
}
const signUp = asyncHandler(async (req, res, next) => {
       try {
         const{ username, email, password, fullname } = req.body;
         if (!username || !email || !password || !fullname) {
             throw new ApiError(400, "Please fill all the fields");
         }
         const existingUser = await User.findOne({
             $or: [{ email }, { username }]
         });
         if(existingUser) {
             throw new ApiError(400, "User already exists");
         }
         const user = await User.create({
             username,
             email,
             password,
             fullname,
         });
         if (!user) {
             throw new ApiError(500, "User not created");
         }
         const userid = await User.findById(user._id).select("-password ");
     
         if(!userid) {
             throw new ApiError(500, "User not found");
         }
         
        return res.status(201)
         .cookie("token", await generate(userid._id), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: "strict",
         })
         .json(new ApiResponse(200, userid, "User created successfully"));
       } catch (error) {
            next(error);
        }
}); 

const signIn = asyncHandler(async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if(!email) {
            throw new ApiError(400, "Please provide email");
        }
        if(!password) {
            throw new ApiError(400, "Please provide password");
        }
        const user = await User.findOne({
            email
        }).select("+password");
        if(!user) {
            throw new ApiError(400, "User not found");
        }
        const isPasswordMatched = await user.isPasswordMatched(password);

        if(!isPasswordMatched) {
            throw new ApiError(400, "Invalid credentials");
        }

        const userId = await User.findById(user._id).select("-password ");

        if(!userId) {
            throw new ApiError(500, "User not found");
        }

        const token =  await generate(user._id);

        return res.status(200)
        .cookie("token", token, {
            httpOnly: true,
        })
        .json(new ApiResponse(200, userId, "User signed in successfully"));

    } catch (error) {
        next(error);
    }
});
const google = asyncHandler(async (req, res, next) => {
    try {
        const { email, fullName, username, photourl } = req.body;

        if (!email || !fullName) throw new ApiError(500, "Something went wrong");

        let user = await User.findOne({ email }).select("-password");

        if (user) {
            const token = await generate(user._id);

            return res.status(200)
                .cookie("token", token, { httpOnly: true })
                .json(new ApiResponse(200, user, "User signed in successfully"));
        }

        const existusername = await User.findOne({ username });
        if (existusername) throw new ApiError(500, "Username already taken");

        const generatePassword =
            Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

        const newUser = await User.create({
            username,
            email,
            password: generatePassword,
            fullname: fullName,
            avatar: photourl,
        });

        if (!newUser) throw new ApiError(500, "User not created");

        const userid = await User.findById(newUser._id).select("-password");
        if (!userid) throw new ApiError(500, "User not found");

        const token = await generate(userid._id);

        return res.status(201)
            .cookie("token", token, { httpOnly: true })
            .json(new ApiResponse(200, userid, "User created successfully"));

    } catch (error) {
        next(error);
    }
});
const updateDetails = asyncHandler(async (req, res, next) => {
    try {
        const { email, username, fullName } = req.body;
        
        if (!email && !username && !fullName) {
            throw new ApiError(400, "All fields are empty");
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new ApiError(400, "Invalid email format");
        }

        const user = await User.findById(req.user_id);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        const existingUser = await User.findOne({
            $or: [
                { email: email },
                { username: username }
            ]
        });
        if (existingUser) {
            throw new ApiError(400, "Email or username already taken");
        }
        { username && (user.username = username) };
        { email && (user.email = email) };
        { fullName && (user.fullname = fullName) };

        await user.save();

        return res.status(200).json(new ApiResponse(200, user, "User details updated successfully"));
    } catch (error) {
        next(error);
    }
})
const updatepassword = asyncHandler(async (req, res, next) => {
    try {
        const { old_Password, new_Password } = req.body;
        {console.log("old_Password", old_Password)}
        {console.log("new_Password", new_Password)}
        if (!old_Password || !new_Password) {
            throw new ApiError(400, "Please provide old and new password");
        }

        const user = await User.findById(req.user_id).select("+password");
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const isOldPasswordMatched = await user.isPasswordMatched(old_Password);
        if (!isOldPasswordMatched) {
            throw new ApiError(400, "Old password is incorrect");
        }

        user.password = new_Password;
        await user.save();
        return res.status(200).json(new ApiResponse(200, null, "Password updated successfully"));
    } catch (error) {
        next(error);
    }
});


const signOut = asyncHandler(async (req, res, next) => {
  try {
    return res.status(200)
      .clearCookie("token", {
        httpOnly: true,
      })
      .json({ success: true, message: "User signed out successfully" });
  } catch (error) {
    console.error("Error in signOut:", error); 
    next(error);
  }
});


const deleteAccount = asyncHandler(async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.user_id);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        return res.status(200).json(new ApiResponse(200, null, "User account deleted successfully"));
    } catch (error) {
        next(error);
    }
});

 const uploadAvatar = asyncHandler(async (req, res, next) => {
    try {
        const avatarLocalPath = req.files?.avatar[0]?.path;
        // console.log(avatarLocalPath);
        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar file is required");
        }
        const user = await User.findById(req.user_id);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        if (user.avatar && user.avatar !== "https://static.vecteezy.com/system/resources/previews/020/765/399/large_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg") {
            await deleteOnCloudinary(user.avatar);
        }
        const avatar = await uploadOnChoudinary(avatarLocalPath);

        if(!avatar) throw new ApiError(409,"Avatar file is required");
        user.avatar = avatar.secure_url;
        await user.save();
        return res.status(200).json(new ApiResponse(200, user, "Avatar uploaded successfully"));
    } catch (error) {
        next(error);
    }
});

const addFriends = asyncHandler(async (req, res, next) => {
    try{
    const {username} = req.body;
    console.log(username);
    const friend = await User.findOne({ username:username });
    if (!friend) throw new ApiError(404, "User Not Found");
   
    const userUpdate =  User.findByIdAndUpdate(
        req.user_id,
        { $addToSet: { friends: friend._id } }, 
        { new: true }
    );
    const friendUpdate =  User.findByIdAndUpdate(
        friend._id,
        { $addToSet: { friends: req.user_id } },
        { new: true }
    );

    const [updatedUser, updatedFriend] = await Promise.all([userUpdate, friendUpdate]);

    res.status(200).json(new ApiResponse(200,
    "Friendship created successfully",updatedUser));
}
    catch(error){
        next(error);
    }
});
const deleteFriends = asyncHandler(async (req, res, next) => {
    try{
    const {username} = req.body;
    const friend = await User.findOne({ username:username });
    if (!friend) throw new ApiError(404, "User Not Found");
   
    const userUpdate =  User.findByIdAndUpdate(
        req.user_id,
        { $pull: { friends: friend._id } }, 
        { new: true }
    );
    const friendUpdate =  User.findByIdAndUpdate(
        friend._id,
        {  $pull: { friends: req.user_id } },
        { new: true }
    );

    const [updatedUser, updatedFriend] = await Promise.all([userUpdate, friendUpdate]);

    res.status(200).json(new ApiResponse(200,
    "Friendship cleared successfully",updatedUser));
}
    catch(error){
        next(error);
    }
});

const checkuser =  asyncHandler(async(req,res,next) =>{
    try {
        const user = req.user_id;
        if(!user) throw new ApiError(400,"user is not logined");
    
        const userdata = await User.findById(user).select("-password");
    
        if(!userdata) throw new ApiError(400,"user is not logined");
    
        return res.status(200).
        json(new ApiResponse(200,userdata,"User is logged in"));
    } catch (error) {
        next(error);
    }
 })
export { signUp, signIn, google,checkuser,updateDetails, updatepassword, signOut, deleteAccount, uploadAvatar,addFriends,deleteFriends};
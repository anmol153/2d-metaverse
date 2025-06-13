import { Router } from "express";
import { addFriends, checkuser, deleteAccount, google, signIn, signOut, signUp, updateDetails, updatepassword, uploadAvatar } from "../controllers/auth.controller.js";
import JWTverify from "../middlewares/JWTverify.js";
import { upload } from "../middlewares/multer.js";


const AuthRouter = Router();
AuthRouter.post("/sign-up", signUp);
AuthRouter.post("/sign-in", signIn);
AuthRouter.post("/google", google);
AuthRouter.post("/update", JWTverify, updateDetails);
AuthRouter.post("/update-password", JWTverify, updatepassword);
AuthRouter.post("/sign-out", JWTverify, signOut);
AuthRouter.post("/delete-account", JWTverify, deleteAccount);
AuthRouter.post("/addFriend",JWTverify,addFriends);
AuthRouter.get("/check",JWTverify,checkuser);
AuthRouter.post("/upload-avatar", JWTverify,
    upload.fields([
        {
            name:"avatar",
            maxCount:1,
        }]),
        uploadAvatar
    );  
export { AuthRouter };

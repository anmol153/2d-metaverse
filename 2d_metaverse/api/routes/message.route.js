import Router from 'express'
import JWTverify from '../middlewares/JWTverify.js';
import {getMessage,getUserSideBar, sendMessage} from '../controllers/message.controller.js';
import { upload } from '../middlewares/multer.js';
const MessageRoute = Router();

MessageRoute.get("/user",JWTverify,getUserSideBar);
MessageRoute.get("/:id",JWTverify,getMessage);

MessageRoute.post("/:id",JWTverify,
    upload.fields([
            {
                name:"image",
                maxCount:5,
            }]),
            sendMessage,
        );
export {MessageRoute};
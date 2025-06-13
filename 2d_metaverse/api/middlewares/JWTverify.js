import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
const JWTverify = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token || typeof token !== "string" || token.trim() === "") {
      throw new ApiError(400, "Please login to continue");
    }

    const decodedInformation = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedInformation) {
      throw new ApiError(400, "Invalid token");
    }

    req.user_id = decodedInformation.id;
    next();
  } catch (error) {
    next(error);
  }
});

export default JWTverify;
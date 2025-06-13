import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cloudinary config
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload function
const uploadOnChoudinary = async (localFilePath) => {
    try {
        if (!localFilePath || !fs.existsSync(localFilePath)) {
            console.error("⛔ File path is invalid or file does not exist:", localFilePath);
            return null;
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            timeout: 60000
        });

        console.log("✅ File uploaded successfully:", response.secure_url);

        
        fs.unlinkSync(localFilePath);

        return response;
    } catch (error) {
        console.error("❌ File upload failed:", error);

       
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return null;
    }
};

// Delete function
const deleteOnCloudinary = async (url) => {
    if (!url) return null;

    try {
        const parts = url.split("/");
        const fileName = parts.pop().split(".")[0];
        const folder = parts.slice(-2).join("/");
        const publicId = `${folder}/${fileName}`;

        const response = await cloudinary.uploader.destroy(publicId);
        console.log("🗑️ Deleted from Cloudinary:", publicId);
        return response;
    } catch (error) {
        console.error("❌ Failed to delete from Cloudinary:", error);
        return null;
    }
};

export { uploadOnChoudinary, deleteOnCloudinary };

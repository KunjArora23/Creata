import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
})


const uploadMedia = async (file, foldername) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
      folder: foldername,
    });

    // ✅ Delete local file after upload
    fs.unlink(file, (err) => {
      if (err) {
        console.error("❌ Error deleting file from uploads folder:", err);
      } else {
        console.log("✅ Local file deleted successfully:");
      }
    });

    return uploadResponse;
  } catch (error) {
    console.log("❌ Cloudinary upload error:", error);
  }
};

const deleteMediaFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.log(error)
  }
}

const deleteVideoFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
  } catch (error) {
    console.log(error);
  }
};


export { uploadMedia, deleteMediaFromCloudinary, deleteVideoFromCloudinary }
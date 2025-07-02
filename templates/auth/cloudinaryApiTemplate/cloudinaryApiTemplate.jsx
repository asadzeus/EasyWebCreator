import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export async function POST(req) {
  try {
    //console.log("Starting file upload process...");
    
    // Verify Cloudinary config
    if (!cloudinaryConfig.cloud_name || !cloudinaryConfig.api_key || !cloudinaryConfig.api_secret) {
      throw new Error("Cloudinary configuration is incomplete");
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const folderName = formData.get("folderName") || "RealEstatingo";

    if (!file) {
      console.error("No file received in the request");
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    //console.log(`Received file: ${file.name}, type: ${file.type}, size: ${file.size}`);

    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    //console.log("Starting Cloudinary upload...");

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folderName,
          resource_type: "auto"
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            //console.log("Upload successful:", result);
            resolve(result);
          }
        }
      );

      uploadStream.end(uint8Array);
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id
    });

  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { 
        error: error.message || "Failed to upload file",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
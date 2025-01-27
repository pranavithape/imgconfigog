// src/lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  secure: true,
});

export const uploadImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mediagallary"); // Replace with your preset
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/djcmgv8ee/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${response.statusText}`);
    }
    const data = await response.json();
    return data.secure_url;
  } catch (error: any) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

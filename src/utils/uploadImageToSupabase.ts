// import { createClient } from "@supabase/supabase-js";
// import fetch from "node-fetch";
// import path from "path";
// import dotenv from "dotenv";

// dotenv.config();

// const supabase = createClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for uploads
// );

// /**
//  * Uploads an image to Supabase Storage and returns the new URL.
//  * @param {string} imageUrl - The Discogs image URL
//  * @param {number} releaseId - The release ID for naming the file
//  * @returns {Promise<string | null>} - The Supabase image URL or null if failed
//  */
// export async function uploadImageToSupabase(
//   imageUrl: string,
//   releaseId: number
// ): Promise<string | null> {
//   try {
//     console.log(`📡 Downloading image for release ${releaseId}...`);

//     // Fetch the image from Discogs
//     const response = await fetch(imageUrl);
//     if (!response.ok)
//       throw new Error(`Failed to fetch image: ${response.statusText}`);

//     const imageBuffer = await response.arrayBuffer();

//     // ✅ Ensure file extension is .jpeg for consistency
//     let extension = path.extname(imageUrl);
//     if (!extension || extension === ".jpg") extension = ".jpeg";

//     const filePath = `covers/${releaseId}${extension}`; // Store in 'covers/' folder

//     // ✅ Check if the image already exists in Supabase Storage
//     const { data: existingFiles, error: fileCheckError } =
//       await supabase.storage.from("record-images").list("covers");

//     if (fileCheckError) {
//       console.error(
//         `❌ Error checking existing file for release ${releaseId}:`,
//         fileCheckError
//       );
//       return null;
//     }

//     const fileExists = existingFiles.some(
//       (file) => file.name === `${releaseId}${extension}`
//     );
//     if (fileExists) {
//       console.log(
//         `✅ Image already exists for release ${releaseId}, skipping upload.`
//       );
//       return `${process.env.SUPABASE_URL}/storage/v1/object/public/record-images/${filePath}`;
//     }

//     // ✅ Upload the image to Supabase
//     const { error } = await supabase.storage
//       .from("record-images")
//       .upload(filePath, imageBuffer, {
//         contentType: response.headers.get("content-type") || "image/jpeg",
//         upsert: true, // Overwrite existing images if needed
//       });

//     if (error) throw error;

//     // ✅ Generate and return the public URL for the uploaded image
//     const publicURL = `${process.env.SUPABASE_URL}/storage/v1/object/public/record-images/${filePath}`;
//     console.log(`✅ Image uploaded successfully: ${publicURL}`);
//     return publicURL;
//   } catch (error) {
//     console.error(`❌ Image upload failed for ${releaseId}:`, error);
//     return null;
//   }
// }

import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";
import path from "path";
import dotenv from "dotenv";
import { logInfo, logWarn, logError } from "./log";

dotenv.config();

// ✅ Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for uploads
);

const STORAGE_BUCKET = "record-images"; // ✅ Ensure bucket name is correct
const SUPABASE_STORAGE_URL = `${process.env.SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/covers/`;

/**
 * Uploads an image to Supabase Storage and returns the new URL.
 * @param {string} imageUrl - The Discogs image URL
 * @param {number} releaseId - The release ID for naming the file
 * @returns {Promise<string | null>} - The Supabase image URL or null if failed
 */
export async function uploadImageToSupabase(
  imageUrl: string,
  releaseId: number
): Promise<string | null> {
  try {
    logInfo(`📡 Downloading image for release ${releaseId}...`);

    // ✅ Fetch the image from Discogs
    const response = await fetch(imageUrl);
    if (!response.ok)
      throw new Error(`Failed to fetch image: ${response.statusText}`);

    const imageBuffer = await response.arrayBuffer();

    // ✅ Ensure file extension is `.jpeg`
    let extension = path.extname(new URL(imageUrl).pathname);
    if (!extension || extension === ".jpg") extension = ".jpeg"; // Standardize to `.jpeg`

    const filePath = `covers/${releaseId}${extension}`;

    // ✅ Check if the image already exists in Supabase Storage
    const { data: existingFiles, error: fileCheckError } =
      await supabase.storage.from(STORAGE_BUCKET).list("covers");

    if (fileCheckError) {
      logError(
        `❌ Error checking existing file for release ${releaseId}:`,
        fileCheckError
      );
      return null;
    }

    const fileExists = existingFiles.some(
      (file) => file.name === `${releaseId}${extension}`
    );
    if (fileExists) {
      logInfo(
        `✅ Image already exists for release ${releaseId}, skipping upload.`
      );
      return `${SUPABASE_STORAGE_URL}${releaseId}${extension}`;
    }

    // ✅ Upload the image to Supabase
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, imageBuffer, {
        contentType: response.headers.get("content-type") || "image/jpeg",
        upsert: true, // Overwrite existing images if needed
      });

    if (error) throw error;

    // ✅ Generate and return the public URL for the uploaded image
    const publicURL = `${SUPABASE_STORAGE_URL}${releaseId}${extension}`;
    logInfo(`✅ Image uploaded successfully: ${publicURL}`);
    return publicURL;
  } catch (error) {
    logError(`❌ Image upload failed for ${releaseId}:`, error);
    return null;
  }
}

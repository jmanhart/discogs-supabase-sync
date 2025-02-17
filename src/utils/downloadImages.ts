import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fetch from "node-fetch";
import path from "path";
import { uploadImageToSupabase } from "./uploadImageToSupabase";
import { logInfo, logWarn, logError } from "./log";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const STORAGE_BUCKET = "record-images"; // Ensure this matches your Supabase bucket

/**
 * Downloads images for missing records and uploads them to Supabase Storage.
 * @param {Array} releases - List of Discogs releases.
 */
export async function downloadImages(releases: any[]) {
  logInfo("📸 Checking and downloading images...");

  for (const release of releases) {
    try {
      const releaseId = release.id;
      const title = release.basic_information?.title || "Unknown Title";
      const discogsImageUrl = release.basic_information?.cover_image || "";

      if (!discogsImageUrl) {
        logWarn(`⚠️ No image found for ${title}`);
        continue;
      }

      // ✅ Ensure correct `.jpeg` extension
      let extension = path.extname(new URL(discogsImageUrl).pathname);
      if (!extension || extension === ".jpg") extension = ".jpeg"; // Use `.jpeg`

      const storagePath = `covers/${releaseId}${extension}`;

      // ✅ Check if image exists in Supabase Storage
      const { data: existingFiles, error: fileCheckError } =
        await supabase.storage.from(STORAGE_BUCKET).list("covers");

      if (fileCheckError) {
        logError(
          `❌ Error checking existing file for ${title}`,
          fileCheckError
        );
        continue;
      }

      // ✅ Skip downloading if the image already exists
      if (
        existingFiles.some((file) => file.name === `${releaseId}${extension}`)
      ) {
        logInfo(`✅ Image already exists for ${title}, skipping...`);
        continue;
      }

      logInfo(`⬇️ Downloading image for ${title}...`);

      const uploadedUrl = await uploadImageToSupabase(
        discogsImageUrl,
        releaseId
      );
      if (uploadedUrl) {
        logInfo(`✅ Successfully uploaded: ${uploadedUrl}`);
      } else {
        logWarn(`⚠️ Failed to upload image for ${title}`);
      }
    } catch (error) {
      logError("❌ Error processing image:", error);
    }
  }

  logInfo("📸 Image processing complete.");
}

// import { createClient, SupabaseClient } from "@supabase/supabase-js";
// import dotenv from "dotenv";
// import { DiscogsRecord } from "./fetchDiscogs";

// dotenv.config();

// const SUPABASE_URL = process.env.SUPABASE_URL!;
// const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// // ✅ Ensure required environment variables exist
// if (!SUPABASE_URL || !SUPABASE_KEY) {
//   throw new Error("❌ Supabase environment variables are missing!");
// }

// // ✅ Initialize Supabase client
// const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// const TABLE_NAME = "records";
// const SUPABASE_STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/record-images/covers/`;

// /**
//  * Updates the Supabase `records` table with new records from Discogs.
//  * - Ensures only new/missing records are added.
//  * - Updates missing `supabase_image_url` values.
//  *
//  * @param {DiscogsRecord[]} records - The records to insert/update in Supabase.
//  */
// export async function updateSupabaseRecords(records: DiscogsRecord[]) {
//   try {
//     if (!Array.isArray(records)) {
//       console.error("❌ Records input is not an array:", records);
//       return;
//     }

//     console.log(
//       `📦 Preparing to insert ${records.length} records into Supabase...`
//     );

//     if (records.length === 0) {
//       console.warn("⚠️ No records to insert. Skipping Supabase update.");
//       return;
//     }

//     // ✅ Ensure `supabase_image_url` is correctly formatted
//     const cleanedRecords = records.map((record) => ({
//       ...record,
//       supabase_image_url: record.supabase_image_url
//         ? `${SUPABASE_STORAGE_URL}${record.release_id}.jpeg`
//         : null, // Ensure correct formatting
//     }));

//     // ✅ Insert/update records, avoiding duplicates
//     const { error } = await supabase.from(TABLE_NAME).upsert(cleanedRecords, {
//       onConflict: ["release_id"],
//     });

//     if (error) {
//       throw new Error(`❌ Supabase insert error: ${error.message}`);
//     }

//     console.log("✅ Supabase update successful!");
//   } catch (error) {
//     console.error("❌ Error updating Supabase records:", error);
//   }
// }

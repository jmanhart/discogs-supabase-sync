import { fetchDiscogsRecords } from "./fetchDiscogs";
import { updateSupabaseRecords } from "./updateSupabase";
import { logInfo, logError } from "./log";

async function main() {
  try {
    logInfo("🚀 Starting Discogs-to-Supabase sync...");

    // ✅ Fetch records from Discogs
    const records = await fetchDiscogsRecords();

    // ✅ Validate response
    if (!records || !Array.isArray(records)) {
      logError("❌ Records input is invalid or not an array", { records });
      return;
    }

    logInfo(`📊 Fetched ${records.length} records from Discogs.`);

    // ✅ Check if there are new records to update
    if (records.length > 0) {
      await updateSupabaseRecords(records);
    } else {
      logInfo("✅ No new records to add. Everything is already up-to-date.");
    }

    logInfo("✅ Sync complete.");
  } catch (error) {
    logError("❌ Unexpected error in sync process", error);
  }
}

// ✅ Ensure the script runs only when executed directly
if (require.main === module) {
  main();
}

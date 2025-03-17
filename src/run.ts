import { fetchDiscogsRecords } from "./utils/fetchDiscogs.js";
import { updateSupabaseRecords } from "./utils/updateSupabase.js";
import { logInfo, logError } from "./utils/log.js";

async function main() {
  try {
    logInfo("🚀 Starting Discogs-to-Supabase sync...");

    // ✅ Fetch records from Discogs
    const records: any[] = (await fetchDiscogsRecords()) || [];

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
if (import.meta.url === new URL(process.argv[1], "file:").href) {
  main();
}

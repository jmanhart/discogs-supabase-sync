import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase setup
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// ✅ API Route to Get Records
app.get("/api/records", async (req, res) => {
  try {
    console.log("📡 Fetching records from Supabase...");

    const { data, error } = await supabase.from("records").select("*");

    if (error) throw error;

    console.log(`✅ Retrieved ${data.length} records.`);
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ API Error fetching records:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

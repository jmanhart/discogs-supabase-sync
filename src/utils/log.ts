// /**
//  * log.ts
//  *
//  * Centralized logging system to make debugging easier.
//  * - Logs all API interactions.
//  * - Tracks successes and failures for easier troubleshooting.
//  * - Saves logs to a file or outputs them to the console.
//  *
//  * Expected Functions:
//  * - `logInfo(message: string)`: Logs an informational message.
//  * - `logError(message: string, error?: any)`: Logs an error message.
//  */

// import fs from "fs";
// import path from "path";

// const LOG_FILE = path.join(process.cwd(), "logs.txt"); // Change as needed

// function formatTimestamp() {
//   return new Date().toISOString();
// }

// function writeToFile(logMessage: string) {
//   fs.appendFile(LOG_FILE, logMessage + "\n", (err) => {
//     if (err) console.error("❌ [ERROR]: Failed to write log to file:", err);
//   });
// }

// export function logInfo(message: string) {
//   const logMessage = `ℹ️ [INFO] [${formatTimestamp()}]: ${message}`;
//   console.log(logMessage);
//   writeToFile(logMessage);
// }

// export function logWarn(message: string) {
//   const logMessage = `⚠️ [WARN] [${formatTimestamp()}]: ${message}`;
//   console.warn(logMessage);
//   writeToFile(logMessage);
// }

// export function logError(message: string, error?: any) {
//   const errorDetails = error ? `\n   Details: ${error.message || error}` : "";
//   const logMessage = `❌ [ERROR] [${formatTimestamp()}]: ${message}${errorDetails}`;
//   console.error(logMessage);
//   writeToFile(logMessage);
// }

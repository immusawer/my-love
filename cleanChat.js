import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, "public", "chat.txt");
const outputPath = path.join(__dirname, "public", "chat-clean.txt");

if (!fs.existsSync(inputPath)) {
  console.error("❌ File not found:", inputPath);
  process.exit(1);
}

const input = fs.readFileSync(inputPath, "utf8");

// Remove timestamps like [16/10/2025, 21:10:09]
const cleaned = input.replace(
  /\[\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}\]\s*/g,
  ""
);

fs.writeFileSync(outputPath, cleaned, "utf8");
console.log("✨ Chat cleaned successfully! Saved to:", outputPath);

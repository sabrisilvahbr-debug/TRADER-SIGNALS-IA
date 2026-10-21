import fs from "fs";
import path from "path";

export const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), "data", "trader.db");

export function ensureDbDirectory() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  return DB_PATH;
}

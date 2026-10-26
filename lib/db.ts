import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

const dbFile = process.env.DB_PATH || path.join("/tmp", "trader.db");
const dbDirectory = path.dirname(dbFile);

if (dbDirectory) {
  fs.mkdirSync(dbDirectory, { recursive: true });
}

let database: Database.Database | undefined;

function getDatabase() {
  if (database) return database;

  database = new Database(dbFile);
  database.pragma("journal_mode = WAL");
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS positions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      symbol TEXT NOT NULL,
      quantity REAL NOT NULL,
      avg_price REAL NOT NULL,
      side TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  return database;
}

export const db = {
  prepare: (...args: Parameters<Database.Database["prepare"]>) => getDatabase().prepare(...args),
};

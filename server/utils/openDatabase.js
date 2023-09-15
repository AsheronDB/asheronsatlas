import Database from "better-sqlite3";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(
  __dirname,
  "..",
  "..",
  "assets",
  "data",
  "ace.db"
);

export default () => {
  const db = new Database(DB_PATH, {
    readonly: false,
    fileMustExist: true,
    verbose: console.log,
  });

  db.pragma("journal_mode = WAL");

  return db;
};

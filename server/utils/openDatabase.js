import Database from "better-sqlite3";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(
  __dirname,
  "..",
  "..",
  "public",
  "ace.db"
);

export default () => {
  const db = new Database('http://localhost:3000/ace.db', {
    readonly: false,
    fileMustExist: true,
    verbose: console.log,
  });

  db.pragma("journal_mode = WAL");

  return db;
};

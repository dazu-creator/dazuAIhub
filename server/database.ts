import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let dbPromise: Promise<Database> | null = null;

async function setup(db: Database) {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS registrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            county TEXT NOT NULL,
            course TEXT NOT NULL,
            level TEXT NOT NULL,
            goals TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS subscribers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
}

export function openDb() {
    if (!dbPromise) {
        dbPromise = open({
            filename: './dazu.db',
            driver: sqlite3.Database
        }).then(async (db) => {
            await setup(db);
            return db;
        });
    }
    return dbPromise;
}
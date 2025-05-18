import { Pool } from 'pg';
import * as schema from "./shared/schema";

// Database connection string from environment variable
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Database connection string not found");
  process.exit(1);
}

async function main() {
  console.log("Starting database migration...");
  
  try {
    const pool = new Pool({ connectionString });
    
    // This will create the tables based on the schema definitions
    console.log("Creating database tables...");
    
    // Create tables based on schema
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        sid VARCHAR PRIMARY KEY,
        sess JSONB NOT NULL,
        expire TIMESTAMP NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions (expire);
      
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR PRIMARY KEY NOT NULL,
        email VARCHAR UNIQUE,
        first_name VARCHAR,
        last_name VARCHAR,
        profile_image_url VARCHAR,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS messages (
        id VARCHAR PRIMARY KEY,
        content TEXT NOT NULL,
        sender_id VARCHAR NOT NULL REFERENCES users(id),
        receiver_id VARCHAR NOT NULL REFERENCES users(id),
        is_emergency BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS connections (
        id VARCHAR PRIMARY KEY,
        user_id VARCHAR NOT NULL REFERENCES users(id),
        contact_id VARCHAR NOT NULL REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    console.log("Database migration completed successfully!");
    await pool.end();
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

main();
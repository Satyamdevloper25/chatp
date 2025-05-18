import { Pool } from 'pg';

// Database connection string from environment variable
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Database connection string not found");
  process.exit(1);
}

async function main() {
  console.log("Starting schema update...");
  
  try {
    const pool = new Pool({ connectionString });
    
    // Add display_name column to users table
    console.log("Adding display_name column to users table...");
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS display_name VARCHAR;
    `);
    
    console.log("Schema update completed successfully!");
    await pool.end();
  } catch (error) {
    console.error("Schema update failed:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

main();
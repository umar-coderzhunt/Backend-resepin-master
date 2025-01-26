const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  // Uncomment if you require SSL (e.g., for production databases)
  // ssl: {
  //   rejectUnauthorized: false
  // }
});

const createTables = async () => {
  try {
    // Create the `users` table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        iduser VARCHAR(255) PRIMARY KEY,
        fullname VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phonenumber VARCHAR(20) NOT NULL,
        password VARCHAR(255) NOT NULL,
        active INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Users table created successfully!');

    // Add the `avatar` column to `users` table if it doesn't already exist
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'avatar'
        ) THEN
          ALTER TABLE users ADD COLUMN avatar VARCHAR(255) DEFAULT NULL;
        END IF;
      END
      $$;
    `);
    console.log('Avatar column added to users table successfully!');
    // Create `food` table if not exists
    await pool.query(`
  CREATE TABLE IF NOT EXISTS food (
    idfood SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    ingrediens TEXT[] DEFAULT '{}',
    video VARCHAR(255) DEFAULT NULL,
    image VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,        
    CONSTRAINT fk_user FOREIGN KEY (userid) REFERENCES users(iduser) ON DELETE CASCADE

  );
`);
    console.log('Food table created successfully!');

  } catch (err) {
    console.error('Error creating tables:', err.message);
  }
};

// Run the table creation
createTables();

module.exports = pool;

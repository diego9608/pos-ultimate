const Database = require('better-sqlite3');
const path = require('path');

// Create or connect to database
const dbPath = path.join(
  __dirname,
  '../../',
  process.env.DATABASE_PATH || './data/pos.sqlite'
);
const db = new Database(dbPath, {
  verbose: console.log, // Log SQL queries in development
});

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database tables
const initializeDatabase = () => {
  try {
    // Create products table
    db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        barcode TEXT UNIQUE,
        price REAL NOT NULL,
        stock INTEGER DEFAULT 0,
        category TEXT,
        active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create sales table
    db.exec(`
      CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        total REAL NOT NULL,
        payment_method TEXT NOT NULL,
        cashier_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create sale_items table
    db.exec(`
      CREATE TABLE IF NOT EXISTS sale_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sale_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price REAL NOT NULL,
        subtotal REAL NOT NULL,
        FOREIGN KEY (sale_id) REFERENCES sales (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
      )
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
};

// Initialize on module load
initializeDatabase();

module.exports = db;

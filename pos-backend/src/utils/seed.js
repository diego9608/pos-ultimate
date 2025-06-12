// pos-backend/src/utils/seed.js
require('dotenv').config();
const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

// Conectar a la base de datos
const dbPath = path.join(__dirname, '../../data/pos.sqlite');
const db = new Database(dbPath);

// Datos de productos de ejemplo (tienda de abarrotes mexicana)
const products = [
  // Bebidas
  {
    name: 'Coca Cola 600ml',
    barcode: '7501055300146',
    price: 18.0,
    stock: 100,
    category: 'Bebidas',
  },
  {
    name: 'Coca Cola 2L',
    barcode: '7501055300147',
    price: 35.0,
    stock: 50,
    category: 'Bebidas',
  },
  {
    name: 'Pepsi 600ml',
    barcode: '7501031311309',
    price: 16.0,
    stock: 80,
    category: 'Bebidas',
  },
  {
    name: 'Agua Bonafont 1L',
    barcode: '7502237000015',
    price: 12.0,
    stock: 120,
    category: 'Bebidas',
  },
  {
    name: 'Gatorade 600ml',
    barcode: '7502242001020',
    price: 22.0,
    stock: 60,
    category: 'Bebidas',
  },
  {
    name: 'Cerveza Corona 355ml',
    barcode: '7501064193156',
    price: 25.0,
    stock: 200,
    category: 'Bebidas',
  },

  // Snacks
  {
    name: 'Sabritas Original 45g',
    barcode: '7501011115235',
    price: 17.0,
    stock: 100,
    category: 'Snacks',
  },
  {
    name: 'Doritos Nacho 62g',
    barcode: '7501011115236',
    price: 19.0,
    stock: 80,
    category: 'Snacks',
  },
  {
    name: 'Cheetos Flamin Hot 56g',
    barcode: '7501011115237',
    price: 18.0,
    stock: 90,
    category: 'Snacks',
  },
  {
    name: 'Ruffles Queso 45g',
    barcode: '7501011115238',
    price: 17.0,
    stock: 70,
    category: 'Snacks',
  },
  {
    name: 'Takis Fuego 56g',
    barcode: '7502226811253',
    price: 15.0,
    stock: 100,
    category: 'Snacks',
  },

  // Dulces
  {
    name: 'Snickers',
    barcode: '7502261850012',
    price: 15.0,
    stock: 150,
    category: 'Dulces',
  },
  {
    name: 'Carlos V',
    barcode: '7502230701717',
    price: 10.0,
    stock: 200,
    category: 'Dulces',
  },
  {
    name: 'Mazapán De la Rosa',
    barcode: '7501023105010',
    price: 5.0,
    stock: 300,
    category: 'Dulces',
  },
  {
    name: 'Paleta Payaso',
    barcode: '7501023116016',
    price: 8.0,
    stock: 150,
    category: 'Dulces',
  },
  {
    name: 'Chicles Trident',
    barcode: '7502261853013',
    price: 12.0,
    stock: 100,
    category: 'Dulces',
  },

  // Abarrotes
  {
    name: 'Frijoles La Costeña 440g',
    barcode: '7501017006236',
    price: 18.0,
    stock: 80,
    category: 'Abarrotes',
  },
  {
    name: 'Arroz Verde Valle 1kg',
    barcode: '7501071201015',
    price: 32.0,
    stock: 60,
    category: 'Abarrotes',
  },
  {
    name: 'Aceite Capullo 1L',
    barcode: '7501052433141',
    price: 45.0,
    stock: 40,
    category: 'Abarrotes',
  },
  {
    name: 'Atún Dolores 140g',
    barcode: '7501052433142',
    price: 22.0,
    stock: 100,
    category: 'Abarrotes',
  },
  {
    name: 'Sopa Maruchan',
    barcode: '7501052433143',
    price: 14.0,
    stock: 150,
    category: 'Abarrotes',
  },
  {
    name: 'Harina de Maíz Maseca 1kg',
    barcode: '7501058617224',
    price: 28.0,
    stock: 50,
    category: 'Abarrotes',
  },

  // Lácteos
  {
    name: 'Leche Lala 1L',
    barcode: '7501055900442',
    price: 26.0,
    stock: 60,
    category: 'Lácteos',
  },
  {
    name: 'Yogurt Yoplait Fresa',
    barcode: '7501055900443',
    price: 12.0,
    stock: 80,
    category: 'Lácteos',
  },
  {
    name: 'Queso Oaxaca 400g',
    barcode: '7501055900444',
    price: 65.0,
    stock: 30,
    category: 'Lácteos',
  },
  {
    name: 'Crema Lala 450ml',
    barcode: '7501055900445',
    price: 35.0,
    stock: 40,
    category: 'Lácteos',
  },

  // Pan
  {
    name: 'Pan Bimbo Blanco',
    barcode: '7501000115457',
    price: 38.0,
    stock: 50,
    category: 'Pan',
  },
  {
    name: 'Pan Integral Bimbo',
    barcode: '7501000115458',
    price: 42.0,
    stock: 40,
    category: 'Pan',
  },
  {
    name: 'Donas Bimbo 6pz',
    barcode: '7501000115459',
    price: 32.0,
    stock: 30,
    category: 'Pan',
  },
  {
    name: 'Tortillas de Maíz 1kg',
    barcode: '7501000115460',
    price: 18.0,
    stock: 100,
    category: 'Pan',
  },

  // Cuidado Personal
  {
    name: 'Jabón Zote Blanco',
    barcode: '7501023105011',
    price: 15.0,
    stock: 80,
    category: 'Cuidado Personal',
  },
  {
    name: 'Papel Higiénico Pétalo 4pz',
    barcode: '7501023105012',
    price: 35.0,
    stock: 60,
    category: 'Cuidado Personal',
  },
  {
    name: 'Shampoo Head & Shoulders 375ml',
    barcode: '7501023105013',
    price: 65.0,
    stock: 40,
    category: 'Cuidado Personal',
  },
  {
    name: 'Pasta Colgate 150ml',
    barcode: '7501023105014',
    price: 28.0,
    stock: 70,
    category: 'Cuidado Personal',
  },
  {
    name: 'Desodorante Axe',
    barcode: '7501023105015',
    price: 45.0,
    stock: 50,
    category: 'Cuidado Personal',
  },

  // Cigarros (requieren edad)
  {
    name: 'Marlboro Rojos 20pz',
    barcode: '7501023105016',
    price: 63.0,
    stock: 100,
    category: 'Cigarros',
  },
  {
    name: 'Camel Azul 20pz',
    barcode: '7501023105017',
    price: 60.0,
    stock: 80,
    category: 'Cigarros',
  },
];

// Función para limpiar y poblar la base de datos
async function seedDatabase() {
  try {
    console.log('🌱 Iniciando seed de la base de datos...\n');

    // Limpiar tabla de productos (solo los que no tengan ventas asociadas)
    console.log('🧹 Limpiando productos de prueba anteriores...');
    const deleteStmt = db.prepare(
      'DELETE FROM products WHERE id NOT IN (SELECT DISTINCT product_id FROM sale_items)'
    );
    const deleteResult = deleteStmt.run();
    console.log(`   Eliminados: ${deleteResult.changes} productos\n`);

    // Insertar productos
    console.log('📦 Insertando productos...');
    const insertStmt = db.prepare(`
      INSERT INTO products (name, barcode, price, stock, category, active) 
      VALUES (?, ?, ?, ?, ?, 1)
    `);

    let inserted = 0;
    let skipped = 0;

    for (const product of products) {
      try {
        insertStmt.run(
          product.name,
          product.barcode,
          product.price,
          product.stock,
          product.category
        );
        inserted++;
        console.log(`   ✓ ${product.name}`);
      } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
          skipped++;
          console.log(
            `   ⚠️  ${product.name} - Ya existe (barcode: ${product.barcode})`
          );
        } else {
          throw error;
        }
      }
    }

    console.log(`\n✅ Seed completado!`);
    console.log(`   Total productos: ${products.length}`);
    console.log(`   Insertados: ${inserted}`);
    console.log(`   Omitidos (ya existían): ${skipped}`);

    // Mostrar estadísticas
    const stats = db
      .prepare(
        `
      SELECT 
        COUNT(*) as total,
        COUNT(DISTINCT category) as categorias,
        ROUND(AVG(price), 2) as precio_promedio,
        SUM(stock) as stock_total
      FROM products 
      WHERE active = 1
    `
      )
      .get();

    console.log(`\n📊 Estadísticas de la base de datos:`);
    console.log(`   Total productos activos: ${stats.total}`);
    console.log(`   Categorías: ${stats.categorias}`);
    console.log(`   Precio promedio: $${stats.precio_promedio}`);
    console.log(`   Stock total: ${stats.stock_total} unidades`);
  } catch (error) {
    console.error('❌ Error durante el seed:', error.message);
    process.exit(1);
  } finally {
    db.close();
    console.log('\n👋 Base de datos cerrada');
  }
}

// Ejecutar el seed
seedDatabase();

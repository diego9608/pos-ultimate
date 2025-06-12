const express = require('express');
const router = express.Router();
const db = require('../utils/database');

// GET all products
router.get('/', (req, res) => {
  try {
    const products = db
      .prepare('SELECT * FROM products WHERE active = 1')
      .all();
    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET single product by ID
router.get('/:id', (req, res) => {
  try {
    const product = db
      .prepare('SELECT * FROM products WHERE id = ?')
      .get(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST create new product
router.post('/', (req, res) => {
  const { name, barcode, price, stock, category } = req.body;

  if (!name || !price) {
    return res.status(400).json({
      success: false,
      error: 'Name and price are required',
    });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO products (name, barcode, price, stock, category)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      name,
      barcode || null,
      price,
      stock || 0,
      category || 'General'
    );

    res.status(201).json({
      success: true,
      data: {
        id: result.lastInsertRowid,
        name,
        barcode,
        price,
        stock: stock || 0,
        category: category || 'General',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PUT update product
router.put('/:id', (req, res) => {
  const { name, barcode, price, stock, category, active } = req.body;
  const { id } = req.params;

  try {
    const stmt = db.prepare(`
      UPDATE products 
      SET name = COALESCE(?, name),
          barcode = COALESCE(?, barcode),
          price = COALESCE(?, price),
          stock = COALESCE(?, stock),
          category = COALESCE(?, category),
          active = COALESCE(?, active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const result = stmt.run(name, barcode, price, stock, category, active, id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    const updatedProduct = db
      .prepare('SELECT * FROM products WHERE id = ?')
      .get(id);

    res.json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE product (soft delete)
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('UPDATE products SET active = 0 WHERE id = ?');
    const result = stmt.run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

const db = require("../db");

/**
 * Get cart items for logged-in user
 * GET /api/cart
 */
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      `SELECT 
        c.id as cart_id,
        c.quantity,
        c.created_at,
        p.id as product_id,
        p.name as product_name,
        p.price,
        p.stock_kg as stock,
        p.image_url,
        p.category,
        pond.name as pond_name,
        pond.location as pond_location
      FROM cart c
      JOIN products p ON c.product_id = p.id
      LEFT JOIN ponds pond ON p.pond_id = pond.id
      WHERE c.user_id = $1
      ORDER BY c.created_at DESC`,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching cart:", error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

/**
 * Add item to cart
 * POST /api/cart
 * Body: { product_id, quantity }
 */
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity } = req.body;

    // Validation
    if (!product_id || !quantity) {
      return res.status(400).json({
        message: "Product ID dan quantity harus diisi",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        message: "Quantity harus lebih dari 0",
      });
    }

    // Check if product exists and has enough stock
    const productCheck = await db.query(
      "SELECT id, name, stock_kg FROM products WHERE id = $1",
      [product_id]
    );

    if (productCheck.rows.length === 0) {
      return res.status(404).json({
        message: "Produk tidak ditemukan",
      });
    }

    const product = productCheck.rows[0];

    if (product.stock_kg < quantity) {
      return res.status(400).json({
        message: `Stok tidak mencukupi. Stok tersedia: ${product.stock_kg} kg`,
      });
    }

    // Check if item already in cart
    const existingItem = await db.query(
      "SELECT id, quantity FROM cart WHERE user_id = $1 AND product_id = $2",
      [userId, product_id]
    );

    let cartItem;

    if (existingItem.rows.length > 0) {
      // Update existing cart item
      const newQuantity = existingItem.rows[0].quantity + quantity;

      if (newQuantity > product.stock_kg) {
        return res.status(400).json({
          message: `Total quantity melebihi stok. Stok tersedia: ${product.stock_kg} kg`,
        });
      }

      const updateResult = await db.query(
        `UPDATE cart 
        SET quantity = $1, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $2 
        RETURNING *`,
        [newQuantity, existingItem.rows[0].id]
      );

      cartItem = updateResult.rows[0];
    } else {
      // Insert new cart item
      const insertResult = await db.query(
        `INSERT INTO cart (user_id, product_id, quantity) 
        VALUES ($1, $2, $3) 
        RETURNING *`,
        [userId, product_id, quantity]
      );

      cartItem = insertResult.rows[0];
    }

    res.status(201).json({
      message: "Produk berhasil ditambahkan ke keranjang",
      cart_item: cartItem,
    });
  } catch (error) {
    console.error("Error adding to cart:", error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

/**
 * Update cart item quantity
 * PUT /api/cart/:cartId
 * Body: { quantity }
 */
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cartId } = req.params;
    const { quantity } = req.body;

    // Validation
    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        message: "Quantity harus lebih dari 0",
      });
    }

    // Check if cart item exists and belongs to user
    const cartCheck = await db.query(
      `SELECT c.id, c.product_id, p.stock_kg 
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.id = $1 AND c.user_id = $2`,
      [cartId, userId]
    );

    if (cartCheck.rows.length === 0) {
      return res.status(404).json({
        message: "Item tidak ditemukan di keranjang",
      });
    }

    const { stock_kg } = cartCheck.rows[0];

    if (quantity > stock_kg) {
      return res.status(400).json({
        message: `Quantity melebihi stok. Stok tersedia: ${stock_kg} kg`,
      });
    }

    // Update quantity
    const updateResult = await db.query(
      `UPDATE cart 
      SET quantity = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING *`,
      [quantity, cartId]
    );

    res.status(200).json({
      message: "Keranjang berhasil diperbarui",
      cart_item: updateResult.rows[0],
    });
  } catch (error) {
    console.error("Error updating cart item:", error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

/**
 * Remove item from cart
 * DELETE /api/cart/:cartId
 */
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cartId } = req.params;

    // Check if cart item exists and belongs to user
    const cartCheck = await db.query(
      "SELECT id FROM cart WHERE id = $1 AND user_id = $2",
      [cartId, userId]
    );

    if (cartCheck.rows.length === 0) {
      return res.status(404).json({
        message: "Item tidak ditemukan di keranjang",
      });
    }

    // Delete cart item
    await db.query("DELETE FROM cart WHERE id = $1", [cartId]);

    res.status(200).json({
      message: "Item berhasil dihapus dari keranjang",
    });
  } catch (error) {
    console.error("Error removing from cart:", error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

/**
 * Clear all cart items for user
 * DELETE /api/cart
 */
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await db.query("DELETE FROM cart WHERE user_id = $1", [userId]);

    res.status(200).json({
      message: "Keranjang berhasil dikosongkan",
    });
  } catch (error) {
    console.error("Error clearing cart:", error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

/**
 * Get cart item count for logged-in user
 * GET /api/cart/count
 */
exports.getCartCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      "SELECT COUNT(*) as count FROM cart WHERE user_id = $1",
      [userId]
    );

    res.status(200).json({
      count: parseInt(result.rows[0].count),
    });
  } catch (error) {
    console.error("Error fetching cart count:", error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};


// backend/controllers/productController.js
const db = require("../db");

// Fungsi untuk mendapatkan semua produk (Publik)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await db.query(
      "SELECT * FROM products ORDER BY created_at DESC"
    );
    res.status(200).json(products.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params; // Ambil ID dari parameter URL

    const product = await db.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);

    // Cek jika produk tidak ditemukan
    if (product.rows.length === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    res.status(200).json(product.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

exports.createProduct = async (req, res) => {
  // Ambil ID admin dari middleware 'protect'
  const adminUserId = req.user.id;

  const { name, description, price, stock_kg, category, image_url } = req.body;

  // Validasi input dasar
  if (!name || !price || stock_kg === undefined) {
    return res
      .status(400)
      .json({ message: "Nama, harga, dan stok harus diisi" });
  }

  try {
    const newProduct = await db.query(
      "INSERT INTO products (user_id, name, description, price, stock_kg, category, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [adminUserId, name, description || null, price, stock_kg, category || 'Ikan Konsumsi', image_url || null]
    );

    res.status(201).json({
      message: "Produk berhasil ditambahkan",
      product: newProduct.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params; // ID produk yang akan diupdate
    const { name, description, price, stock_kg, category, image_url } = req.body;

    // Cek dulu apakah produknya ada
    const productExist = await db.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );
    if (productExist.rows.length === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    const currentProduct = productExist.rows[0];

    // Gunakan data baru jika ada, jika tidak, gunakan data yang sudah ada
    const newName = name !== undefined ? name : currentProduct.name;
    const newDescription = description !== undefined ? description : currentProduct.description;
    const newPrice = price !== undefined ? price : currentProduct.price;
    const newStock = stock_kg !== undefined ? stock_kg : currentProduct.stock_kg;
    const newCategory = category !== undefined ? category : currentProduct.category;
    const newImageUrl = image_url !== undefined ? image_url : currentProduct.image_url;

    const updatedProduct = await db.query(
      "UPDATE products SET name = $1, description = $2, price = $3, stock_kg = $4, category = $5, image_url = $6 WHERE id = $7 RETURNING *",
      [newName, newDescription, newPrice, newStock, newCategory, newImageUrl, id]
    );

    res.status(200).json({
      message: "Produk berhasil diperbarui",
      product: updatedProduct.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params; // ID produk yang akan dihapus

    // Cek dulu apakah produknya ada
    const productExist = await db.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );
    if (productExist.rows.length === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    // Lakukan query DELETE
    await db.query("DELETE FROM products WHERE id = $1", [id]);

    res
      .status(200)
      .json({ message: `Produk dengan ID ${id} berhasil dihapus` });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

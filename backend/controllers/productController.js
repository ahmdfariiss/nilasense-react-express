// backend/controllers/productController.js
const db = require("../db");

// Fungsi untuk mendapatkan semua produk (Publik)
exports.getAllProducts = async (req, res) => {
  try {
    const { pond_id } = req.query; // Optional: filter by pond_id

    let query = `
      SELECT 
        p.*,
        ponds.name as pond_name,
        ponds.location as pond_location
      FROM products p
      LEFT JOIN ponds ON p.pond_id = ponds.id
    `;
    let params = [];

    if (pond_id) {
      query += " WHERE p.pond_id = $1";
      params.push(pond_id);
    }

    query += " ORDER BY p.created_at DESC";

    const products = await db.query(query, params);
    res.status(200).json(products.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params; // Ambil ID dari parameter URL

    const product = await db.query(
      `SELECT 
        p.*,
        ponds.name as pond_name,
        ponds.location as pond_location
      FROM products p
      LEFT JOIN ponds ON p.pond_id = ponds.id
      WHERE p.id = $1`,
      [id]
    );

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

// Fungsi untuk mendapatkan produk berdasarkan pond_id (untuk multi-admin system)
exports.getProductsByPond = async (req, res) => {
  try {
    const { pond_id } = req.params;

    const products = await db.query(
      `SELECT 
        p.*,
        ponds.name as pond_name,
        ponds.location as pond_location
      FROM products p
      LEFT JOIN ponds ON p.pond_id = ponds.id
      WHERE p.pond_id = $1 
      ORDER BY p.created_at DESC`,
      [pond_id]
    );

    res.status(200).json(products.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Fungsi untuk mendapatkan produk milik admin/petambak tertentu
exports.getMyProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const userPondId = req.user.pond_id;

    let query;
    let params;

    if (userRole === "admin") {
      // Admin: get ALL products (can see everything)
      query = `
        SELECT 
          p.*,
          ponds.name as pond_name,
          ponds.location as pond_location
        FROM products p
        LEFT JOIN ponds ON p.pond_id = ponds.id
        ORDER BY p.created_at DESC
      `;
      params = [];
    } else if (userRole === "petambak") {
      // Petambak: get only products for their assigned pond
      if (!userPondId) {
        return res.status(403).json({
          message: "Petambak belum di-assign ke kolam",
        });
      }
      query = `
        SELECT 
          p.*,
          ponds.name as pond_name,
          ponds.location as pond_location
        FROM products p
        LEFT JOIN ponds ON p.pond_id = ponds.id
        WHERE p.pond_id = $1 
        ORDER BY p.created_at DESC
      `;
      params = [userPondId];
    } else {
      return res.status(403).json({
        message: "Akses ditolak",
      });
    }

    const products = await db.query(query, params);
    res.status(200).json(products.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Upload image only (standalone endpoint)
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Tidak ada file yang diupload" });
    }

    // Return the uploaded file path
    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({
      message: "Gambar berhasil diupload",
      image_url: imageUrl,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

exports.createProduct = async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  const userPondId = req.user.pond_id;

  const { name, description, price, stock_kg, category, image_url, pond_id } =
    req.body;

  // Handle uploaded file
  let finalImageUrl = image_url;
  if (req.file) {
    finalImageUrl = `/uploads/${req.file.filename}`;
  }

  // Validasi input dasar
  if (!name || !price || stock_kg === undefined) {
    return res
      .status(400)
      .json({ message: "Nama, harga, dan stok harus diisi" });
  }

  try {
    // Validate access for petambak
    if (userRole === "petambak") {
      if (!userPondId) {
        return res.status(403).json({
          message: "Petambak belum di-assign ke kolam",
        });
      }
      // Petambak can only create products for their assigned pond
      if (pond_id && parseInt(pond_id) !== userPondId) {
        return res.status(403).json({
          message:
            "Anda hanya dapat menambahkan produk untuk kolam yang di-assign kepada Anda",
        });
      }
      // Auto-assign pond_id for petambak
      const finalPondId = pond_id || userPondId;

      const newProduct = await db.query(
        "INSERT INTO products (user_id, name, description, price, stock_kg, category, image_url, pond_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        [
          userId,
          name,
          description || null,
          price,
          stock_kg,
          category || "Ikan Konsumsi",
          finalImageUrl || null,
          finalPondId,
        ]
      );

      return res.status(201).json({
        message: "Produk berhasil ditambahkan",
        product: newProduct.rows[0],
      });
    }

    // Admin can create products for any pond or no pond
    const newProduct = await db.query(
      "INSERT INTO products (user_id, name, description, price, stock_kg, category, image_url, pond_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        userId,
        name,
        description || null,
        price,
        stock_kg,
        category || "Ikan Konsumsi",
        finalImageUrl || null,
        pond_id || null,
      ]
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
    const userId = req.user.id;
    const userRole = req.user.role;
    const userPondId = req.user.pond_id;

    // Cek dulu apakah produknya ada
    const productExist = await db.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );
    if (productExist.rows.length === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    const currentProduct = productExist.rows[0];
    const { name, description, price, stock_kg, category, image_url, pond_id } =
      req.body;

    // Handle uploaded file
    let finalImageUrl = image_url;
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }

    // Validate access for petambak
    if (userRole === "petambak") {
      if (!userPondId) {
        return res.status(403).json({
          message: "Petambak belum di-assign ke kolam",
        });
      }
      // Petambak can only update products for their assigned pond
      if (currentProduct.pond_id !== userPondId) {
        return res.status(403).json({
          message:
            "Anda hanya dapat mengelola produk untuk kolam yang di-assign kepada Anda",
        });
      }
      // Petambak cannot change pond_id
      if (pond_id !== undefined && parseInt(pond_id) !== userPondId) {
        return res.status(403).json({
          message: "Anda tidak dapat memindahkan produk ke kolam lain",
        });
      }
    }

    // Gunakan data baru jika ada, jika tidak, gunakan data yang sudah ada
    const newName = name !== undefined ? name : currentProduct.name;
    const newDescription =
      description !== undefined
        ? description === null || description === ""
          ? null
          : description
        : currentProduct.description;
    const newPrice = price !== undefined ? price : currentProduct.price;
    const newStock =
      stock_kg !== undefined ? stock_kg : currentProduct.stock_kg;
    const newCategory =
      category !== undefined ? category : currentProduct.category;
    const newImageUrl =
      finalImageUrl !== undefined
        ? finalImageUrl === null || finalImageUrl === ""
          ? null
          : finalImageUrl
        : currentProduct.image_url;
    const newPondId = pond_id !== undefined ? pond_id : currentProduct.pond_id;

    const updatedProduct = await db.query(
      "UPDATE products SET name = $1, description = $2, price = $3, stock_kg = $4, category = $5, image_url = $6, pond_id = $7 WHERE id = $8 RETURNING *",
      [
        newName,
        newDescription,
        newPrice,
        newStock,
        newCategory,
        newImageUrl,
        newPondId,
        id,
      ]
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
    const userId = req.user.id;
    const userRole = req.user.role;
    const userPondId = req.user.pond_id;

    // Cek dulu apakah produknya ada
    const productExist = await db.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );
    if (productExist.rows.length === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    const currentProduct = productExist.rows[0];

    // Validate access for petambak
    if (userRole === "petambak") {
      if (!userPondId) {
        return res.status(403).json({
          message: "Petambak belum di-assign ke kolam",
        });
      }
      // Petambak can only delete products for their assigned pond
      if (currentProduct.pond_id !== userPondId) {
        return res.status(403).json({
          message:
            "Anda hanya dapat menghapus produk untuk kolam yang di-assign kepada Anda",
        });
      }
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

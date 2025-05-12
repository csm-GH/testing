// server.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const connection = require('./connect');       // Important: Import the MySQL connection for direct queries
const create = require('./init');              // Module to create tables
const insert = require('./insert');            // Insert functions
const update = require('./update');            // Update functions (if used externally)
const get = require('./get');                  // Get functions
const del = require('./delete');               // Delete functions

const app = express();
const port = 3001;

// Configure multer to store files in memory and limit file size to 5 MB.
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});

app.use(cors());
app.use(express.json());

// Create tables if they do not exist
create.createUsersTable();
create.createProductsTable();
create.createOrdersTable();
create.createOrderItemsTable();
create.createCategoryTypeTable();
create.createCategoryItemTable();

// ---------------- GET ENDPOINTS ----------------

// 1) GET All Users
app.get('/api/users', (req, res) => {
  get.getAllUsers((err, users) => {
    if (err) {
      return res.status(500).json({
        error: "Error fetching users",
        details: err.message,
      });
    }
    res.status(200).json(users);
  });
});

// 2) GET User Information by Name and Password
app.get('/api/users/byCredentials', (req, res) => {
  const { name, password } = req.query;
  if (!name || !password) {
    return res
      .status(400)
      .json({ error: "Missing required parameters: name and password" });
  }
  const query = "SELECT * FROM Users WHERE Name = ? AND Password = ?";
  connection.query(query, [name, password], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Error fetching user",
        details: err.message,
      });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(results[0]);
  });
});

// 3) GET All Products or Filter by ProductID or Product Name
app.get('/api/products', (req, res) => {
  const { productId, name } = req.query;
  if (productId) {
    // When productId is provided, use the getProductById function
    get.getProductById(productId, (err, product) => {
      if (err) {
        return res.status(500).json({
          error: "Error fetching product by ID",
          details: err.message,
        });
      }
      if (product.ProductImage)
        product.ProductImageURL = `data:image/png;base64,${Buffer.from(
          product.ProductImage
        ).toString("base64")}`;
      else product.ProductImageURL = null;
      res.status(200).json(product);
    });
  } else if (name) {
    // When name is provided, search via a LIKE query.
    const query = "SELECT * FROM Products WHERE ProductName LIKE ?";
    connection.query(query, [`%${name}%`], (err, results) => {
      if (err) {
        return res.status(500).json({
          error: "Error fetching products by name",
          details: err.message,
        });
      }
      const updated = results.map((product) => {
        if (product.ProductImage)
          product.ProductImageURL = `data:image/png;base64,${Buffer.from(
            product.ProductImage
          ).toString("base64")}`;
        else product.ProductImageURL = null;
        return product;
      });
      res.status(200).json(updated);
    });
  } else {
    // Otherwise, return all products.
    get.getAllProducts((err, products) => {
      if (err) {
        return res.status(500).json({
          error: "Error fetching products",
          details: err.message,
        });
      }
      const updated = products.map((product) => {
        if (product.ProductImage)
          product.ProductImageURL = `data:image/png;base64,${Buffer.from(
            product.ProductImage
          ).toString("base64")}`;
        else product.ProductImageURL = null;
        return product;
      });
      res.status(200).json(updated);
    });
  }
});

// 4) GET All Orders
app.get('/api/orders', (req, res) => {
  get.getAllOrders((err, orders) => {
    if (err) {
      return res.status(500).json({
        error: "Error fetching orders",
        details: err.message,
      });
    }
    res.status(200).json(orders);
  });
});

// 5) GET All Order Items for a Given Order ID
app.get('/api/order-items', (req, res) => {
  const { orderId } = req.query;
  if (orderId) {
    const query = "SELECT * FROM Order_Items WHERE OrderID = ?";
    connection.query(query, [orderId], (err, results) => {
      if (err) {
        return res.status(500).json({
          error: "Error fetching order items",
          details: err.message,
        });
      }
      res.status(200).json(results);
    });
  } else {
    get.getAllOrderItems((err, orderItems) => {
      if (err) {
        return res.status(500).json({
          error: "Error fetching order items",
          details: err.message,
        });
      }
      res.status(200).json(orderItems);
    });
  }
});

// 6) GET All Category Types
app.get('/api/category-types', (req, res) => {
  get.getAllCategoryTypes((err, types) => {
    if (err) {
      return res.status(500).json({
        error: "Error fetching category types",
        details: err.message,
      });
    }
    res.status(200).json(types);
  });
});

// 7) GET All Category Items For a Given Category Type
app.get('/api/category-items', (req, res) => {
  const { typeId } = req.query;
  if (typeId) {
    const query = "SELECT * FROM Category_item WHERE TypeID = ?";
    connection.query(query, [typeId], (err, results) => {
      if (err) {
        return res.status(500).json({
          error: "Error fetching category items",
          details: err.message,
        });
      }
      res.status(200).json(results);
    });
  } else {
    get.getAllCategoryItems((err, items) => {
      if (err) {
        return res.status(500).json({
          error: "Error fetching category items",
          details: err.message,
        });
      }
      res.status(200).json(items);
    });
  }
});

// ---------------- INSERT ENDPOINTS ----------------

// 1) Insert New User
app.post('/api/users', (req, res) => {
  const userData = req.body;
  insert.insertUser(userData, (err, userId) => {
    if (err) {
      return res.status(500).json({
        error: "Error inserting user",
        details: err.message,
      });
    }
    res.status(201).json({ message: "User inserted successfully", userId });
  });
});

// 2) Insert New Product (Including Image)
// This route uses multer to handle a file upload (field name "ProductImage").
app.post('/api/products', upload.single('ProductImage'), (req, res) => {
  const productData = {
    ProductName: req.body.ProductName || null,
    ProductStock: req.body.ProductStock ? Number(req.body.ProductStock) : 0,
    ProductDescription: req.body.ProductDescription || null,
    ProductPrice: req.body.ProductPrice ? Number(req.body.ProductPrice) : 0,
    ProductImage: req.file ? req.file.buffer : null,
  };
  insert.insertProduct(productData, (err, productId) => {
    if (err) {
      return res.status(500).json({
        error: "Error inserting product",
        details: err.message,
      });
    }
    res.status(201).json({ message: "Product inserted successfully", productId });
  });
});

// 3) Insert New Order
app.post('/api/orders', (req, res) => {
  const orderData = req.body;
  insert.insertOrder(orderData, (err, orderId) => {
    if (err) {
      return res.status(500).json({
        error: "Error inserting order",
        details: err.message,
      });
    }
    res.status(201).json({ message: "Order inserted successfully", orderId });
  });
});

// 4) Insert New Order Item
app.post('/api/order-items', (req, res) => {
  const orderItemData = req.body;
  insert.insertOrderItem(orderItemData, (err, result) => {
    if (err) {
      return res.status(500).json({
        error: "Error inserting order item",
        details: err.message,
      });
    }
    res.status(201).json({ message: "Order item inserted successfully", result });
  });
});

// 5) Insert New Category Type
app.post('/api/category-type', (req, res) => {
  const categoryTypeData = req.body;
  insert.insertCategoryType(categoryTypeData, (err, typeId) => {
    if (err) {
      return res.status(500).json({
        error: "Error inserting category type",
        details: err.message,
      });
    }
    res.status(201).json({ message: "Category type inserted successfully", typeId });
  });
});

// 6) Insert New Category Item
app.post('/api/category-item', (req, res) => {
  const categoryItemData = req.body;
  insert.insertCategoryItem(categoryItemData, (err, result) => {
    if (err) {
      return res.status(500).json({
        error: "Error inserting category item",
        details: err.message,
      });
    }
    res.status(201).json({ message: "Category item inserted successfully", result });
  });
});

// ---------------- UPDATE ENDPOINTS ----------------

// 1) Update User Information
app.put('/api/users/update', (req, res) => {
  const { oldUserName, oldPassword, newName, newEmail, newPassword } = req.body;
  if (!oldUserName || !oldPassword) {
    return res.status(400).json({
      error: "Missing required credentials: oldUserName and oldPassword.",
    });
  }
  let updateFields = {};
  if (newName) updateFields.Name = newName;
  if (newEmail) updateFields.Email = newEmail;
  if (newPassword) updateFields.Password = newPassword;
  if (Object.keys(updateFields).length === 0) {
    return res
      .status(400)
      .json({ error: "No update fields provided. Nothing will change." });
  }
  let setClause = Object.keys(updateFields)
    .map((field) => `${field} = ?`)
    .join(", ");
  let values = Object.values(updateFields);
  const query = `UPDATE Users SET ${setClause} WHERE Name = ? AND Password = ?`;
  values.push(oldUserName, oldPassword);
  connection.query(query, values, (err, results) => {
    if (err) {
      console.error("Error updating user:", err);
      return res.status(500).json({ error: "Error updating user", details: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "No matching user found with provided credentials." });
    }
    res.status(200).json({ message: "User updated successfully.", results });
  });
});

// 2) Update Product (Including Image)
// Use query parameter "productId" or "name" to identify the product.
app.put('/api/products/update', upload.single('ProductImage'), (req, res) => {
  let identifier = {};
  if (req.query.productId) {
    identifier.ProductID = req.query.productId;
  } else if (req.query.name) {
    identifier.ProductName = req.query.name;
  } else {
    return res.status(400).json({
      error: "No product identifier provided. Provide productId or name as query parameter.",
    });
  }
  let updateFields = {};
  if (req.body.ProductName) updateFields.ProductName = req.body.ProductName;
  if (req.body.ProductStock) updateFields.ProductStock = Number(req.body.ProductStock);
  if (req.body.ProductDescription) updateFields.ProductDescription = req.body.ProductDescription;
  if (req.body.ProductPrice) updateFields.ProductPrice = Number(req.body.ProductPrice);
  if (req.file) updateFields.ProductImage = req.file.buffer;
  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ error: "No update fields provided. Nothing will change." });
  }
  let setClause = Object.keys(updateFields)
    .map((field) => `${field} = ?`)
    .join(", ");
  let values = Object.values(updateFields);
  let query = "";
  if (identifier.ProductID) {
    query = `UPDATE Products SET ${setClause} WHERE ProductID = ?`;
    values.push(identifier.ProductID);
  } else if (identifier.ProductName) {
    query = `UPDATE Products SET ${setClause} WHERE ProductName = ?`;
    values.push(identifier.ProductName);
  }
  connection.query(query, values, (err, results) => {
    if (err) {
      console.error("Error updating product:", err);
      return res.status(500).json({ error: "Error updating product", details: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json({ message: "Product updated successfully.", results });
  });
});
  
// ---------------- DELETE ENDPOINTS ----------------

// IMPORTANT: Place the "byCredentials" route before the generic /:id route.

// Delete User by Credentials
app.delete('/api/users/byCredentials', (req, res) => {
  const { name, password } = req.query;
  if (!name || !password) {
    return res.status(400).json({ error: "Missing required query parameters: name and password" });
  }
  const query = "DELETE FROM Users WHERE Name = ? AND Password = ?";
  connection.query(query, [name, password], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Error deleting user by credentials",
        details: err.message,
      });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "No matching user found" });
    }
    res.status(200).json({ message: "User deleted successfully by credentials.", results });
  });
});

// Delete User by User ID
app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  del.deleteUser(userId, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error deleting user by ID", details: err.message });
    }
    res.status(200).json({ message: `User with ID ${userId} deleted successfully.`, results });
  });
});

// Delete Product by Product ID
app.delete('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  del.deleteProduct(productId, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Error deleting product",
        details: err.message,
      });
    }
    res.status(200).json({
      message: `Product with ID ${productId} deleted successfully, and associated order and category items removed.`,
      results,
    });
  });
});

// Delete Category Type by ID (with cascading deletion of associated category items)
app.delete('/api/category-types/:id', (req, res) => {
  const typeId = req.params.id;
  del.deleteCategoryType(typeId, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Error deleting category type",
        details: err.message,
      });
    }
    res.status(200).json({
      message: `Category type with ID ${typeId} deleted successfully, along with associated category items.`,
      results,
    });
  });
});

// Delete Order by Order ID (with cascading deletion of associated order items)
app.delete('/api/orders/:id', (req, res) => {
  const orderId = req.params.id;
  del.deleteOrder(orderId, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Error deleting order",
        details: err.message,
      });
    }
    res.status(200).json({
      message: `Order with ID ${orderId} deleted successfully, along with associated order items.`,
      results,
    });
  });
});
  
// ---------------- ROOT ENDPOINT ----------------
app.get('/', (req, res) => {
  res.send("API is running. Use /api endpoints to test CRUD operations.");
});
  
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

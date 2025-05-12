const connection = require('./connect'); // Import the MySQL connection

/**
 * Retrieves all users from the Users table.
 * @param {Function} callback - callback function (error, results)
 */
const getAllUsers = (callback) => {
  const query = 'SELECT * FROM Users';
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching all users:", err);
      return callback(err, null);
    }
    callback(null, results);
  });
};

/**
 * Retrieves a single user by UserID.
 * @param {number} userID - The unique UserID.
 * @param {Function} callback - callback function (error, result)
 */
const getUserById = (userID, callback) => {
  const query = 'SELECT * FROM Users WHERE UserID = ?';
  connection.query(query, [userID], (err, results) => {
    if (err) {
      console.error(`Error fetching user with ID ${userID}:`, err);
      return callback(err, null);
    }
    // If no user is found, results will be an empty array.
    if (results.length === 0) {
      return callback(new Error("User not found"), null);
    }
    callback(null, results[0]); // Return the single user record.
  });
};

/**
 * Retrieves all products from the Products table.
 * @param {Function} callback - callback function (error, results)
 */
const getAllProducts = (callback) => {
  const query = 'SELECT * FROM Products';
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching all products:", err);
      return callback(err, null);
    }
    callback(null, results);
  });
};

/**
 * Retrieves a single product by ProductID.
 * @param {number} productID - The unique ProductID.
 * @param {Function} callback - callback function (error, result)
 */
const getProductById = (productID, callback) => {
  const query = 'SELECT * FROM Products WHERE ProductID = ?';
  connection.query(query, [productID], (err, results) => {
    if (err) {
      console.error(`Error fetching product with ID ${productID}:`, err);
      return callback(err, null);
    }
    if (results.length === 0) {
      return callback(new Error("Product not found"), null);
    }
    callback(null, results[0]);
  });
};

/**
 * Retrieves all orders from the Orders table.
 * @param {Function} callback - callback function (error, results)
 */
const getAllOrders = (callback) => {
  const query = 'SELECT * FROM Orders';
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      return callback(err, null);
    }
    callback(null, results);
  });
};

/**
 * Retrieves all order items from the Order_Items table.
 * @param {Function} callback - callback function (error, results)
 */
const getAllOrderItems = (callback) => {
  const query = 'SELECT * FROM Order_Items';
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching order items:", err);
      return callback(err, null);
    }
    callback(null, results);
  });
};

/**
 * Retrieves all category types from the Category_type table.
 * @param {Function} callback - callback function (error, results)
 */
const getAllCategoryTypes = (callback) => {
  const query = 'SELECT * FROM Category_type';
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching category types:", err);
      return callback(err, null);
    }
    callback(null, results);
  });
};

/**
 * Retrieves all category items from the Category_item table.
 * @param {Function} callback - callback function (error, results)
 */
const getAllCategoryItems = (callback) => {
  const query = 'SELECT * FROM Category_item';
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching category items:", err);
      return callback(err, null);
    }
    callback(null, results);
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  getAllProducts,
  getProductById,
  getAllOrders,
  getAllOrderItems,
  getAllCategoryTypes,
  getAllCategoryItems
};

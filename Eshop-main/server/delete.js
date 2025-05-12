// delete.js
const connection = require('./connect'); // Import your MySQL connection

/*
 * Deletes a user from the Users table by UserID.
 * @param {number} userId - The unique ID of the user.
 * @param {Function} callback - Callback function (error, results).
 */
const deleteUser = (userId, callback) => {
  if (!userId) {
    return callback(new Error("Missing required parameter: userId"), null);
  }

  const query = "DELETE FROM Users WHERE UserID = ?";
  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error(`Error deleting user with ID ${userId}:`, err);
      return callback(err, null);
    }
    console.log(`User with ID ${userId} deleted successfully.`);
    callback(null, results);
  });
};

/*
 * Deletes a product from the Products table by ProductID.
 * @param {number} productId - The unique ID of the product.
 * @param {Function} callback - Callback function (error, results).
 */
const deleteProduct = (productId, callback) => {
  if (!productId) {
    return callback(new Error("Missing required parameter: productId"), null);
  }

  const query = "DELETE FROM Products WHERE ProductID = ?";
  connection.query(query, [productId], (err, results) => {
    if (err) {
      console.error(`Error deleting product with ID ${productId}:`, err);
      return callback(err, null);
    }
    console.log(`Product with ID ${productId} deleted successfully.`);
    callback(null, results);
  });
};

/*
 * Deletes an order from the Orders table by OrderID.
 * @param {number} orderId - The unique ID of the order.
 * @param {Function} callback - Callback function (error, results).
 */
const deleteOrder = (orderId, callback) => {
  if (!orderId) {
    return callback(new Error("Missing required parameter: orderId"), null);
  }

  const query = "DELETE FROM Orders WHERE OrderID = ?";
  connection.query(query, [orderId], (err, results) => {
    if (err) {
      console.error(`Error deleting order with ID ${orderId}:`, err);
      return callback(err, null);
    }
    console.log(`Order with ID ${orderId} deleted successfully.`);
    callback(null, results);
  });
};

/*
 * Deletes an order item from the Order_Items table.
 * @param {number} orderId - The unique order ID.
 * @param {number} productId - The unique product ID.
 * @param {Function} callback - Callback function (error, results).
 */
const deleteOrderItem = (orderId, productId, callback) => {
  if (!orderId || !productId) {
    return callback(new Error("Missing required parameters: orderId and productId are required."), null);
  }

  const query = "DELETE FROM Order_Items WHERE OrderID = ? AND ProductID = ?";
  connection.query(query, [orderId, productId], (err, results) => {
    if (err) {
      console.error(`Error deleting order item with OrderID ${orderId} and ProductID ${productId}:`, err);
      return callback(err, null);
    }
    console.log(`Order item with OrderID ${orderId} and ProductID ${productId} deleted successfully.`);
    callback(null, results);
  });
};

/*
 * Deletes a category type from the Category_type table by TypeID.
 * @param {number} typeId - The unique ID of the category type.
 * @param {Function} callback - Callback function (error, results).
 */
const deleteCategoryType = (typeId, callback) => {
  if (!typeId) {
    return callback(new Error("Missing required parameter: typeId"), null);
  }

  const query = "DELETE FROM Category_type WHERE TypeID = ?";
  connection.query(query, [typeId], (err, results) => {
    if (err) {
      console.error(`Error deleting category type with ID ${typeId}:`, err);
      return callback(err, null);
    }
    console.log(`Category type with ID ${typeId} deleted successfully.`);
    callback(null, results);
  });
};

/*
 * Deletes a category item from the Category_item table.
 * @param {number} productId - The product ID.
 * @param {number} typeId - The category type ID.
 * @param {Function} callback - Callback function (error, results).
 */
const deleteCategoryItem = (productId, typeId, callback) => {
  if (!productId || !typeId) {
    return callback(new Error("Missing required parameters: productId and typeId are required."), null);
  }

  const query = "DELETE FROM Category_item WHERE ProductID = ? AND TypeID = ?";
  connection.query(query, [productId, typeId], (err, results) => {
    if (err) {
      console.error(`Error deleting category item with ProductID ${productId} and TypeID ${typeId}:`, err);
      return callback(err, null);
    }
    console.log(`Category item with ProductID ${productId} and TypeID ${typeId} deleted successfully.`);
    callback(null, results);
  });
};

// Export all the delete functions
module.exports = {
  deleteUser,
  deleteProduct,
  deleteOrder,
  deleteOrderItem,
  deleteCategoryType,
  deleteCategoryItem
};

// update.js
const connection = require('./connect'); // Import the MySQL connection

/**
 * Updates a user in the Users table by matching on the current name and password.
 * 
 * @param {string} oldUserName - The current username.
 * @param {string} oldPassword - The current password.
 * @param {string} newName - The new username.
 * @param {string} newEmail - The new email.
 * @param {string} newPassword - The new password.
 * @param {Function} callback - Callback function (error, results).
 */
const updateUserByCredentials = (oldUserName, oldPassword, newName, newEmail, newPassword, callback) => {
  if (!oldUserName || !oldPassword || !newName || !newEmail || !newPassword) {
    return callback(new Error("Missing required fields for user update"), null);
  }

  const query = `
    UPDATE Users 
    SET Name = ?, Email = ?, Password = ?
    WHERE Name = ? AND Password = ?
  `;
  const values = [newName, newEmail, newPassword, oldUserName, oldPassword];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error(`Error updating user (${oldUserName}):`, err);
      return callback(err, null);
    }
    // results.affectedRows tells us if a row was updated.
    callback(null, results);
  });
};

/**
 * Updates a product in the Products table by product Id.
 * 
 * @param {number} productId - The product Id.
 * @param {Object} updatedData - An object with the fields to update.
 *   For example: { ProductName: "New Name", ProductStock: 50, ProductDescription: "Updated", ProductPrice: 120 }
 * @param {Function} callback - Callback function (error, results).
 */
const updateProduct = (productId, updatedData, callback) => {
  if (!productId || !updatedData || Object.keys(updatedData).length === 0) {
    return callback(new Error("Missing required fields for product update"), null);
  }
  
  // Build dynamic SET clause.
  let setClauses = [];
  let values = [];
  for (const key in updatedData) {
    setClauses.push(`${key} = ?`);
    values.push(updatedData[key]);
  }
  const setClause = setClauses.join(", ");
  values.push(productId); // For the WHERE clause

  const query = `UPDATE Products SET ${setClause} WHERE ProductID = ?`;

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error(`Error updating product with ID ${productId}:`, err);
      return callback(err, null);
    }
    callback(null, results);
  });
};

module.exports = {
  updateUserByCredentials,
  updateProduct
};

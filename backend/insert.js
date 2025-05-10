const connection = require('./connect'); // Import the MySQL connection

/*
 * Inserts a new user into the Users table.
 *   - Name: {string} (required)
 *   - Email: {string} (required)
 *   - Password: {string} (required)
 *   - Role: {number} (required, e.g., 0 for a regular user, 1 for admin)
 */
const insertUser = (user, callback) => {
  const { Name, Email, Password, Role } = user;
  if (!Name || !Email || !Password || Role === undefined) {
    return callback(
      new Error("Missing required user fields: Name, Email, Password, and Role are required."),
      null
    );
  }
  const query = `
    INSERT INTO Users (Name, Email, Password, Role)
    VALUES (?, ?, ?, ?)
  `;
  connection.query(query, [Name, Email, Password, Role], (err, results) => {
    if (err) {
      console.error("Error inserting user:", err);
      return callback(err, null);
    }
    console.log("User inserted with ID:", results.insertId);
    callback(null, results.insertId);
  });
};

/*
 * Inserts a new product into the Products table.
 *   - ProductName: {string|null} (optional)
 *   - ProductStock: {number} (default is 0)
 *   - ProductDescription: {string|null} (optional)
 *   - ProductPrice: {number} (default is 0)
 *   - ProductImage: {Buffer|null} (if storing images as binary data)
 */
const insertProduct = (product, callback) => {
  const {
    ProductName = null,
    ProductStock = 0,
    ProductDescription = null,
    ProductPrice = 0,
    ProductImage = null,
  } = product;
  const sql = `
    INSERT INTO Products (ProductName, ProductStock, ProductDescription, ProductPrice, ProductImage)
    VALUES (?, ?, ?, ?, ?)
  `;
  connection.query(
    sql,
    [ProductName, ProductStock, ProductDescription, ProductPrice, ProductImage],
    (err, results) => {
      if (err) {
        console.error("Error inserting product:", err);
        return callback(err, null);
      }
      console.log("Product inserted with ID:", results.insertId);
      callback(null, results.insertId);
    }
  );
};

/*
 * Inserts a new order into the Orders table.
 *   - UserID: {number} (required; the ID of the user placing the order)
 */
const insertOrder = (order, callback) => {
  const { UserID } = order;
  if (!UserID) {
    return callback(new Error("Missing required field: UserID"), null);
  }
  const sql = `INSERT INTO Orders (UserID) VALUES (?)`;
  connection.query(sql, [UserID], (err, results) => {
    if (err) {
      console.error("Error inserting order:", err);
      return callback(err, null);
    }
    console.log("Order inserted with ID:", results.insertId);
    callback(null, results.insertId);
  });
};

/*
 * Inserts a new order item into the Order_Items table.
 *   - OrderID: {number} (required; must match an existing order)
 *   - ProductID: {number} (required; references the Products table)
 *   - Number: {number} (required; must be > 0)
 */
const insertOrderItem = (orderItem, callback) => {
  const { OrderID, ProductID, Number } = orderItem;
  if (!OrderID || !ProductID || !Number || Number <= 0) {
    return callback(
      new Error("Missing or invalid fields: OrderID, ProductID, and a Number greater than 0 are required."),
      null
    );
  }
  const sql = `
    INSERT INTO Order_Items (OrderID, ProductID, Number)
    VALUES (?, ?, ?)
  `;
  connection.query(sql, [OrderID, ProductID, Number], (err, results) => {
    if (err) {
      console.error("Error inserting order item:", err);
      return callback(err, null);
    }
    console.log(`Order item inserted for OrderID ${OrderID} and ProductID ${ProductID}.`);
    callback(null, results);
  });
};

/*
 * Inserts a new category type into the Category_type table.
 *   - TypeName: {string} (required; must be unique)
 */
const insertCategoryType = (categoryType, callback) => {
  const { TypeName } = categoryType;
  if (!TypeName) {
    return callback(new Error("Missing required field: TypeName"), null);
  }
  const sql = `
    INSERT INTO Category_type (TypeName)
    VALUES (?)
  `;
  connection.query(sql, [TypeName], (err, results) => {
    if (err) {
      console.error("Error inserting category type:", err);
      return callback(err, null);
    }
    console.log("Category type inserted with ID:", results.insertId);
    callback(null, results.insertId);
  });
};

/*
 * Inserts a new category item into the Category_item table.
 *   - ProductID: {number} (required; references the Products table)
 *   - TypeID: {number} (required; references the Category_type table)
 */
const insertCategoryItem = (categoryItem, callback) => {
  const { ProductID, TypeID } = categoryItem;
  if (!ProductID || !TypeID) {
    return callback(new Error("Missing required fields: ProductID and TypeID are required."), null);
  }
  const sql = `
    INSERT INTO Category_item (ProductID, TypeID)
    VALUES (?, ?)
  `;
  connection.query(sql, [ProductID, TypeID], (err, results) => {
    if (err) {
      console.error("Error inserting category item:", err);
      return callback(err, null);
    }
    console.log("Category item inserted for ProductID", ProductID, "and TypeID", TypeID);
    callback(null, results);
  });
};

/*
 * Inserts a new license into the License table.
 *   - License: {string} (required; must be exactly 20 characters long)
 */
const insertLicense = (license, callback) => {
  if (!license) {
    return callback(new Error("License parameter is missing."), null);
  }
  if (license.length !== 20) {
    return callback(new Error("License must be exactly 20 characters long."), null);
  }
  const sql = "INSERT INTO License (LicenseCode) VALUES (?)";
  connection.query(sql, [license], (err, results) => {
    if (err) {
      console.error("Error inserting license:", err);
      return callback(err, null);
    }
    console.log("License inserted:", license);
    callback(null, license);
  });
};

module.exports = {
  insertUser,
  insertProduct,
  insertOrder,
  insertOrderItem,
  insertCategoryType,
  insertCategoryItem,
  insertLicense,
};
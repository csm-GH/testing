const connection = require('./connect'); // Import the MySQL connection

/*
 * Inserts a new user into the Users table.
 * 
 * @param {Object} user - An object containing the user details.
 *   Expected keys:
 *     - Name: {string} (required)
 *     - Email: {string} (required)
 *     - Password: {string} (required)
 *     - Role: {number} (required, e.g., 0 for a regular user, 1 for admin)
 * @param {Function} callback - A callback function that receives (error, insertId).
 */
const insertUser = (user, callback) => {
    const { Name, Email, Password, Role } = user;

    // Validate that all required fields are provided.
    if (!Name || !Email || !Password || Role === undefined) {
        return callback(new Error("Missing required user fields: Name, Email, Password, and Role are required."), null);
    }

    // Prepare the SQL query. We don't need to insert UserID or RegistrationDate since they're auto-generated.
    const query = `
        INSERT INTO Users (Name, Email, Password, Role)
        VALUES (?, ?, ?, ?)
    `;

    // Execute the query with parameterized values.
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
 *
 * @param {Object} product - An object containing the product details.
 *   Expected keys:
 *     - ProductName: {string} (nullable)
 *     - ProductStock: {number} (default is 0 if not provided)
 *     - ProductDescription: {string} (nullable)
 *     - ProductPrice: {number} (default is 0 if not provided)
 *     - ProductImage: {Buffer|null} (if storing images as binary data)
 * @param {Function} callback - A callback function to handle the result.
 *   It receives two parameters: (error, insertId).
 */
const insertProduct = (product, callback) => {
  // Destructure product info and provide default values where needed.
  const {
    ProductName = null,
    ProductStock = 0,
    ProductDescription = null,
    ProductPrice = 0,
    ProductImage = null,
  } = product;

  // Prepare the SQL query using parameterized placeholders to avoid SQL injection.
  const sql = `
    INSERT INTO Products (ProductName, ProductStock, ProductDescription, ProductPrice, ProductImage)
    VALUES (?, ?, ?, ?, ?)
  `;

  // Execute the query.
  connection.query(
    sql,
    [ProductName, ProductStock, ProductDescription, ProductPrice, ProductImage],
    (err, results) => {
      if (err) {
        console.error('Error inserting product:', err);
        return callback(err, null);
      }
      console.log('Product inserted with ID:', results.insertId);
      callback(null, results.insertId);
    }
  );
};

/*
 * Inserts a new order into the Orders table.
 *
 * @param {Object} order - An object containing the order details.
 *   Expected keys:
 *     - UserID: {number} (required; the ID of the user placing the order)
 * @param {Function} callback - A callback function that receives (error, orderId).
 */
const insertOrder = (order, callback) => {
    const { UserID } = order;

    // Validate that UserID is provided.
    if (!UserID) {
        return callback(new Error("Missing required field: UserID"), null);
    }

    // Since OrderDate is auto-generated, we only need to pass the UserID.
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
 *
 * @param {Object} orderItem - An object containing the order item details.
 *   Expected keys:
 *     - OrderID: {number} (required; must match an Order inserted earlier)
 *     - ProductID: {number} (required; references the Products table)
 *     - Number: {number} (required; must be > 0)
 * @param {Function} callback - A callback function that receives (error, result).
 */
const insertOrderItem = (orderItem, callback) => {
    const { OrderID, ProductID, Number } = orderItem;

    // Validate that all required fields are provided and Number is > 0.
    if (!OrderID || !ProductID || !Number || Number <= 0) {
        return callback(new Error("Missing or invalid fields: OrderID, ProductID, and a Number greater than 0 are required."), null);
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
 *
 * @param {Object} categoryType - An object with the category type details.
 *   Expected keys:
 *     - TypeName: {string} (required; must be unique)
 * @param {Function} callback - A callback function that receives (error, insertId).
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
 *
 * @param {Object} categoryItem - An object with the category item details.
 *   Expected keys:
 *     - ProductID: {number} (required; references Products table)
 *     - TypeID: {number} (required; references Category_type table)
 * @param {Function} callback - A callback function that receives (error, result).
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
  

module.exports = {
    insertUser,
    insertProduct,
    insertOrder,
    insertOrderItem,
    insertCategoryType,
    insertCategoryItem
};

const connection = require('./connect'); // Now importing from connect.js

// Function to create the Users table
const createUsersTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Users (
      UserID INT AUTO_INCREMENT PRIMARY KEY,
      Name VARCHAR(100) NOT NULL,
      Email VARCHAR(100) UNIQUE NOT NULL,
      Password VARCHAR(255) NOT NULL,
      Role TINYINT(1) NOT NULL,
      RegistrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  connection.query(query, (err) => {
    if (err) {
      console.error('Error creating Users table:', err);
    } else {
      console.log('Users table created or already exists.');
    }
  });
};

//function of create the product table
const createProductsTable = () => {
    const query = `
      CREATE TABLE IF NOT EXISTS Products (
        ProductID INT AUTO_INCREMENT PRIMARY KEY,
        ProductName VARCHAR(50) DEFAULT NULL,
        ProductStock INT DEFAULT 0,
        ProductDescription VARCHAR(500) DEFAULT NULL,
        ProductPrice INT DEFAULT 0,
        ProductImage LONGBLOB
      );
    `;
  
    connection.query(query, (err) => {
      if (err) {
        console.error('Error creating Products table:', err);
      } else {
        console.log('Products table created or already exists.');
      }
    });
};
  
// Function to create the Orders table
const createOrdersTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS Orders (
        OrderID INT AUTO_INCREMENT PRIMARY KEY,
        UserID INT NOT NULL,
        OrderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
        );
    `;

    connection.query(query, (err) => {
        if (err) {
        console.error('Error creating Orders table:', err);
        } else {
        console.log('Orders table created or already exists.');
        }
    });
};
  
// Function to create the Order_Items table
const createOrderItemsTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS Order_Items (
        OrderID INT,
        ProductID INT,
        Number INT NOT NULL CHECK (Number > 0),
        PRIMARY KEY (OrderID, ProductID),
        FOREIGN KEY (OrderID) REFERENCES Orders(OrderID) ON DELETE CASCADE,
        FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE
        );
    `;

    connection.query(query, (err) => {
        if (err) {
        console.error('Error creating Order_Items table:', err);
        } else {
        console.log('Order_Items table created or already exists.');
        }
    });
};

// Function to create the Category_type table
const createCategoryTypeTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS Category_type (
        TypeID INT AUTO_INCREMENT PRIMARY KEY,
        TypeName VARCHAR(100) NOT NULL UNIQUE
        );
    `;

    connection.query(query, (err) => {
        if (err) {
        console.error('Error creating Category_type table:', err);
        } else {
        console.log('Category_type table created or already exists.');
        }
    });
};

// Function to create the Category_item table
const createCategoryItemTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS Category_item (
        ProductID INT,
        TypeID INT,
        PRIMARY KEY (ProductID, TypeID),
        FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE,
        FOREIGN KEY (TypeID) REFERENCES Category_type(TypeID) ON DELETE CASCADE
        );
    `;

    connection.query(query, (err) => {
        if (err) {
        console.error('Error creating Category_item table:', err);
        } else {
        console.log('Category_item table created or already exists.');
        }
    });
};


// Export functions
module.exports = { 
    createUsersTable,
    createProductsTable,
    createOrdersTable,
    createOrderItemsTable,
    createCategoryTypeTable,
    createCategoryItemTable
};

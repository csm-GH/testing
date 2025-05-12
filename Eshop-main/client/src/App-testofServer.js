// App.js
import React, { useState, useEffect } from "react";

function App() {
  const [view, setView] = useState("menu"); // "menu", "insert", "get", "update", "delete"

  return (
    <div style={styles.container}>
      <h1>CRUD Application Tester</h1>
      {view === "menu" && <MainMenu setView={setView} />}
      {view === "insert" && <InsertView setView={setView} />}
      {view === "get" && <GetView setView={setView} />}
      {view === "update" && <UpdateView setView={setView} />}
      {view === "delete" && <DeleteView setView={setView} />}
    </div>
  );
}

function MainMenu({ setView }) {
  return (
    <div>
      <h2>Main Menu</h2>
      <button onClick={() => setView("insert")}>Insert</button>{" "}
      <button onClick={() => setView("get")}>Get</button>{" "}
      <button onClick={() => setView("update")}>Update</button>{" "}
      <button onClick={() => setView("delete")}>Delete</button>
    </div>
  );
}

// ---------------- INSERT SECTION ----------------
function InsertView({ setView }) {
  const [option, setOption] = useState("");
  const [message, setMessage] = useState("");

  // States for new user
  const [newUser, setNewUser] = useState({
    Name: "",
    Email: "",
    Password: "",
    Role: ""
  });

  // States for new product (with image)
  const [newProduct, setNewProduct] = useState({
    ProductName: "",
    ProductStock: "",
    ProductDescription: "",
    ProductPrice: ""
  });
  const [productFile, setProductFile] = useState(null);

  // State for new order
  const [newOrder, setNewOrder] = useState({ UserID: "" });

  // State for new order item
  const [newOrderItem, setNewOrderItem] = useState({
    OrderID: "",
    ProductID: "",
    Number: ""
  });

  // State for new category type
  const [newCatType, setNewCatType] = useState({ TypeName: "" });

  // State for new category item
  const [newCatItem, setNewCatItem] = useState({ ProductID: "", TypeID: "" });

  // Insert User
  const handleInsertUser = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });
      const data = await res.json();
      setMessage(data.message || "User inserted successfully");
    } catch (error) {
      setMessage("Error inserting user");
    }
  };

  // Insert Product with image using FormData
  const handleInsertProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("ProductName", newProduct.ProductName);
    formData.append("ProductStock", newProduct.ProductStock);
    formData.append("ProductDescription", newProduct.ProductDescription);
    formData.append("ProductPrice", newProduct.ProductPrice);
    if (productFile) {
      formData.append("ProductImage", productFile);
    }
    try {
      const res = await fetch("http://localhost:3001/api/products", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      setMessage(data.message || "Product inserted successfully");
    } catch (error) {
      setMessage("Error inserting product");
    }
  };

  // Insert Order
  const handleInsertOrder = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder)
      });
      const data = await res.json();
      setMessage(data.message || "Order inserted successfully");
    } catch (error) {
      setMessage("Error inserting order");
    }
  };

  // Insert Order Item
  const handleInsertOrderItem = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/order-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrderItem)
      });
      const data = await res.json();
      setMessage(data.message || "Order item inserted successfully");
    } catch (error) {
      setMessage("Error inserting order item");
    }
  };

  // Insert Category Type
  const handleInsertCatType = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/category-type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCatType)
      });
      const data = await res.json();
      setMessage(data.message || "Category type inserted successfully");
    } catch (error) {
      setMessage("Error inserting category type");
    }
  };

  // Insert Category Item
  const handleInsertCatItem = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/category-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCatItem)
      });
      const data = await res.json();
      setMessage(data.message || "Category item inserted successfully");
    } catch (error) {
      setMessage("Error inserting category item");
    }
  };

  return (
    <div>
      <button onClick={() => setView("menu")}>Back to Menu</button>
      <h2>Insert Operations</h2>
      {option === "" && (
        <div>
          <button onClick={() => setOption("user")}>Insert User</button>{" "}
          <button onClick={() => setOption("product")}>Insert Product</button>{" "}
          <button onClick={() => setOption("order")}>Insert Order</button>{" "}
          <button onClick={() => setOption("orderItem")}>Insert Order Item</button>{" "}
          <button onClick={() => setOption("catType")}>Insert Category Type</button>{" "}
          <button onClick={() => setOption("catItem")}>Insert Category Item</button>
        </div>
      )}
      {option === "user" && (
        <div>
          <h3>Insert User</h3>
          <input placeholder="Name" onChange={(e) => setNewUser({ ...newUser, Name: e.target.value })} />
          <input placeholder="Email" onChange={(e) => setNewUser({ ...newUser, Email: e.target.value })} />
          <input placeholder="Password" type="password" onChange={(e) => setNewUser({ ...newUser, Password: e.target.value })} />
          <input placeholder="Role" onChange={(e) => setNewUser({ ...newUser, Role: e.target.value })} />
          <button onClick={handleInsertUser}>Submit</button>
        </div>
      )}
      {option === "product" && (
        <div>
          <h3>Insert Product</h3>
          <input placeholder="Product Name" onChange={(e) => setNewProduct({ ...newProduct, ProductName: e.target.value })} />
          <input placeholder="Stock" type="number" onChange={(e) => setNewProduct({ ...newProduct, ProductStock: e.target.value })} />
          <input placeholder="Description" onChange={(e) => setNewProduct({ ...newProduct, ProductDescription: e.target.value })} />
          <input placeholder="Price" type="number" onChange={(e) => setNewProduct({ ...newProduct, ProductPrice: e.target.value })} />
          <input type="file" onChange={(e) => setProductFile(e.target.files[0])} />
          <form onSubmit={handleInsertProduct}>
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
      {option === "order" && (
        <div>
          <h3>Insert Order</h3>
          <input placeholder="User ID" onChange={(e) => setNewOrder({ UserID: e.target.value })} />
          <button onClick={handleInsertOrder}>Submit</button>
        </div>
      )}
      {option === "orderItem" && (
        <div>
          <h3>Insert Order Item</h3>
          <input placeholder="Order ID" onChange={(e) => setNewOrderItem({ ...newOrderItem, OrderID: e.target.value })} />
          <input placeholder="Product ID" onChange={(e) => setNewOrderItem({ ...newOrderItem, ProductID: e.target.value })} />
          <input placeholder="Number" type="number" onChange={(e) => setNewOrderItem({ ...newOrderItem, Number: e.target.value })} />
          <button onClick={handleInsertOrderItem}>Submit</button>
        </div>
      )}
      {option === "catType" && (
        <div>
          <h3>Insert Category Type</h3>
          <input placeholder="Type Name" onChange={(e) => setNewCatType({ TypeName: e.target.value })} />
          <button onClick={handleInsertCatType}>Submit</button>
        </div>
      )}
      {option === "catItem" && (
        <div>
          <h3>Insert Category Item</h3>
          <input placeholder="Product ID" onChange={(e) => setNewCatItem({ ...newCatItem, ProductID: e.target.value })} />
          <input placeholder="Type ID" onChange={(e) => setNewCatItem({ ...newCatItem, TypeID: e.target.value })} />
          <button onClick={handleInsertCatItem}>Submit</button>
        </div>
      )}
      {option && <button onClick={() => setOption("")}>Back to Insert Menu</button>}
      {message && <p>{message}</p>}
    </div>
  );
}

function GetView({ setView }) {
  const [option, setOption] = useState("");
  const [params, setParams] = useState({});
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");

  const handleFetch = async () => {
    let url = "http://localhost:3001";
    if (option === "allUsers") {
      url += "/api/users";
    } else if (option === "userByCred") {
      url += `/api/users/byCredentials?name=${params.name || ""}&password=${params.password || ""}`;
    } else if (option === "allProducts") {
      url += "/api/products";
    } else if (option === "productById") {
      url += `/api/products?productId=${params.productId || ""}`;
    } else if (option === "productByName") {
      url += `/api/products?name=${params.productName || ""}`;
    } else if (option === "allOrders") {
      url += "/api/orders";
    } else if (option === "orderItems") {
      url += `/api/order-items?orderId=${params.orderId || ""}`;
    } else if (option === "allCatTypes") {
      url += "/api/category-types";
    } else if (option === "catItems") {
      url += `/api/category-items?typeId=${params.typeId || ""}`;
    }
    try {
      const res = await fetch(url);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setMessage("Error fetching data");
    }
  };

  return (
    <div>
      <button onClick={() => setView("menu")}>Back to Menu</button>
      <h2>Get Operations</h2>
      {option === "" && (
        <div>
          <button onClick={() => setOption("allUsers")}>Get All Users</button>{" "}
          <button onClick={() => setOption("userByCred")}>Get User by Credentials</button>{" "}
          <button onClick={() => setOption("allProducts")}>Get All Products</button>{" "}
          <button onClick={() => setOption("productById")}>Get Product by ID</button>{" "}
          <button onClick={() => setOption("productByName")}>Get Product by Name</button>{" "}
          <button onClick={() => setOption("allOrders")}>Get All Orders</button>{" "}
          <button onClick={() => setOption("orderItems")}>Get Order Items by Order ID</button>{" "}
          <button onClick={() => setOption("allCatTypes")}>Get All Category Types</button>{" "}
          <button onClick={() => setOption("catItems")}>Get Category Items by Type ID</button>
        </div>
      )}
      {option === "userByCred" && (
        <div>
          <input placeholder="Name" onChange={(e) => setParams({ ...params, name: e.target.value })} />
          <input placeholder="Password" type="password" onChange={(e) => setParams({ ...params, password: e.target.value })} />
          <button onClick={handleFetch}>Fetch</button>
        </div>
      )}
      {(option === "productById" ||
        option === "productByName" ||
        option === "orderItems" ||
        option === "catItems") && (
        <div>
          <input
            placeholder={
              option === "productById"
                ? "Product ID"
                : option === "productByName"
                ? "Product Name"
                : option === "orderItems"
                ? "Order ID"
                : "Category Type ID"
            }
            onChange={(e) => {
              if (option === "productById") {
                setParams({ ...params, productId: e.target.value });
              } else if (option === "productByName") {
                setParams({ ...params, productName: e.target.value });
              } else if (option === "orderItems") {
                setParams({ ...params, orderId: e.target.value });
              } else if (option === "catItems") {
                setParams({ ...params, typeId: e.target.value });
              }
            }}
          />
          <button onClick={handleFetch}>Fetch</button>
        </div>
      )}
      {(["allUsers", "allProducts", "allOrders", "allCatTypes"].includes(option)) && (
        <div>
          <button onClick={handleFetch}>Fetch</button>
        </div>
      )}
      {result && (
        <div>
          <h3>Results</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
          {option === "allProducts" && Array.isArray(result) && (
            <div style={styles.productGrid}>
              {result.map((product) => (
                <div key={product.ProductID} style={styles.card}>
                  <h4>{product.ProductName}</h4>
                  {product.ProductImageURL ? (
                    <img
                      src={product.ProductImageURL}
                      alt={product.ProductName}
                      style={styles.image}
                    />
                  ) : (
                    <p>No Image</p>
                  )}
                  <p>ID: {product.ProductID}</p>
                  <p>Stock: {product.ProductStock}</p>
                  <p>Price: ${product.ProductPrice}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <button onClick={() => setOption("")}>Back to Get Menu</button>
      {message && <p>{message}</p>}
    </div>
  );
}

function UpdateView({ setView }) {
  const [option, setOption] = useState("");
  const [userUpdate, setUserUpdate] = useState({
    oldUserName: "",
    oldPassword: "",
    newName: "",
    newEmail: "",
    newPassword: ""
  });
  const [prodIdentifier, setProdIdentifier] = useState({ productId: "", name: "" });
  const [prodUpdate, setProdUpdate] = useState({
    ProductName: "",
    ProductStock: "",
    ProductDescription: "",
    ProductPrice: ""
  });
  const [prodImage, setProdImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpdateUser = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/users/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userUpdate)
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Error updating user");
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    let url = "http://localhost:3001/api/products/update";
    if (prodIdentifier.productId) {
      url += `?productId=${prodIdentifier.productId}`;
    } else if (prodIdentifier.name) {
      url += `?name=${prodIdentifier.name}`;
    } else {
      setMessage("Provide productId or name for identification");
      return;
    }
    const formData = new FormData();
    Object.keys(prodUpdate).forEach((key) => {
      formData.append(key, prodUpdate[key]);
    });
    if (prodImage) formData.append("ProductImage", prodImage);
    try {
      const res = await fetch(url, {
        method: "PUT",
        body: formData
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Error updating product");
    }
  };

  return (
    <div>
      <button onClick={() => setView("menu")}>Back to Menu</button>
      <h2>Update Operations</h2>
      {option === "" && (
        <div>
          <button onClick={() => setOption("user")}>Update User</button>{" "}
          <button onClick={() => setOption("product")}>Update Product</button>
        </div>
      )}
      {option === "user" && (
        <div>
          <h3>Update User</h3>
          <input placeholder="Old Username" onChange={(e) => setUserUpdate({ ...userUpdate, oldUserName: e.target.value })} />
          <input placeholder="Old Password" type="password" onChange={(e) => setUserUpdate({ ...userUpdate, oldPassword: e.target.value })} />
          <input placeholder="New Name" onChange={(e) => setUserUpdate({ ...userUpdate, newName: e.target.value })} />
          <input placeholder="New Email" onChange={(e) => setUserUpdate({ ...userUpdate, newEmail: e.target.value })} />
          <input placeholder="New Password" type="password" onChange={(e) => setUserUpdate({ ...userUpdate, newPassword: e.target.value })} />
          <button onClick={handleUpdateUser}>Submit Update</button>
        </div>
      )}
      {option === "product" && (
        <div>
          <h3>Update Product</h3>
          <p>Identify product by:</p>
          <input placeholder="Product ID" onChange={(e) => setProdIdentifier({ ...prodIdentifier, productId: e.target.value })} />
          <p>OR</p>
          <input placeholder="Product Name" onChange={(e) => setProdIdentifier({ ...prodIdentifier, name: e.target.value })} />
          <p>Update fields (leave blank for no change):</p>
          <input placeholder="New Product Name" onChange={(e) => setProdUpdate({ ...prodUpdate, ProductName: e.target.value })} />
          <input placeholder="New Stock" type="number" onChange={(e) => setProdUpdate({ ...prodUpdate, ProductStock: e.target.value })} />
          <input placeholder="New Description" onChange={(e) => setProdUpdate({ ...prodUpdate, ProductDescription: e.target.value })} />
          <input placeholder="New Price" type="number" onChange={(e) => setProdUpdate({ ...prodUpdate, ProductPrice: e.target.value })} />
          <input type="file" onChange={(e) => setProdImage(e.target.files[0])} />
          <form onSubmit={handleUpdateProduct}>
            <button type="submit">Submit Update</button>
          </form>
        </div>
      )}
      <button onClick={() => setOption("")}>Back to Update Menu</button>
      {message && <p>{message}</p>}
    </div>
  );
}

function DeleteView({ setView }) {
  const [option, setOption] = useState("");
  const [delData, setDelData] = useState({ id: "", name: "", password: "" });
  const [message, setMessage] = useState("");

  const handleDeleteById = async () => {
    if (!delData.id) {
      setMessage("ID is required");
      return;
    }
    let url = "";
    if (option === "deleteUserById") {
      url = `http://localhost:3001/api/users/${delData.id}`;
    } else if (option === "deleteProduct") {
      url = `http://localhost:3001/api/products/${delData.id}`;
    } else if (option === "deleteCatType") {
      url = `http://localhost:3001/api/category-types/${delData.id}`;
    } else if (option === "deleteOrder") {
      url = `http://localhost:3001/api/orders/${delData.id}`;
    }
    try {
      const res = await fetch(url, { method: "DELETE" });
      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Error deleting");
    }
  };

  const handleDeleteByCred = async () => {
    if (!delData.name || !delData.password) {
      setMessage("Both name and password are required");
      return;
    }
    const url = `http://localhost:3001/api/users/byCredentials?name=${delData.name}&password=${delData.password}`;
    try {
      const res = await fetch(url, { method: "DELETE" });
      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Error deleting by credentials");
    }
  };

  return (
    <div>
      <button onClick={() => setView("menu")}>Back to Menu</button>
      <h2>Delete Operations</h2>
      {option === "" && (
        <div>
          <button onClick={() => setOption("deleteUserById")}>Delete User by ID</button>{" "}
          <button onClick={() => setOption("deleteUserByCred")}>Delete User by Credentials</button>{" "}
          <button onClick={() => setOption("deleteProduct")}>Delete Product by ID</button>{" "}
          <button onClick={() => setOption("deleteCatType")}>Delete Category Type by ID</button>{" "}
          <button onClick={() => setOption("deleteOrder")}>Delete Order by ID</button>
        </div>
      )}
      {option === "deleteUserById" && (
        <div>
          <input placeholder="User ID" onChange={(e) => setDelData({ ...delData, id: e.target.value })} />
          <button onClick={handleDeleteById}>Delete User by ID</button>
        </div>
      )}
      {option === "deleteUserByCred" && (
        <div>
          <input placeholder="Name" onChange={(e) => setDelData({ ...delData, name: e.target.value })} />
          <input placeholder="Password" type="password" onChange={(e) => setDelData({ ...delData, password: e.target.value })} />
          <button onClick={handleDeleteByCred}>Delete User by Credentials</button>
        </div>
      )}
      {option === "deleteProduct" && (
        <div>
          <input placeholder="Product ID" onChange={(e) => setDelData({ ...delData, id: e.target.value })} />
          <button onClick={handleDeleteById}>Delete Product</button>
        </div>
      )}
      {option === "deleteCatType" && (
        <div>
          <input placeholder="Category Type ID" onChange={(e) => setDelData({ ...delData, id: e.target.value })} />
          <button onClick={handleDeleteById}>Delete Category Type</button>
        </div>
      )}
      {option === "deleteOrder" && (
        <div>
          <input placeholder="Order ID" onChange={(e) => setDelData({ ...delData, id: e.target.value })} />
          <button onClick={handleDeleteById}>Delete Order</button>
        </div>
      )}
      <button onClick={() => setOption("")}>Back to Delete Menu</button>
      {message && <p>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif"
  },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "10px",
    marginTop: "20px"
  },
  card: {
    border: "1px solid #ccc",
    padding: "10px",
    textAlign: "center"
  },
  image: {
    maxWidth: "100%",
    height: "auto"
  }
};

export default App;

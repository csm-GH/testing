// App.js
import React, { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch product list from the backend on component mount
  useEffect(() => {
    fetch("http://localhost:3001/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={styles.container}><p>Loading products...</p></div>;
  }

  if (error) {
    return <div style={styles.container}><p style={styles.error}>Error: {error}</p></div>;
  }

  return (
    <div style={styles.container}>
      <h1>Product List</h1>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div style={styles.productGrid}>
          {products.map((product) => (
            <div key={product.ProductID} style={styles.card}>
              <h3>{product.ProductName || "Unnamed Product"}</h3>
              {product.ProductImageURL ? (
                <img
                  src={product.ProductImageURL}
                  alt={product.ProductName}
                  style={styles.image}
                />
              ) : (
                <p>No image available</p>
              )}
              <p>
                <strong>ID:</strong> {product.ProductID}
              </p>
              <p>
                <strong>Stock:</strong> {product.ProductStock}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {product.ProductDescription || "No description"}
              </p>
              <p>
                <strong>Price:</strong> ${product.ProductPrice}
              </p>
            </div>
          ))}
        </div>
      )}
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
    gap: "20px",
    marginTop: "20px"
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "15px",
    textAlign: "center"
  },
  image: {
    maxWidth: "100%",
    height: "auto",
    marginBottom: "10px"
  },
  error: {
    color: "red"
  }
};

export default App;
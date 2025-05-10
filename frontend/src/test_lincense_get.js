// App.js
import React, { useState } from "react";

function App() {
  const [licenses, setLicenses] = useState([]);
  const [error, setError] = useState("");

  const fetchLicenses = async () => {
    setError("");      // Clear any previous error
    setLicenses([]);   // Clear previous results
    try {
      const response = await fetch("http://localhost:3001/api/licenses");
      if (!response.ok) {
        throw new Error("Failed to fetch licenses.");
      }
      const data = await response.json();
      setLicenses(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h1>All Licenses</h1>
      <button onClick={fetchLicenses} style={styles.button}>
        Fetch Licenses
      </button>
      {error && <p style={styles.error}>Error: {error}</p>}
      {licenses.length > 0 && (
        <ul style={styles.list}>
          {licenses.map((licenseObj, index) => (
            <li key={index}>
              {licenseObj.LicenseCode}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    marginTop: "20px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
  list: {
    listStyleType: "none",
    marginTop: "20px",
    padding: "0",
  },
};

export default App;
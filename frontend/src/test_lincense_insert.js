import React, { useState } from "react";

function App() {
  const [license, setLicense] = useState("");
  const [message, setMessage] = useState("");

  const handleInsertLicense = async (e) => {
    e.preventDefault();

    // Trim the input to remove accidental trailing or leading white spaces.
    const trimmedLicense = license.trim();
    if (trimmedLicense.length !== 20) {
      setMessage("License must be exactly 20 characters long.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/license", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ license: trimmedLicense }),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage("Error: " + (data.error || "Failed to insert license"));
      } else {
        setMessage("License inserted successfully! License: " + data.license);
      }
    } catch (error) {
      setMessage("Fetch error: " + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Test Insert License</h1>
      <form onSubmit={handleInsertLicense}>
        <label htmlFor="licenseInput">Enter a 20-character license:</label>
        <br />
        <input
          id="licenseInput"
          type="text"
          value={license}
          onChange={(e) => setLicense(e.target.value)}
          maxLength={20}
          placeholder="e.g., ABCDEFGHIJKLMNOPQRST"
          style={styles.input}
        />
        <br />
        <button type="submit" style={styles.button}>
          Insert License
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    marginTop: "50px",
  },
  input: {
    width: "300px",
    padding: "8px",
    fontSize: "16px",
    marginTop: "10px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    marginTop: "15px",
    cursor: "pointer",
  },
  message: {
    marginTop: "20px",
    fontSize: "18px",
    color: "#d00",
  },
};

export default App;
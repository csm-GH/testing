import React, { useState } from 'react';

function App() {
  // Local state for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(0); // 0 for regular user, 1 for admin (for example)
  const [message, setMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Build a payload that matches the backend's expected keys
    const payload = {
      Name: name,
      Email: email,
      Password: password,
      Role: role
    };

    try {
      // Send a POST request to your backend API for inserting a new user
      const response = await fetch('http://localhost:3001/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (response.ok) {
        setMessage(`User inserted successfully with ID: ${data.userId}`);
      } else {
        setMessage(`Error: ${data.error || 'Unknown error occurred'}`);
      }
    } catch (error) {
      console.error('Error inserting user:', error);
      setMessage('Error inserting user.');
    }
  };

  return (
    <div className="App">
      <h1>Create New User</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input 
            id="name" 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input 
            id="email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input 
            id="password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label htmlFor="role">Role (0 for user, 1 for admin):</label>
          <input 
            id="role" 
            type="number" 
            value={role} 
            onChange={(e) => setRole(Number(e.target.value))} 
            required 
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;

import React, { useState } from 'react';

function UpdateUserInfo() {
  // State for update name
  const [userIDForName, setUserIDForName] = useState('');
  const [newName, setNewName] = useState('');
  
  // State for update email
  const [userIDForEmail, setUserIDForEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  
  // State for update password
  const [userIDForPassword, setUserIDForPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [message, setMessage] = useState('');

  // Generic method for making PUT requests
  const makeUpdate = async (url, payload) => {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (response.ok) {
        setMessage(result.message);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error updating information:', error);
      setMessage('Error updating information.');
    }
  };

  const handleNameUpdate = (e) => {
    e.preventDefault();
    // Payload includes the userID and the new name
    const payload = { userID: Number(userIDForName), newName };
    makeUpdate('http://localhost:3001/api/users/update-name', payload);
  };

  const handleEmailUpdate = (e) => {
    e.preventDefault();
    const payload = { userID: Number(userIDForEmail), newEmail };
    makeUpdate('http://localhost:3001/api/users/update-email', payload);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    const payload = { userID: Number(userIDForPassword), newPassword };
    makeUpdate('http://localhost:3001/api/users/update-password', payload);
  };

  return (
    <div>
      <h2>Update User Information</h2>
      
      <hr />
      <form onSubmit={handleNameUpdate}>
        <h3>Update Username</h3>
        <label>User ID:</label>
        <input 
          type="number" 
          value={userIDForName}
          onChange={(e) => setUserIDForName(e.target.value)}
          required
        />
        <br />
        <label>New Username:</label>
        <input 
          type="text" 
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
        />
        <br />
        <button type="submit">Update Username</button>
      </form>
      
      <hr />
      <form onSubmit={handleEmailUpdate}>
        <h3>Update Email</h3>
        <label>User ID:</label>
        <input 
          type="number"
          value={userIDForEmail}
          onChange={(e) => setUserIDForEmail(e.target.value)}
          required
        />
        <br />
        <label>New Email:</label>
        <input 
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          required
        />
        <br />
        <button type="submit">Update Email</button>
      </form>
      
      <hr />
      <form onSubmit={handlePasswordUpdate}>
        <h3>Update Password</h3>
        <label>User ID:</label>
        <input 
          type="number"
          value={userIDForPassword}
          onChange={(e) => setUserIDForPassword(e.target.value)}
          required
        />
        <br />
        <label>New Password:</label>
        <input 
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Update Password</button>
      </form>
      
      {message && <p>{message}</p>}
    </div>
  );
}

export default UpdateUserInfo;
import React from 'react';

function TestAPI() {
  // Function to call the 'init' action on the backend
  const handleInit = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'init' })
      });
      const data = await response.json();
      console.log('Init response:', data);
      alert('Init response: ' + JSON.stringify(data));
    } catch (error) {
      console.error('Error during init:', error);
      alert('Error during init: ' + error.message);
    }
  };

  // Function to call the 'create user' action on the backend
  const handleCreateUser = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create user',
          Name: 'John Doe',
          Email: 'john.doe@example.com',
          Password: 'securepassword', // Note: In a real app, hash passwords before sending!
          Role: 0
        })
      });
      const data = await response.json();
      console.log('Create user response:', data);
      alert('Create user response: ' + JSON.stringify(data));
    } catch (error) {
      console.error('Error during create user:', error);
      alert('Error during create user: ' + error.message);
    }
  };

  return (
    <div>
      <h1>Test API Integration</h1>
      <button onClick={handleInit}>Test Init Command</button>
      <button onClick={handleCreateUser}>Test Create User</button>
    </div>
  );
}

export default TestAPI;
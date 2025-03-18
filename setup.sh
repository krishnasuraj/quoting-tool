#!/bin/bash

# Make the script executable
chmod +x setup.sh

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

# Create frontend .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "Creating frontend .env file..."
  echo "REACT_APP_API_URL=http://localhost:3001" > .env
  echo "Frontend .env file created."
else
  echo "Frontend .env file already exists."
fi

# Install backend dependencies
echo "Installing backend dependencies..."
cd server
npm install

# Create backend .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "Creating backend .env file..."
  echo "# Salesforce API Credentials - REPLACE THESE VALUES" > .env
  echo "SF_CONSUMER_KEY=your_consumer_key" >> .env
  echo "SF_CONSUMER_SECRET=your_consumer_secret" >> .env
  echo "SF_USERNAME=your_salesforce_username" >> .env
  echo "SF_PASSWORD=your_salesforce_password" >> .env
  echo "SF_SECURITY_TOKEN=your_salesforce_security_token" >> .env
  echo "PORT=3001" >> .env
  echo "Backend .env file created. Please update with your Salesforce credentials."
else
  echo "Backend .env file already exists."
fi

echo "Setup complete! Now you need to:"
echo "1. Update the server/.env file with your Salesforce credentials"
echo "2. Start the backend server: cd server && npm start"
echo "3. In a new terminal, start the frontend: npm start"

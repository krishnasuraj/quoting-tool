# Codeium Product Quoting Tool

A web-based application for generating price quotes for Codeium products. Users can create customized quotes for Codeium licenses, download them as PDFs, and request to be contacted by a sales representative.

## Technologies Used

- React.js for the frontend
- Bootstrap for responsive design
- React Router for navigation
- jsPDF for PDF generation
- Salesforce API integration for Opportunity creation

## Features

- Interactive quote generation
- License recommendation based on team size and needs
- PDF quote download
- Salesforce Opportunity creation for sales follow-up

## Salesforce Integration

This application includes a backend server for secure Salesforce integration. The backend handles API authentication and quote creation in Salesforce.

### Backend Server Setup

1. Navigate to the server directory: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file in the server directory with your Salesforce credentials:

```
SF_CONSUMER_KEY=your_consumer_key
SF_CONSUMER_SECRET=your_consumer_secret
SF_USERNAME=your_salesforce_username
SF_PASSWORD=your_salesforce_password
SF_SECURITY_TOKEN=your_salesforce_security_token
PORT=3001
```

4. Start the server: `npm start` or `npm run dev` for development mode with auto-restart

### Frontend Environment Setup

Create a `.env` file in the root directory with the following variable to connect to the backend server:

```
REACT_APP_API_URL=http://localhost:3001
```

For production deployment, set this to your actual backend server URL.

**Note:** Never commit the `.env` files to version control. They're already added to `.gitignore`.

## Getting Started

### Frontend
1. Install dependencies: `npm install`
2. Set up the frontend environment variables as described above
3. Start the development server: `npm start`
4. The frontend application will be available at http://localhost:3000

### Backend
1. Navigate to the server directory: `cd server`
2. Install dependencies: `npm install`
3. Set up the backend environment variables as described above
4. Start the backend server: `npm start`
5. The backend server will be available at http://localhost:3001

**Important:** Both the frontend and backend servers must be running for the Salesforce integration to work.

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
const jsforce = require('jsforce'); // Using jsforce library for more reliable Salesforce integration

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../build')));

// Salesforce API version
const SF_API_VERSION = '56.0';

// Create a connection to Salesforce using jsforce
async function getSalesforceConnection() {
  try {
    console.log('Connecting to Salesforce with jsforce...');
    console.log('Using credentials:');
    console.log('- Username:', process.env.SF_USERNAME || 'not set');
    console.log('- Password length:', process.env.SF_PASSWORD?.length || 'not set');
    console.log('- Security Token length:', process.env.SF_SECURITY_TOKEN?.length || 'not set');
    
    // Create connection
    const conn = new jsforce.Connection({
      // Optional: specify login URL if using sandbox
      // loginUrl: 'https://test.salesforce.com'
      version: SF_API_VERSION
    });
    
    // Login with username, password, and security token
    await conn.login(
      process.env.SF_USERNAME, 
      process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN
    );
    
    console.log('Successfully connected to Salesforce!');
    console.log('Connected as:', conn.userInfo.username);
    console.log('Instance URL:', conn.instanceUrl);
    
    return conn;
  } catch (error) {
    console.error('Error connecting to Salesforce:', error.message);
    if (error.errorCode) {
      console.error('Error code:', error.errorCode);
      console.error('Error details:', error.message);
    }
    throw error;
  }
}

// API endpoint to create a quote in Salesforce
app.post('/api/quotes', async (req, res) => {
  try {
    const { quoteData, email } = req.body;
    
    if (!quoteData || !email) {
      return res.status(400).json({ error: 'Missing required data' });
    }
    
    console.log('Creating quote in Salesforce for:', email);
    console.log('Quote data:', JSON.stringify(quoteData, null, 2));
    
    // Get Salesforce connection
    const conn = await getSalesforceConnection();
    
    // Let's first check what objects are available in Salesforce
    try {
      console.log('Checking available Salesforce objects...');
      const describeGlobal = await conn.describeGlobal();
      console.log('Available objects:', describeGlobal.sobjects.map(obj => obj.name).join(', '));
    } catch (describeError) {
      console.error('Error checking Salesforce objects:', describeError.message);
    }
    
    // Create a detailed description of the quote
    const quoteDescription = [
      `QUOTE DETAILS:`,
      `---------------------------`,
      `Contact Email: ${email}`,
      `Company: ${quoteData.companyName || 'Unknown Company'}`,
      `Quote ID: ${quoteData.quoteId || `QT-${Date.now()}`}`,
      `Quote Date: ${quoteData.quoteDate || new Date().toISOString().split('T')[0]}`,
      `Expiry Date: ${quoteData.expiryDate || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]}`,
      `---------------------------`,
      `LICENSE DETAILS:`,
      `Cascade Licenses: ${quoteData.cascadeLicenses || 0}`,
      `Enterprise Licenses: ${quoteData.enterpriseLicenses || 0}`,
      `---------------------------`,
      `Total Cost: $${(quoteData.totalCost || 0).toLocaleString()}`,
      `---------------------------`,
      `Generated on: ${new Date().toLocaleString()}`
    ].join('\n');
    
    // Format the data for an Opportunity object (standard Salesforce object)
    const opportunityData = {
      Name: `Quote for ${quoteData.companyName || 'Unknown Company'}`,
      Description: quoteDescription,
      StageName: 'Prospecting', // Standard field for Opportunity
      CloseDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0], // Format as YYYY-MM-DD
      Amount: quoteData.totalCost || 0,
      
      // Add email to the description as well as these potential standard fields
      // that might exist in your Salesforce instance
      NextStep: `Contact customer at: ${email}`,
      LeadSource: 'Web Quote Tool',
      Type: 'New Customer',
      
      // Attempt to use common custom fields that might exist
      Email__c: email,
      Customer_Email__c: email,
      Contact_Email__c: email
    };
    
    // Try to clean up the opportunityData by removing undefined fields
    // This prevents errors if the fields don't exist in Salesforce
    Object.keys(opportunityData).forEach(key => {
      if (key.includes('__c')) {
        // We'll try to create with custom fields, but be prepared for them to fail
        console.log(`Note: Attempting to use custom field ${key} which may not exist in your Salesforce org`);
      }
    });
    
    console.log('Formatted Opportunity data:', JSON.stringify(opportunityData, null, 2));
    
    // Create the Opportunity in Salesforce using jsforce
    console.log('Creating Opportunity in Salesforce...');
    let result;
    
    try {
      // First attempt with all fields including custom fields
      result = await conn.sobject('Opportunity').create(opportunityData);
      console.log('Salesforce create result:', result);
    } catch (fieldError) {
      // If we get a field error, try with only standard fields
      if (fieldError.name === 'INVALID_FIELD') {
        console.log('Field error detected. Trying with standard fields only...');
        
        // Create a version with only standard Salesforce Opportunity fields
        const standardOpportunityData = {
          Name: opportunityData.Name,
          Description: `${opportunityData.Description}\n\nCONTACT EMAIL: ${email}`, // Add email to description
          StageName: opportunityData.StageName,
          CloseDate: opportunityData.CloseDate,
          Amount: opportunityData.Amount,
          NextStep: opportunityData.NextStep,
          LeadSource: opportunityData.LeadSource,
          Type: opportunityData.Type
        };
        
        // Try again with only standard fields
        result = await conn.sobject('Opportunity').create(standardOpportunityData);
        console.log('Salesforce create result (standard fields only):', result);
      } else {
        // If it's not a field error, rethrow
        throw fieldError;
      }
    }
    
    if (result.success) {
      res.json({
        success: true,
        id: result.id,
        message: 'Quote created successfully in Salesforce'
      });
    } else {
      throw new Error('Failed to create quote in Salesforce');
    }
  } catch (error) {
    console.error('Error creating Salesforce Opportunity:', error.message);
    
    // Enhanced error diagnostics
    if (error.errorCode) {
      console.error('Salesforce Error Code:', error.errorCode);
    }
    
    if (error.name === 'INVALID_FIELD') {
      console.error('Invalid field error. Check if all fields exist in your Salesforce org.');
    }
    
    if (error.name === 'REQUIRED_FIELD_MISSING') {
      console.error('Required field missing. Check if all required fields are provided.');
    }
    
    // Try to describe the Opportunity object to see available fields
    try {
      const conn = await getSalesforceConnection();
      const opportunityDesc = await conn.describe('Opportunity');
      console.log('Opportunity fields:', opportunityDesc.fields.map(f => `${f.name} (${f.type}, Required: ${f.nillable ? 'No' : 'Yes'})`).join('\n'));
    } catch (descError) {
      console.error('Error describing Opportunity object:', descError.message);
    }
    
    res.status(500).json({ 
      error: 'Failed to create opportunity in Salesforce',
      details: error.message
    });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

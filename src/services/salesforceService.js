/**
 * Salesforce API Service
 * Handles communication with the backend server for Salesforce Opportunity creation
 */

// API endpoint URL - adjust based on your deployment
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

/**
 * Create an Opportunity object in Salesforce via the backend API
 * @param {Object} quoteData - Quote data to create in Salesforce as an Opportunity
 * @param {string} email - Customer email
 * @returns {Promise<Object>} Created Opportunity object
 */
export const createSalesforceQuote = async (quoteData, email) => {
  try {
    console.log('Sending quote data to backend API for Salesforce Opportunity creation');
    
    const response = await fetch(`${API_URL}/api/quotes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quoteData, email })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create Salesforce Opportunity: ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating Salesforce Opportunity:', error);
    throw error;
  }
};

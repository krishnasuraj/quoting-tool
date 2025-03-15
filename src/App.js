import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import QuoteForm from './components/QuoteForm';
import QuoteDetails from './components/QuoteDetails';

function App() {
  const [quoteData, setQuoteData] = useState({
    companyName: '',
    licenseMethod: 'manual', // 'manual' or 'estimate'
    enterpriseLicenses: 0,
    cascadeLicenses: 0,
    teamSize: 0,
    aiFeaturePercentage: 50,
    complexDesignFrequency: 50,
    newFeaturesPercentage: 50,
    quoteId: '',
    quoteDate: '',
    expiryDate: '',
    totalCost: 0
  });

  const updateQuoteData = (data) => {
    setQuoteData({...quoteData, ...data});
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <QuoteForm 
              quoteData={quoteData} 
              updateQuoteData={updateQuoteData} 
            />
          } />
          <Route path="/quote" element={
            <QuoteDetails 
              quoteData={quoteData} 
              updateQuoteData={updateQuoteData} 
            />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Header from './components/Header';
import LandingPage from './components/LandingPage';
import QuoteForm from './components/QuoteForm';
import QuoteReview from './components/QuoteReview';

function App() {
  const [quoteData, setQuoteData] = useState({
    companyName: '',
    teamSize: '',
    enterpriseLicenses: 0,
    cascadeLicenses: 0,
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
      <div className="App d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route 
              path="/quote-form" 
              element={<QuoteForm quoteData={quoteData} updateQuoteData={updateQuoteData} />} 
            />
            <Route 
              path="/quote" 
              element={<QuoteReview quoteData={quoteData} updateQuoteData={updateQuoteData} />} 
            />
            {/* Redirect old route to new route */}
            <Route path="/quote-review" element={<Navigate to="/quote" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Row, Col } from 'react-bootstrap';
import ContactForm from './ContactForm';
import { jsPDF } from 'jspdf';

const QuoteDetails = ({ quoteData, updateQuoteData }) => {
  const navigate = useNavigate();
  const quoteRef = useRef(null);
  const [showContactForm, setShowContactForm] = useState(false);

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add Codeium header text
    doc.setFontSize(20);
    doc.setTextColor(10, 183, 162);
    doc.text("Codeium", 20, 25);
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Product Quote", 20, 40);
    
    // Add quote details
    doc.setFontSize(12);
    doc.text(`Quote #: ${quoteData.quoteId}`, 20, 55);
    doc.text(`Date: ${quoteData.quoteDate}`, 20, 62);
    doc.text(`Valid Until: ${quoteData.expiryDate}`, 20, 69);
    
    // Add company info
    doc.text(`Prepared for: ${quoteData.companyName}`, 20, 80);
    
    // Add license details
    doc.setFontSize(14);
    doc.text("License Details", 20, 95);
    doc.setFontSize(12);
    
    let y = 105;
    
    if (quoteData.cascadeLicenses > 0) {
      doc.text(`Cascade Licenses: ${quoteData.cascadeLicenses.toLocaleString()} × $2,000`, 20, y);
      doc.text(`$${(quoteData.cascadeLicenses * 2000).toLocaleString()}`, 170, y, { align: 'right' });
      y += 7;
    }
    
    if (quoteData.enterpriseLicenses > 0) {
      doc.text(`Enterprise Licenses: ${quoteData.enterpriseLicenses.toLocaleString()} × $1,000`, 20, y);
      doc.text(`$${(quoteData.enterpriseLicenses * 1000).toLocaleString()}`, 170, y, { align: 'right' });
      y += 7;
    }
    
    doc.text(`Implementation Fee:`, 20, y);
    doc.text(`$0.00`, 170, y, { align: 'right' });
    y += 10;
    
    // Add total
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
    y += 10;
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`Total Annual Cost:`, 20, y);
    doc.text(`$${quoteData.totalCost.toLocaleString()}`, 170, y, { align: 'right' });
    
    // Add footer
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text("For questions, please contact sales@codeium.com", 20, 270);
    
    // Save the PDF
    doc.save(`Codeium_Quote_${quoteData.quoteId}.pdf`);
  };

  const handleEditQuote = () => {
    navigate('/');
  };

  const handleNewQuote = () => {
    // Reset the form data
    updateQuoteData({
      companyName: '',
      licenseMethod: 'manual',
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
    navigate('/');
  };

  return (
    <Container className="py-5">
      <div className="quote-details" ref={quoteRef}>
        <div className="quote-header">
          <h2>Your Codeium Quote</h2>
          <p className="text-muted">Quote #{quoteData.quoteId} | Generated on {quoteData.quoteDate} | Valid until {quoteData.expiryDate}</p>
        </div>
        
        <div className="quote-body">
          <h4>Prepared for {quoteData.companyName}</h4>
          
          <div className="quote-section mt-4">
            <h5>License Details</h5>
            
            {quoteData.cascadeLicenses > 0 && (
              <div className="quote-line-item">
                <span>Cascade Licenses: {quoteData.cascadeLicenses.toLocaleString()} × $2,000</span>
                <span>${(quoteData.cascadeLicenses * 2000).toLocaleString()}</span>
              </div>
            )}
            
            {quoteData.enterpriseLicenses > 0 && (
              <div className="quote-line-item">
                <span>Enterprise Licenses: {quoteData.enterpriseLicenses.toLocaleString()} × $1,000</span>
                <span>${(quoteData.enterpriseLicenses * 1000).toLocaleString()}</span>
              </div>
            )}
            
            <div className="quote-line-item">
              <span>Implementation Fee</span>
              <span>$0.00</span>
            </div>
            
            <div className="quote-total">
              <span>Total Annual Cost </span>
              <span>${quoteData.totalCost.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="action-buttons">
        <Button variant="outline-light" onClick={handleEditQuote}>
          Edit Quote
        </Button>
        <Button variant="primary" onClick={generatePDF} style={{ backgroundColor: '#0AB7A2', borderColor: '#0AB7A2' }}>
          Download Quote
        </Button>
        <Button variant="outline-primary" onClick={handleNewQuote} style={{ borderColor: '#0AB7A2', color: '#0AB7A2' }}>
          Generate New Quote
        </Button>
        <Button 
          variant="outline-primary" 
          onClick={() => setShowContactForm(true)} 
          style={{ borderColor: '#0AB7A2', color: '#0AB7A2' }}
        >
          I want to be contacted
        </Button>
      </div>
      
      {/* Contact Form Modal */}
      <ContactForm 
        show={showContactForm} 
        onHide={() => setShowContactForm(false)} 
        quoteData={quoteData} 
      />
    </Container>
  );
};

export default QuoteDetails;

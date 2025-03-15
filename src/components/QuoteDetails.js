import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { jsPDF } from 'jspdf';

const QuoteDetails = ({ quoteData, updateQuoteData }) => {
  const navigate = useNavigate();
  const quoteRef = useRef(null);

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add Codeium logo/header
    doc.setFontSize(20);
    doc.setTextColor(13, 202, 240);
    doc.text("Codeium", 20, 20);
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Product Quote", 20, 30);
    
    // Add quote details
    doc.setFontSize(12);
    doc.text(`Quote #: ${quoteData.quoteId}`, 20, 45);
    doc.text(`Date: ${quoteData.quoteDate}`, 20, 52);
    doc.text(`Valid Until: ${quoteData.expiryDate}`, 20, 59);
    
    // Add company info
    doc.text(`Prepared for: ${quoteData.companyName}`, 20, 70);
    
    // Add license details
    doc.setFontSize(14);
    doc.text("License Details", 20, 85);
    doc.setFontSize(12);
    
    let y = 95;
    
    if (quoteData.cascadeLicenses > 0) {
      doc.text(`Cascade Licenses: ${quoteData.cascadeLicenses} × $2,000`, 20, y);
      doc.text(`$${quoteData.cascadeLicenses * 2000}`, 170, y, { align: 'right' });
      y += 7;
    }
    
    if (quoteData.enterpriseLicenses > 0) {
      doc.text(`Enterprise Licenses: ${quoteData.enterpriseLicenses} × $1,000`, 20, y);
      doc.text(`$${quoteData.enterpriseLicenses * 1000}`, 170, y, { align: 'right' });
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
    doc.text(`$${quoteData.totalCost}`, 170, y, { align: 'right' });
    
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
                <span>Cascade Licenses: {quoteData.cascadeLicenses} × $2,000</span>
                <span>${quoteData.cascadeLicenses * 2000}</span>
              </div>
            )}
            
            {quoteData.enterpriseLicenses > 0 && (
              <div className="quote-line-item">
                <span>Enterprise Licenses: {quoteData.enterpriseLicenses} × $1,000</span>
                <span>${quoteData.enterpriseLicenses * 1000}</span>
              </div>
            )}
            
            <div className="quote-line-item">
              <span>Implementation Fee</span>
              <span>$0.00</span>
            </div>
            
            <div className="quote-total">
              <span>Total Annual Cost</span>
              <span>${quoteData.totalCost}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="action-buttons">
        <Button variant="outline-light" onClick={handleEditQuote}>
          Edit Quote
        </Button>
        <Button variant="info" onClick={generatePDF}>
          Download Quote
        </Button>
        <Button variant="outline-info" onClick={handleNewQuote}>
          Generate New Quote
        </Button>
      </div>
    </Container>
  );
};

export default QuoteDetails;

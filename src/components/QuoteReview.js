import React, { useRef, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const QuoteReview = ({ quoteData, updateQuoteData }) => {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedData, setEditedData] = useState({
    companyName: quoteData.companyName,
    enterpriseLicenses: quoteData.enterpriseLicenses,
    cascadeLicenses: quoteData.cascadeLicenses
  });
  
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedData({
      ...editedData,
      [name]: value
    });
  };
  
  const handleEditSubmit = () => {
    const totalCost = 
      parseInt(editedData.enterpriseLicenses) * 1000 + 
      parseInt(editedData.cascadeLicenses) * 2000;
    
    const updatedQuoteData = {
      ...quoteData,
      companyName: editedData.companyName,
      enterpriseLicenses: editedData.enterpriseLicenses,
      cascadeLicenses: editedData.cascadeLicenses,
      teamSize: (parseInt(editedData.enterpriseLicenses) + parseInt(editedData.cascadeLicenses)).toString(),
      totalCost: totalCost
    };
    
    updateQuoteData(updatedQuoteData);
    setShowEditModal(false);
  };
  
  const startNewQuote = () => {
    navigate('/quote-form');
  };
  const quoteRef = useRef(null);

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Add Codeium branding
    doc.setFontSize(24);
    doc.setTextColor(0, 123, 255);
    doc.text('Codeium', 20, 20);
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Product Quote', 20, 30);

    // Add horizontal line
    doc.setDrawColor(0, 123, 255);
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    // Quote reference and dates
    doc.setFontSize(10);
    doc.text(`Quote Reference: ${quoteData.quoteId}`, 20, 45);
    doc.text(`Date: ${quoteData.quoteDate}`, 20, 52);
    doc.text(`Valid Until: ${quoteData.expiryDate}`, 20, 59);

    // Company information
    doc.setFontSize(12);
    doc.text('Prepared for:', 20, 70);
    doc.setFontSize(11);
    doc.text(`${quoteData.companyName}`, 20, 77);
    doc.text(`Development Team Size: ${quoteData.teamSize}`, 20, 84);

    // Quote details
    doc.setFontSize(12);
    doc.text('Quote Details:', 20, 100);
    
    // Table headers
    doc.setFontSize(10);
    doc.text('Item', 20, 110);
    doc.text('Quantity', 100, 110);
    doc.text('Unit Price', 130, 110);
    doc.text('Amount', 170, 110);
    
    // Line
    doc.line(20, 113, 190, 113);
    
    // Enterprise licenses
    let y = 120;
    doc.text('Enterprise License (Annual)', 20, y);
    doc.text(`${quoteData.enterpriseLicenses}`, 100, y);
    doc.text('$1,000', 130, y);
    doc.text(`$${quoteData.enterpriseLicenses * 1000}`, 170, y);
    
    // Cascade licenses
    y += 10;
    doc.text('Cascade License (Annual)', 20, y);
    doc.text(`${quoteData.cascadeLicenses}`, 100, y);
    doc.text('$2,000', 130, y);
    doc.text(`$${quoteData.cascadeLicenses * 2000}`, 170, y);
    
    // Implementation fee
    y += 10;
    doc.text('Implementation Fee', 20, y);
    doc.text('1', 100, y);
    doc.text('$0.00', 130, y);
    doc.text('$0.00', 170, y);
    
    // Line
    y += 5;
    doc.line(20, y, 190, y);
    
    // Total
    y += 10;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Total Annual Cost:', 100, y);
    doc.text(`$${quoteData.totalCost}`, 170, y);
    
    // No footer needed

    // Save the PDF
    doc.save(`Codeium_Quote_${quoteData.quoteId}.pdf`);
  };

  // Check if we have quote data
  if (!quoteData.quoteId) {
    return (
      <Container className="py-5 text-center">
        <h2>No Quote Data Available</h2>
        <p>Please complete the quote form to generate a quote.</p>
        <Button as={Link} to="/quote-form" variant="primary">
          Go to Quote Form
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center mb-4">
        <Col md={8} className="text-center">
          <h2>Your Codeium Quote</h2>
          <p className="text-muted">
            Quote Reference: {quoteData.quoteId} | Date: {quoteData.quoteDate}
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm" ref={quoteRef}>
            <Card.Body>
              <div className="quote-header">
                <h4>Codeium Product Quote</h4>
                <p className="text-muted mb-0">Valid until: {quoteData.expiryDate}</p>
              </div>

              <div className="mb-4">
                <h5>Prepared for:</h5>
                <p className="mb-1">{quoteData.companyName}</p>
                <p>Development Team Size: {quoteData.teamSize}</p>
              </div>

              <div className="mb-4">
                <h5>License Details:</h5>
                
                <div className="quote-line-item">
                  <span>Enterprise License (Annual) × {quoteData.enterpriseLicenses}</span>
                  <span>${quoteData.enterpriseLicenses * 1000}</span>
                </div>
                
                <div className="quote-line-item">
                  <span>Cascade License (Annual) × {quoteData.cascadeLicenses}</span>
                  <span>${quoteData.cascadeLicenses * 2000}</span>
                </div>
                
                <div className="quote-line-item">
                  <span>Implementation Fee</span>
                  <span>$0.00</span>
                </div>
                
                <div className="quote-total">
                  <span>Total Annual Cost:</span>
                  <span>${quoteData.totalCost}</span>
                </div>
              </div>

              <div className="mb-3">
                <h5>Notes:</h5>
                <ul className="text-start">
                  <li>This quote is valid for 30 days from the date of issue.</li>
                  <li>Prices are in USD and do not include applicable taxes.</li>
                  <li>Licenses are billed annually.</li>
                </ul>
              </div>
            </Card.Body>
          </Card>

          <div className="d-flex justify-content-center mt-4">
            <Button 
              variant="outline-secondary" 
              className="me-2"
              onClick={() => setShowEditModal(true)}
            >
              Edit Quote
            </Button>
            <Button 
              variant="primary" 
              onClick={generatePDF}
              className="me-2"
            >
              Download PDF
            </Button>
            <Button 
              variant="outline-primary"
              onClick={startNewQuote}
            >
              New Quote
            </Button>
          </div>
          
          {/* Edit Modal */}
          <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Quote</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3" controlId="editCompanyName">
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="companyName"
                    value={editedData.companyName}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="editEnterpriseLicenses">
                  <Form.Label>Enterprise Licenses ($1,000/year)</Form.Label>
                  <Form.Control
                    type="number"
                    name="enterpriseLicenses"
                    value={editedData.enterpriseLicenses}
                    onChange={handleEditChange}
                    min="0"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="editCascadeLicenses">
                  <Form.Label>Cascade Licenses ($2,000/year)</Form.Label>
                  <Form.Control
                    type="number"
                    name="cascadeLicenses"
                    value={editedData.cascadeLicenses}
                    onChange={handleEditChange}
                    min="0"
                  />
                </Form.Group>
                
                <div className="quote-total mb-3">
                  <span>Total Annual Cost:</span>
                  <span>
                    ${parseInt(editedData.enterpriseLicenses || 0) * 1000 + 
                      parseInt(editedData.cascadeLicenses || 0) * 2000}
                  </span>
                </div>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleEditSubmit}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default QuoteReview;

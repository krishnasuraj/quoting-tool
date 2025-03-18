import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { createSalesforceQuote } from '../services/salesforceService';

const ContactForm = ({ show, onHide, quoteData }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Validate email
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      // Submit to Salesforce via backend API
      console.log('Submitting contact request for:', email);
      const result = await createSalesforceQuote(quoteData, email);
      console.log('Salesforce quote created:', result);
      
      // Show success message
      setSuccess(true);
      
      // Reset form after 3 seconds and close modal
      setTimeout(() => {
        setEmail('');
        setSuccess(false);
        onHide();
      }, 3000);
      
    } catch (err) {
      console.error('Contact form submission error:', err);
      setError(err.message || 'Failed to submit your information to Salesforce. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton style={{ backgroundColor: '#1a1a1a', color: '#f0f0f0' }}>
        <Modal.Title>Contact Request</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: '#1a1a1a', color: '#f0f0f0' }}>
        {success ? (
          <Alert variant="success">
            <strong>Thank you!</strong> Your information has been submitted successfully as a Salesforce Opportunity. A sales representative will contact you soon.
          </Alert>
        ) : (
          <>
            {error && <Alert variant="danger">{error}</Alert>}
            <p>Please provide your email address and we'll have a sales representative contact you about your quote.</p>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-dark text-white"
                />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button 
                  variant="secondary" 
                  onClick={onHide} 
                  className="me-2"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  style={{ backgroundColor: '#0AB7A2', borderColor: '#0AB7A2' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Processing...
                    </>
                  ) : 'Submit'}
                </Button>
              </div>
            </Form>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ContactForm;

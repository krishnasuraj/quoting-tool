import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center mb-5">
        <Col md={8} className="text-center">
          <h1 className="display-4 mb-4">Codeium Product Quoting Tool</h1>
          <p className="lead">
            Generate a customized quote for Codeium's AI-powered developer tools based on your team's specific needs.
          </p>
          <Button 
            as={Link} 
            to="/quote-form" 
            variant="primary" 
            size="lg" 
            className="mt-3"
          >
            Get Started
          </Button>
        </Col>
      </Row>

      <Row className="justify-content-center mb-5">
        <Col md={10}>
          <h2 className="text-center mb-4">Our Products</h2>
          <Row>
            <Col md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>Enterprise License</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">$1,000/year per seat</Card.Subtitle>
                  <Card.Text>
                    Our Enterprise license provides advanced code completion, code search, and code explanation features for professional developers working on proprietary codebases.
                  </Card.Text>
                  <ul className="list-unstyled">
                    <li>✓ AI-powered code completion</li>
                    <li>✓ Code search across repositories</li>
                    <li>✓ Code explanation and documentation</li>
                    <li>✓ Enterprise-grade security</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>Cascade License</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">$2,000/year per seat</Card.Subtitle>
                  <Card.Text>
                    Our Cascade license includes all Enterprise features plus advanced AI agent capabilities for complex coding tasks and cross-repository work.
                  </Card.Text>
                  <ul className="list-unstyled">
                    <li>✓ All Enterprise features</li>
                    <li>✓ AI agent for complex tasks</li>
                    <li>✓ Multi-repository context understanding</li>
                    <li>✓ Advanced code generation</li>
                    <li>✓ Priority support</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          <h3>Ready to get your quote?</h3>
          <p>
            Our quoting tool will help you determine the right mix of licenses for your team and provide you with a downloadable quote.
          </p>
          <Button 
            as={Link} 
            to="/quote-form" 
            variant="primary" 
            size="lg" 
            className="mt-2"
          >
            Start Your Quote
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default LandingPage;

import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-light py-3 mt-auto">
      <Container className="text-center">
        <p className="mb-0">
          © {currentYear} Codeium. All rights reserved. | 
          <a href="https://codeium.com" className="text-light ms-1" target="_blank" rel="noopener noreferrer">
            Visit Codeium.com
          </a>
        </p>
        <p className="small mt-1 mb-0">
          For questions about this quote, please contact sales@codeium.com
        </p>
      </Container>
    </footer>
  );
};

export default Footer;

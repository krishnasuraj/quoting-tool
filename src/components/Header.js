import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src="/codeium-logo.png"
            width="30"
            height="30"
            className="d-inline-block align-top me-2"
            alt="Codeium Logo"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
            }}
          />
          Codeium Product Quoting Tool
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Header;

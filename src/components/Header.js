import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Codeium Product Quoting Tool
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Header;

import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function MenuVisitor() {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link className="nav-item nav-link" to="/locations">
              Locations
            </Link>
            <Link className="nav-item nav-link" to="/restaurants">
              Restaurants
            </Link>
            <Link className="nav-item nav-link" to="/auth/user/login">
              User login
            </Link>
            <Link className="nav-item nav-link" to="/auth/user/register">
              User Register
            </Link>
            <Link className="nav-item nav-link" to="/auth/manager/login">
              Manager login
            </Link>
            <Link className="nav-item nav-link" to="/auth/manager/register">
              Manager Register
            </Link>
            <Link className="nav-item nav-link" to="/auth/administrator/login">
              Administrator login
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import AuthStore from "../../stores/AuthStore";

export default function MenuAdministrator() {
  const navigate = useNavigate();

  function doAdministratorLogout() {
    AuthStore.dispatch({ type: "reset" });
    navigate("/auth/administrator/login");
  }

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Link className="navbar-brand" to="/">
          Good day, {AuthStore.getState().identity}
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link className="nav-item nav-link" to="/locations">
              Locations
            </Link>
            <Link className="nav-item nav-link" to="/restaurants">
              Restaurants
            </Link>
            <Link className="nav-item nav-link" to="/admin/dashboard">
              Dashboard
            </Link>
            <div
              className="nav-item nav-link"
              style={{ cursor: "pointer" }}
              onClick={() => doAdministratorLogout()}
            >
              Logout
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

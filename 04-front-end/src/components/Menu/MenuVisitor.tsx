import { Link } from "react-router-dom";

export default function MenuVisitor() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
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
        </div>
      </div>
    </nav>
  );
}

import { Link, useNavigate } from "react-router-dom";
import AuthStore from "../../stores/AuthStore";

export default function MenuAdministrator() {
  const navigate = useNavigate();

  function doManagerLogout() {
    AuthStore.dispatch({ type: "reset" });
    navigate("/auth/manager/login");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <h4 className="navbar-brand">
        Good day, {AuthStore.getState().identity}
      </h4>

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
          <Link className="nav-item nav-link" to="/manager/dashboard">
            Dashboard
          </Link>
          <div
            className="nav-item nav-link"
            style={{ cursor: "pointer" }}
            onClick={() => doManagerLogout()}
          >
            Logout
          </div>
        </div>
      </div>
    </nav>
  );
}

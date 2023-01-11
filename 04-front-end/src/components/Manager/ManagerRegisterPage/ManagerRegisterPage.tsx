import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/api";

export default function ManagerRegisterPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const doRegister = () => {
    api("post", "/api/manager/register", "manager", {
      email,
      password,
      username,
    })
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error(
            "Could not register your account. Reason: " +
              JSON.stringify(res.data)
          );
        }
      })
      .then(() => {
        navigate("/auth/manager/login", {
          replace: true,
        });
      })
      .catch((error) => {
        setError(error?.message ?? "Could not register your account.");

        setTimeout(() => {
          setError("");
        }, 3500);
      });
  };

  return (
    <div className="row">
      <div className="col col-xs-12 col-md-6 offset-md-3">
        <h1 className="h5 mb-3">Register your manager account</h1>

        <div className="form-group mb-3">
          <div className="input-group">
            <input
              className="form-control"
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group mb-3">
          <div className="input-group">
            <input
              className="form-control"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group mb-3">
          <div className="input-group">
            <input
              className="form-control"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group mb-3">
          <button className="btn btn-primary px-5" onClick={() => doRegister()}>
            <FontAwesomeIcon icon={faUserCircle} /> Register
          </button>
        </div>

        {error && <p className="alert alert-danger">{error}</p>}
      </div>
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="row">
      <div className="col-12 col-lg-4 col-md-6 col-xl-3 p-3">
        <div className="card">
          <div className="card-body">
            <div className="card-title">
              <h2 className="h5">Locations</h2>
            </div>
            <div className="card-text d-grid gap-3">
              <Link
                className="btn btn-primary"
                to="/admin/dashboard/location/list"
              >
                List all locations
              </Link>
              <Link
                className="btn btn-primary"
                to="/admin/dashboard/location/add"
              >
                Add a new location
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="col-12 col-lg-4 col-md-6 col-xl-3 p-3">
        <div className="card">
          <div className="card-body">
            <div className="card-title">
              <h2 className="h5">Managers</h2>
            </div>
            <div className="card-text d-grid gap-3">
              <Link
                className="btn btn-primary"
                to="/admin/dashboard/manager/list"
              >
                List all managers
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-4 col-md-6 col-xl-3 p-3">
        <div className="card">
          <div className="card-body">
            <div className="card-title">
              <h2 className="h5">Users</h2>
            </div>
            <div className="card-text d-grid gap-3">
              <Link className="btn btn-primary" to="/admin/dashboard/user/list">
                List all users
              </Link>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

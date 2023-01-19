import React from "react";
import { Link } from "react-router-dom";

export default function ManagerDashboard() {
  return (
    <div className="row">
      <div className="col-12 col-lg-4 col-md-6 col-xl-3 p-3">
        <div className="card">
          <div className="card-body">
            <div className="card-title">
              <h2 className="h5">Restaurants</h2>
            </div>
            <div className="card-text d-grid gap-3">
              <Link
                className="btn btn-primary"
                to="/manager/dashboard/restaurant/list"
              >
                List my restaurants
              </Link>
              <Link
                className="btn btn-primary"
                to="/manager/dashboard/restaurant/add"
              >
                Add a new restaurant
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-4 col-md-6 col-xl-3 p-3">
        <div className="card">
          <div className="card-body">
            <div className="card-title">
              <h2 className="h5">Reservations</h2>
            </div>
            <div className="card-text d-grid gap-3">
              <Link
                className="btn btn-primary"
                to={"/manager/dashboard/reservations/all"}
              >
                List all reservations
              </Link>
              <Link
                className="btn btn-primary"
                to={"/manager/dashboard/reservations/pending"}
              >
                List pending reservations
              </Link>
              <Link
                className="btn btn-primary"
                to={"/manager/dashboard/reservations/confirmed"}
              >
                List confirmed reservations
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

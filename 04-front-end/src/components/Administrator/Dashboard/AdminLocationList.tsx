import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../api/api";
import ILocation from "../../../models/ILocation.model";
import "./AdminLocationList.sass";

interface IAdminLocationListRowProperties {
  location: ILocation;
}

export default function AdminLocationList() {
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showAddNewLocation, setShowAddNewLocation] = useState<boolean>(false);

  function AdminLocationListRow(props: IAdminLocationListRowProperties) {
    const [locationName, setLocationName] = useState<string>(
      props.location.locationName
    );

    const nameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocationName(e.target.value);
    };

    const doEditLocation = (e: any) => {
      api(
        "put",
        "/api/location/" + props.location.locationId,
        "administrator",
        { locationName }
      ).then((res) => {
        if (res.status === "error") {
          return setErrorMessage("Could not edit this location!");
        }

        loadLocations();
      });
    };

    return (
      <tr>
        <td>{props.location.locationId}</td>
        <td>
          <div className="input-group">
            <input
              className="form-control form-control-sm"
              type="text"
              onChange={(e) => nameChanged(e)}
              value={locationName}
            />
            {props.location.locationName !== locationName ? (
              <button
                className="btn btn-primary btn-sm"
                onClick={(e) => doEditLocation(e)}
              >
                Save
              </button>
            ) : (
              ""
            )}
          </div>
        </td>
        <td>
          <Link
            className="btn btn-primary btn-sm"
            to={
              "/admin/dashboard/category/" +
              props.location.locationId +
              "/restaurants"
            }
          >
            List restaurants
          </Link>
        </td>
      </tr>
    );
  }

  function AdminLocationAddRow() {
    const [locationName, setLocationName] = useState<string>("");

    const nameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocationName(e.target.value);
    };

    const doAddLocation = (e: any) => {
      api("post", "/api/location/", "administrator", {
        location_name: locationName,
      }).then((res) => {
        console.log('do add location res', res);
        if (res.status === "error") {
          return setErrorMessage(res.data);
        }

        loadLocations();
        setShowAddNewLocation(false);
        setLocationName("");
      });
    };

    return (
      <tr>
        <td> </td>
        <td>
          <div className="input-group">
            <input
              className="form-control form-control-sm"
              type="text"
              onChange={(e) => nameChanged(e)}
              value={locationName}
            />
            {locationName.trim().length >= 4 &&
            locationName.trim().length <= 32 ? (
              <button
                className="btn btn-primary btn-sm"
                onClick={(e) => doAddLocation(e)}
              >
                Add Location
              </button>
            ) : (
              <p className="mx-1 text-danger">Min 4 characters!</p>
            )}
          </div>
        </td>
        <td>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => {
              setShowAddNewLocation(false);
              setLocationName("");
            }}
          >
            Cancel
          </button>
        </td>
      </tr>
    );
  }

  const loadLocations = () => {
    api("get", "/api/location", "administrator")
      .then((apiResponse) => {
        if (apiResponse.status === "ok") {
          return setLocations(apiResponse.data);
        }

        throw { message: "Unknown error while loading locations..." };
      })
      .catch((error) => {
        setErrorMessage(
          error?.message ?? "Unknown error while loading locations..."
        );
      });
  };

  useEffect(() => {
    loadLocations();
  }, []);

  return (
    <div>
      {errorMessage && <p>Error: {errorMessage}</p>}
      {!errorMessage && (
        <div>
          <button
            className="btn btn-primary my-3"
            onClick={() => setShowAddNewLocation(true)}
          >
            Add new location
          </button>
          <table className="table table-bordered table-striped table-hover table-sm">
            <thead>
              <tr>
                <th className="location-row-id">ID</th>
                <th>Name</th>
                <th className="location-row-options">Options</th>
              </tr>
            </thead>
            <tbody>
              {showAddNewLocation && <AdminLocationAddRow />}
              {locations.map((location) => (
                <AdminLocationListRow
                  key={"location-row-" + location.locationId}
                  location={location}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

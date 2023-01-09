import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { api } from "../../../api/api";
import ILocation from "../../../models/ILocation.model";
import "./AdminLocationList.sass";

interface IAdminLocationListRowProperties {
  location: ILocation;
}

interface IAdminLocationAddRowProps {
  setErrorMessage: Dispatch<SetStateAction<string>>;
  loadLocations: () => void;
  setShowAddNewLocation: Dispatch<SetStateAction<boolean>>;
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
      setErrorMessage("");
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
            to={"/location/" + props.location.locationId}
          >
            List restaurants
          </Link>
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
      {errorMessage && (
        <Alert key="danger" variant="danger">
          Error: {errorMessage}
        </Alert>
      )}
      <div>
        <h3>Locations:</h3>
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
            {showAddNewLocation && (
              <AdminLocationAddRow
                setErrorMessage={setErrorMessage}
                loadLocations={loadLocations}
                setShowAddNewLocation={setShowAddNewLocation}
              />
            )}
            {locations.map((location) => (
              <AdminLocationListRow
                key={"location-row-" + location.locationId}
                location={location}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminLocationAddRow(props: IAdminLocationAddRowProps) {
  const [locationName, setLocationName] = useState<string>("");

  const nameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationName(e.target.value);
    props.setErrorMessage("");
  };

  const doAddLocation = (e: any) => {
    api("post", "/api/location/", "administrator", {
      location_name: locationName,
    }).then((res) => {
      if (res.status === "error") {
        return props.setErrorMessage(res.data);
      }

      props.loadLocations();
      props.setShowAddNewLocation(false);
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
          {locationName.trim().length >= 2 &&
          locationName.trim().length <= 30 ? (
            <button
              className="btn btn-primary btn-sm"
              onClick={(e) => doAddLocation(e)}
            >
              Add Location
            </button>
          ) : locationName.trim().length < 2 ? (
            <p className="mx-1 text-danger">Min 2 characters!</p>
          ) : (
            <p className="mx-1 text-danger">Max 30 characters!</p>
          )}
        </div>
      </td>
      <td>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => {
            props.setShowAddNewLocation(false);
            setLocationName("");
          }}
        >
          Cancel
        </button>
      </td>
    </tr>
  );
}

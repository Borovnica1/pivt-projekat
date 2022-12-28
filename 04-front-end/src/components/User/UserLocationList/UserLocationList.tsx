import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ILocation from "../../../models/ILocation.model";

export default function UserLocationList() {
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    fetch("http://localhost:10000/api/location")
      .then((res) => res.json())
      .then((data) => {
        setLocations(data);
      })
      .catch((error) => {
        setErrorMessage(
          error?.message ?? "Unknown error while loading locations..."
        );
      });
  }, []);

  return (
    <div>
      {errorMessage && <p>Error: {errorMessage}</p>}
      {!errorMessage && (
        <ul>
          {locations.map((location) => (
            <li key={"location-" + location.locationId}>
              <Link to={"/location/" + location.locationId}>
                {location.locationName}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

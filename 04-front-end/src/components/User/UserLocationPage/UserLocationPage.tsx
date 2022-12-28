import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ILocation from "../../../models/ILocation.model";
import IRestaurant from "../../../models/IRestaurant.model";
import RestaurantPreview from "../Restaurant/RestaurantPreview";

export interface IUserRestaurantPageUrlParams
  extends Record<string, string | undefined> {
  id: string;
}

export default function UserLocationPage() {
  const [locations, setLocations] = useState<ILocation | null>(null);
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const params = useParams<IUserRestaurantPageUrlParams>();

  useEffect(() => {
    setLoading(true);

    fetch("http://localhost:10000/api/location/" + params.id)
      .then((res) => res.json())
      .then((data) => {
        setLocations(data);
      })
      .then(() => {
        return fetch(
          "http://localhost:10000/api/location/" + params.id + "/restaurant"
        );
      })
      .then((res) => res.json())
      .then((data) => {
        setRestaurants(data);
      })
      .catch((error) => {
        setErrorMessage(
          error?.message ?? "Unknown error while loading this locations!"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {errorMessage && <p>Error: {errorMessage}</p>}

      {locations && (
        <div>
          <h1>{locations?.locationName}</h1>

          {restaurants && (
            <div>
              {restaurants.map((restaurant) => (
                <RestaurantPreview
                  key={"restaurant-" + restaurant.restaurantId}
                  restaurant={restaurant}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

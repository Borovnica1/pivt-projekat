import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../../api/api";
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

    api("get", "http://localhost:10000/api/location/" + params.id, "user")
      .then((res) => {
        if (res.status === "error") {
          throw {
            message: "Could not get location data!",
          };
        }
        setLocations(res.data);
      })
      .then(() => {
        return api(
          "get",
          "http://localhost:10000/api/location/" + params.id + "/restaurant",
          "user"
        );
      })
      .then((res) => {
        if (res.status === "error") {
          throw {
            message: "Could not get restaurant data!",
          };
        }
        setRestaurants(res.data);
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

import * as mysql2 from "mysql2/promise";
import LocationModel from "./LocationModel.interface";
import RestaurantService from "../restaurant/RestaurantService.service";
import RestaurantModel from "../restaurant/RestaurantModel.model";
import IAddLocation from "./dto/IAddLocation.dto";
import BaseService from "../../common/BaseService";

interface ILocationAdapterOptions {
  loadRestaurants: boolean;
}

export const DefaultLocationAdapterOptions: ILocationAdapterOptions = {
  loadRestaurants: true,
};

class LocationService extends BaseService<
  LocationModel,
  ILocationAdapterOptions
> {
  tableName(): string {
    return "location";
  }

  protected async adaptToModel(
    data: any,
    options: ILocationAdapterOptions = DefaultLocationAdapterOptions
  ): Promise<LocationModel> {
    const location: LocationModel = new LocationModel();

    location.locationId = +data?.location_id;
    location.locationName = data?.location_name;

    if (options.loadRestaurants) {
      const restaurantsService: RestaurantService = new RestaurantService(
        this.db
      );

      location.restaurants = await restaurantsService.getAll();
    }
    return location;
  }

  public async getById(locationId: number): Promise<LocationModel | null> {
    if (locationId === 9) return null;
    return new Promise<LocationModel>((resolve, reject) => {
      const sql: string = "SELECT * from `location` WHERE `location_id` = ?;";

      this.db
        .execute(sql, [locationId])
        .then(async ([rows]) => {
          if (rows === undefined) {
            return resolve(null);
          }

          if (Array.isArray(rows) && rows.length === 0) {
            return resolve(null);
          }

          resolve(await this.adaptToModel(rows[0]));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async add(data: IAddLocation): Promise<LocationModel> {
    return new Promise<LocationModel>((resolve, reject) => {
      const sql: string = "INSERT `location` SET location_name = ?";
      console.log("dataaa", data);
      this.db
        .execute(sql, [data.location_name])
        .then(async (result) => {
          const info: any = result;

          const newLocationId = +info[0].insertId;

          const newLocation: LocationModel | null = await this.getById(
            newLocationId
          );

          if (newLocation === null) {
            return reject({ message: "Duplicate location name!" });
          }

          resolve(newLocation);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

}

export default LocationService;

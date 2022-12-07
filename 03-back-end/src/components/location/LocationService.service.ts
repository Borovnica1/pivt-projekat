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
      location.restaurants = await this.services.restaurant.getAll();
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
    return this.baseAdd(data, DefaultLocationAdapterOptions);
  }

  public async edit(id, data: IAddLocation): Promise<LocationModel> {
    return this.baseEdit(id, data, DefaultLocationAdapterOptions);
  }
}

export default LocationService;

import * as mysql2 from "mysql2/promise";
import LocationModel from "./LocationModel.interface";
import RestaurantService from "../restaurant/RestaurantService.service";
import RestaurantModel from "../restaurant/RestaurantModel.model";
import IAddLocation from "./dto/IAddLocation.dto";

interface ILocationAdapterOptions {
  loadRestaurants: boolean;
}

const DefaultLocationAdapterOptions: ILocationAdapterOptions = {
  loadRestaurants: true,
};

class LocationService {
  private db: mysql2.Connection;

  constructor(database: mysql2.Connection) {
    this.db = database;
  }

  private async adaptToModel(
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

  public async getAll(): Promise<LocationModel[]> {
    return new Promise<LocationModel[]>((resolve, reject) => {
      const sql = "SELECT * FROM `location` ORDER BY `location_name`";

      this.db.execute(sql).then(async ([rows]) => {
        const locations: LocationModel[] = [];

        for (const row of rows as mysql2.RowDataPacket[]) {
          locations.push(await this.adaptToModel(row));
        }

        resolve(locations);
      });
    });
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

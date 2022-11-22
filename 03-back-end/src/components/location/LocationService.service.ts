import * as mysql2 from "mysql2/promise";
import LocationModel from "./LocationModel.interface";
import RestaurantService from "../restaurant/RestaurantService.service";
import RestaurantModel from "../restaurant/RestaurantModel.model";

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
}

export default LocationService;

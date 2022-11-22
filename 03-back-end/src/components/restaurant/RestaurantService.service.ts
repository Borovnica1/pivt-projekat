import RestaurantModel from "./RestaurantModel.model";
import * as mysql2 from "mysql2/promise";

class RestaurantService {
  private db: mysql2.Connection;

  constructor(databaseConnection: mysql2.Connection) {
    this.db = databaseConnection;
  }

  private async adaptToModel(data: any): Promise<RestaurantModel> {
    const restaurant: RestaurantModel = new RestaurantModel();

    restaurant.restaurantId = +data?.restaurant_id;
    restaurant.name = data?.name;

    return restaurant;
  }

  public async getAll(): Promise<RestaurantModel[]> {
    return new Promise<RestaurantModel[]>((resolve, reject) => {
      const sql: string = "SELECT * FROM `restaurant` ORDER BY `name`";
      this.db
        .execute(sql)
        .then(async ([rows]) => {
          if (rows === undefined) {
            return resolve([]);
          }

          const restaurants: RestaurantModel[] = [];

          for (const row of rows as mysql2.RowDataPacket[]) {
            restaurants.push(await this.adaptToModel(row));
          }

          resolve(restaurants);
        })
        .catch((error) => {
          reject(error);
        });
    });
    const restaurants: RestaurantModel[] = [];

    return restaurants;
  }

  public async getById(restaurantId: number): Promise<RestaurantModel | null> {
    if (restaurantId === 9) return null;
    return new Promise<RestaurantModel>((resolve, reject) => {
      const sql: string =
        "SELECT * from `restaurant` WHERE `restaurant_id` = ?;";
        
      this.db
        .execute(sql, [restaurantId])
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
}

export default RestaurantService;

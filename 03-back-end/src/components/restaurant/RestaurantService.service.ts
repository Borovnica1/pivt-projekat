import RestaurantModel from "./RestaurantModel.model";
import * as mysql2 from "mysql2/promise";

class RestaurantService {
  private db: mysql2.Connection;

  constructor(databaseConnection: mysql2.Connection) {
    this.db = databaseConnection;
  }

  public async getAll(): Promise<RestaurantModel[]> {
    return new Promise<RestaurantModel[]>((resolve, reject) => {
      const sql: string = `SELECT * FROM 'restaurant' ORDER BY 'name'`;
      this.db
        .execute(sql)
        .then((result) => {
          const restaurants: RestaurantModel[] = [];

          for (const row of result) {
            restaurants.push({
              restaurantId: +row?.restaurant_id,
              name: row?.restaurant_name,
            });
          }
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
    return {
      restaurantId: restaurantId,
      name: "restorannn " + restaurantId,
    };
  }
}

export default RestaurantService;

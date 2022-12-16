import RestaurantModel from "./RestaurantModel.model";
import * as mysql2 from "mysql2/promise";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import BaseService from "../../common/BaseService";
import { IAddRestaurantServiceDto } from "./dto/IAddRestaurant.dto";
import IEditRestaurant from "./dto/IEditRestaurant.dto";

class IRestaurantOptions implements IAdapterOptions {
  loadPhotos: boolean;
}
class RestaurantService extends BaseService<
  RestaurantModel,
  IRestaurantOptions
> {
  tableName(): string {
    return "restaurant";
  }

  protected async adaptToModel(
    data: any,
    options: IRestaurantOptions
  ): Promise<RestaurantModel> {
    const restaurant: RestaurantModel = new RestaurantModel();

    restaurant.restaurantId = +data?.restaurant_id;
    restaurant.name = data?.name;

    if (options.loadPhotos) {
      const restaurantPhotos = await this.services.photo.getAllByRestaurantId(
        restaurant.restaurantId
      );
      restaurant.photos = restaurantPhotos;
    }

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
            restaurants.push(
              await this.adaptToModel(row, { loadPhotos: true })
            );
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

  public async getById(
    restaurantId: number,
    options: IRestaurantOptions
  ): Promise<RestaurantModel | null> {
    return this.baseGetById(restaurantId, options);
  }

  public async getAllByLocationId(
    locationId: number,
    options: IRestaurantOptions
  ): Promise<RestaurantModel[]> {
    return this.getAllByFieldNameAndValue("location_id", locationId, options);
  }

  public async add(data: IAddRestaurantServiceDto): Promise<RestaurantModel> {
    return this.baseAdd(data, { loadPhotos: false });
  }

  public async editById(
    restaurantId: number,
    data: IEditRestaurant,
    options: IRestaurantOptions
  ): Promise<RestaurantModel> {
    return this.baseEdit(restaurantId, data, options);
  }

  public async deleteById(id: number): Promise<true> {
    return this.baseDeleteById(id);
  }

  public async addRestaurantManager(
    restaurantId: number,
    managerId: number
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const sql = `INSERT restaurant_manager SET restaurant_id = ?, manager_id = ?`;

      this.db
        .execute(sql, [restaurantId, managerId])
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export default RestaurantService;

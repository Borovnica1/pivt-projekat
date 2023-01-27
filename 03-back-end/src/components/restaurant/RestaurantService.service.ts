import RestaurantModel, {
  RestaurantManagerModel,
} from "./RestaurantModel.model";
import * as mysql2 from "mysql2/promise";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import BaseService from "../../common/BaseService";
import { IAddRestaurantServiceDto } from "./dto/IAddRestaurant.dto";
import IEditRestaurant from "./dto/IEditRestaurant.dto";

class IRestaurantOptions implements IAdapterOptions {
  loadPhotos?: boolean;
  loadWorkingHours?: boolean;
  loadAddresses?: boolean;
  loadDaysOff?: boolean;
  loadTables?: boolean;
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
    restaurant.locationId = +data?.location_id;
    restaurant.name = data?.name;
    restaurant.description = data?.description || "";

    if (options.loadPhotos) {
      const restaurantPhotos = await this.services.photo.getAllByRestaurantId(
        restaurant.restaurantId
      );
      restaurant.photos = restaurantPhotos;
    }

    if (options.loadWorkingHours) {
      const restaurantWorkingHours =
        await this.services.workingHours.getWokringHoursByRestaurantId(
          restaurant.restaurantId
        );
      restaurant.workingHours = restaurantWorkingHours;
    }

    if (options.loadAddresses) {
      const restaurantAddresses =
        await this.services.address.getAllByFieldNameAndValue(
          "restaurant_id",
          [restaurant.restaurantId],
          {}
        );
      restaurant.addresses = restaurantAddresses;
    }
    if (options.loadDaysOff) {
      const restaurantDaysOff =
        await this.services.dayOff.getAllByFieldNameAndValue(
          "restaurant_id",
          [restaurant.restaurantId],
          {}
        );
      restaurant.daysOff = restaurantDaysOff;
    }
    if (options.loadTables) {
      const restaurantTables =
        await this.services.table.getAllByFieldNameAndValue(
          "restaurant_id",
          [restaurant.restaurantId],
          {}
        );
      restaurant.tables = restaurantTables;
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
              await this.adaptToModel(row, {
                loadPhotos: true,
                loadWorkingHours: true,
                loadDaysOff: true,
              })
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
    return this.getAllByFieldNameAndValue("location_id", [locationId], options);
  }

  public async add(data: IAddRestaurantServiceDto): Promise<RestaurantModel> {
    return this.baseAdd(data, { loadPhotos: false, loadWorkingHours: false });
  }

  public async editById(
    restaurantId: number,
    data: IEditRestaurant,
    options: IRestaurantOptions
  ): Promise<RestaurantModel> {
    return this.baseEdit(restaurantId, data, options);
  }

  public async deleteById(id: number): Promise<true> {
    return new Promise((resolve, reject) => {
      this.services.restaurant
        .startTransaction()
        .then(async () => {
          await this.deleteRestaurantManager(id);
          await this.baseDeleteById(id);
          return true;
        })
        .then((result) => {
          if (result) {
            this.services.restaurant.commitChanges();
          }
          resolve(true);
        })
        .catch((error) => {
          this.services.restaurant.rollbackChanges();
          reject(error);
        });
    });
  }

  public async deleteRestaurantManager(resturantId: number): Promise<true> {
    return new Promise((resolve, reject) => {
      const sql: string =
        "DELETE FROM restaurant_manager WHERE restaurant_id = ?;";

      this.db
        .execute(sql, [resturantId])
        .then(async (result) => {
          const info: any = result;
          if (info[0]?.affectedRows === 0) {
            return reject({
              message:
                "Could not delete this items from the restaurant_manager table!",
            });
          }

          resolve(true);
        })
        .catch((error) => {
          reject(error);
        });
    });
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

  public async getRestaurantManagerByRestaurantId(
    restaurantId: number
  ): Promise<RestaurantManagerModel> {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM restaurant_manager WHERE restaurant_id = ?";

      this.db
        .execute(sql, [restaurantId])
        .then(([rows]) => {
          if (rows === undefined) {
            return resolve(null);
          }

          if (Array.isArray(rows) && rows.length === 0) {
            return resolve(null);
          }

          resolve({
            restaurantManagerId: +rows[0]?.restaurant_manager_id,
            managerId: +rows[0]?.manager_id,
            restaurantId: +rows[0]?.restaurant_id,
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async getRestaurantsByManagerId(
    managerId: number
  ): Promise<RestaurantManagerModel[]> {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM restaurant_manager WHERE manager_id = ?";

      this.db
        .execute(sql, [managerId])
        .then(([rows]) => {
          const restaurants = [];

          for (const row of rows as any[]) {
            restaurants.push({
              restaurantManagerId: +row?.restaurant_manager_id,
              managerId: +row?.manager_id,
              restaurantId: +row?.restaurant_id,
            });
          }

          if (rows === undefined) {
            return resolve(null);
          }

          if (Array.isArray(rows) && rows.length === 0) {
            return resolve(null);
          }

          resolve(restaurants);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export default RestaurantService;

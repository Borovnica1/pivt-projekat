import IModel from "./IModel.interface";
import IAdapterOptions from "./IAdapterOptions.interface";
import * as mysql2 from "mysql2/promise";
import RestaurantModel from "../components/restaurant/RestaurantModel.model";

export default abstract class BaseService<
  ReturnModel extends IModel,
  AdapterOptions extends IAdapterOptions
> {
  private database: mysql2.Connection;

  constructor(databaseConnection: mysql2.Connection) {
    this.database = databaseConnection;
  }

  protected get db(): mysql2.Connection {
    return this.database;
  }

  abstract tableName(): string;
  protected abstract adaptToModel(
    data: any,
    options: IAdapterOptions
  ): Promise<ReturnModel>;

  public async getAll(options: AdapterOptions): Promise<ReturnModel[]> {
    const tableName = this.tableName();

    return new Promise<ReturnModel[]>((resolve, reject) => {
      const sql = `SELECT * FROM \`${tableName}\`;`;

      this.db
        .execute(sql)
        .then(async ([rows]) => {
          const items: ReturnModel[] = [];

          for (const row of rows as mysql2.RowDataPacket[]) {
            items.push(await this.adaptToModel(row, options));
          }

          resolve(items);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async getAllByFieldNameAndValue(
    fieldName: string,
    value: number,
    options: IAdapterOptions
  ): Promise<ReturnModel[]> {
    const tableName = this.tableName();

    return new Promise((resolve, reject) => {
      const sql: string = `SELECT * FROM \`${tableName}\` WHERE  \`${fieldName}\` = ?;`;

      this.database
        .execute(sql, [value])
        .then(async ([rows]) => {
          const restaurants: ReturnModel[] = [];

          for (const row of rows as mysql2.RowDataPacket[]) {
            restaurants.push(await this.adaptToModel(row, options));
          }

          resolve(restaurants);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

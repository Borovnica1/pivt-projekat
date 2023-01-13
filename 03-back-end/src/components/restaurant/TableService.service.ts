import BaseService from "../../common/BaseService";
import { IAddTable } from "./dto/IAddTable.dto";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import { IEditTable } from "./dto/IEditTable.dto";
import IModel from "../../common/IModel.interface";

export class TableModel implements IModel {
  tableId: number;
  restaurantId: number;

  tableName: string;
  tableCapacity: string;
  tableMaxReservationDuratio: string;
}

export interface ITableAdapterOptions extends IAdapterOptions {}

export default class TableService extends BaseService<
  TableModel,
  ITableAdapterOptions
> {
  tableName(): string {
    return "table";
  }

  adaptToModel(
    data: any,
    options: ITableAdapterOptions
  ): Promise<TableModel> {
    return new Promise((resolve) => {
      const table = new TableModel();

      table.tableId = +data?.table_id;
      table.restaurantId = data?.restaurant_id;
      table.tableName = data?.table_name;
      table.tableCapacity = data?.table_capacity;
      table.tableMaxReservationDuratio = data?.table_max_reservation_duration;

      resolve(table);
    });
  }

  add(data: IAddTable): Promise<TableModel> {
    return this.baseAdd(data, {});
  }

  edit(tableId: number, data: IEditTable): Promise<TableModel> {
    return this.baseEdit(tableId, data, {});
  }

  delete(tableId: number) {
    return this.baseDeleteById(tableId);
  }
}

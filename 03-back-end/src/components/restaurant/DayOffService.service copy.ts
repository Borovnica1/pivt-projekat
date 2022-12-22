import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import IModel from "../../common/IModel.interface";
import { IEditDayOff } from './dto/IEditDayOff.dto';
import { IAddDayOff } from './dto/IAddDayOff.dto';

class DayOffModel implements IModel {
  dayOffId: number;
  restaurantId: number;

  dayOffDate: string;
  reason: string;
}

export interface IDayOffAdapterOptions extends IAdapterOptions {}

export default class DayOffService extends BaseService<
  DayOffModel,
  IDayOffAdapterOptions
> {
  tableName(): string {
    return "day_off";
  }

  adaptToModel(
    data: any,
    options: IDayOffAdapterOptions
  ): Promise<DayOffModel> {
    return new Promise((resolve) => {
      const dayOff = new DayOffModel();

      dayOff.dayOffId = +data?.day_off_id;
      dayOff.restaurantId = data?.restaurant_id;
      dayOff.reason = data?.reason;
      dayOff.dayOffDate = data?.day_off_date;

      resolve(dayOff);
    });
  }

  add(data: IAddDayOff): Promise<DayOffModel> {
    return this.baseAdd(data, {});
  }

  edit(dayOffId: number, data: IEditDayOff): Promise<DayOffModel> {
    return this.baseEdit(dayOffId, data, {});
  }

  delete(dayOffId: number) {
    return this.baseDeleteById(dayOffId);
  }
}

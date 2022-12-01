import BaseService from "../../common/BaseService";
import IAdapterOptionsInterface from "../../common/IAdapterOptions.interface";
import IAddWorkingHours from "./dto/IAddWorkingHours.dto";
import WorkingHoursModel from "./Working-hoursModel.model";

export default class WorkingHoursService extends BaseService<WorkingHoursModel, {}> {
  tableName(): string {
    return "working_hours";
  }

  protected async adaptToModel(
    data: any,
    options: IAdapterOptionsInterface
  ): Promise<WorkingHoursModel> {
    const workingHours: WorkingHoursModel = new WorkingHoursModel();

    workingHours.workingHoursId = +data?.working_hours_id;
    workingHours.day = data?.day;
    workingHours.openingHours = data?.opening_hours;
    workingHours.closingHours = data?.closing_hours;

    return workingHours;
  }

  public async add(data: IAddWorkingHours): Promise<WorkingHoursModel> {
    return this.baseAdd(data, {});
  }

  /* public async editById(
    restaurantId: number,
    data: IEditRestaurant,
    options: IRestaurantOptions
  ): Promise<RestaurantModel> {
    return this.baseEdit(restaurantId, data, options);
  }

  public async deleteById(id: number): Promise<true> {
    return this.baseDeleteById(id);
  } */
}

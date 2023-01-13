import BaseService from "../../common/BaseService";
import IAdapterOptionsInterface from "../../common/IAdapterOptions.interface";
import IAddWorkingHours from "./dto/IAddWorkingHours.dto";
import WorkingHoursModel from "./Working-hoursModel.model";
import IEditWorkingHours from "./dto/IEditWorkingHours.dto";
import IAdapterOptions from "../../common/IAdapterOptions.interface";

class IWorkingHoursOptions implements IAdapterOptions {}

export default class WorkingHoursService extends BaseService<
  WorkingHoursModel,
  IWorkingHoursOptions
> {
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
    workingHours.open = data?.open;
    workingHours.openingHours = data?.opening_hours;
    workingHours.closingHours = data?.closing_hours;
    workingHours.isClosed = data?.is_closed;

    return workingHours;
  }

  public async add(data: IAddWorkingHours): Promise<WorkingHoursModel> {
    return this.baseAdd(data, {});
  }

  public async getWokringHoursByRestaurantId(
    restaurantId: number
  ): Promise<WorkingHoursModel[]> {
    return this.getAllByFieldNameAndValue("restaurant_id", [restaurantId], {});
  }

  public async editById(
    workingHoursId: number,
    data: IEditWorkingHours,
    options: IWorkingHoursOptions
  ): Promise<WorkingHoursModel> {
    return this.baseEdit(workingHoursId, data, options);
  }
}

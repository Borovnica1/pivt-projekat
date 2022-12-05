import IServiceData from "../../../common/IServiceData.interface";

export default interface IAddPhoto extends IServiceData {
  name: string;
  file_path: string;
  restaurant_id: number;
}

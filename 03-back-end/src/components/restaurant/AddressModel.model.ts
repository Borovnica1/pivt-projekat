import IModel from "../../common/IModel.interface";

export default class AddressModel implements IModel {
  addressId: number;
  restaurantId: number;

  streetAndNmber: string;
  place: string;
  phoneNumber: string;
}

import IPhoto from "./IPhoto.model";
import WorkingHours from "./IWorkingHours.model";

interface IRestaurant {
  restaurantId: number;
  name: string;
  description: string;

  photos?: IPhoto[];
  workingHours: WorkingHours[];
}

export default IRestaurant;

import WorkingHours from "./IWorkingHours.model";

interface IRestaurant {
  restaurantId: number;
  name: string;
  description: string;

  photos?: any[];
  workingHours: WorkingHours[];
}

export default IRestaurant;

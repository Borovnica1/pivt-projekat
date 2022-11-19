import RestaurantModel from "./RestaurantModel.model";

class RestaurantService {
  public async getAll(): Promise<RestaurantModel[]> {
    const restaurants: RestaurantModel[] = [];
    restaurants.push({
      restaurantId: 1,
      name: "restoran 11",
    });

    restaurants.push({
      restaurantId: 2,
      name: "restoran 222",
    });

    restaurants.push({
      restaurantId: 7,
      name: "restoran 77",
    });

    return restaurants;
  }

  public async getById(restaurantId: number): Promise<RestaurantModel | null> {
    if (restaurantId === 9) return null;
    return {
      restaurantId: restaurantId,
      name: "restorannn " + restaurantId,
    };
  }
}

export default RestaurantService;

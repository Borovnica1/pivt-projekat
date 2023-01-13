import IRestaurant from "../../../models/IRestaurant.model";

export interface IRestaurantPreviewProperties {
  restaurant: IRestaurant;
}

export default function RestaurantPreview(props: IRestaurantPreviewProperties) {
  console.log(props.restaurant);

  return (
    <div>
      <h2>{props.restaurant.name}</h2>
      <p>{props.restaurant.description}</p>
      <p>Working hours:</p>
      <ul>
        {props.restaurant.workingHours?.map((workingHoursDay) => {
          return (
            <div
              key={
                "workinghours-" +
                props.restaurant.restaurantId +
                "-" +
                workingHoursDay.workingHoursId
              }
            >
              {workingHoursDay.open ? (
                workingHoursDay.day + ": CLOSED! "
              ) : (
                <span className="d-inline-block">
                  {workingHoursDay.day +
                    ": " +
                    workingHoursDay.openingHours +
                    "-" +
                    workingHoursDay.closingHours}
                </span>
              )}
              <br />
            </div>
          );
        })}
      </ul>
    </div>
  );
}

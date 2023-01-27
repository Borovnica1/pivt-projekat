import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { api } from "../../../api/api";
import IRestaurant, { IOpenTime } from "../../../models/IRestaurant.model";
import * as path from "path-browserify";
import myConfig from "../../../config";
import IWorkingHours, { DayInAWeek } from "src/models/IWorkingHours.model";
import { addDays } from "date-fns";

export function calculateOpenTime(restaurant: IRestaurant) {
  let openTime: IOpenTime = {
    currentlyOpen: false,
    message: "Restoran privremeno zatvoren",
  };
  var currentDate = new Date();

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let currentRestaurantWorkingDay: IWorkingHours =
    restaurant.workingHours.find(
      (workingDay) => workingDay.day === weekDays[currentDate.getDay()]
    ) || restaurant.workingHours[0];

  // this is in case some restaurant in database has no workinghours
  if (!currentRestaurantWorkingDay) {
    currentRestaurantWorkingDay = {
      closingHours: "00:00:00",
      day: "Tuesday" as DayInAWeek,
      open: 0,
      openingHours: "00:00:00",
      workingHoursId: 73,
    };
  }

  const currentTimeAmountInMinutes =
    currentDate.getHours() * 60 + currentDate.getMinutes();

  const openingRestuarantTimeAmountInMinutes =
    Number(currentRestaurantWorkingDay.openingHours.slice(0, 2)) * 60 +
    Number(currentRestaurantWorkingDay.openingHours.slice(3, 5));
  const closingRestuarantTimeAmountInMinutes =
    Number(currentRestaurantWorkingDay.closingHours.slice(0, 2)) * 60 +
    Number(currentRestaurantWorkingDay.closingHours.slice(3, 5));

  function isTodayOffDay(dateToCompare: Date) {
    if (restaurant.daysOff) {
      if (restaurant.daysOff?.length > 0) {
        for (var i = 0; i < restaurant.daysOff.length; i++) {
          const dayOff = new Date(restaurant.daysOff[i].dayOffDate);

          if (
            dayOff.getFullYear() +
              "-" +
              ("0" + (dayOff.getMonth() + 1)).slice(-2) +
              "-" +
              ("0" + dayOff.getDate()).slice(-2) ===
            dateToCompare.getFullYear() +
              "-" +
              ("0" + (dateToCompare.getMonth() + 1)).slice(-2) +
              "-" +
              ("0" + dateToCompare.getDate()).slice(-2)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  let todayIsOffDay = isTodayOffDay(currentDate);

  console.log("todayIsOffDay", todayIsOffDay);

  if (
    openingRestuarantTimeAmountInMinutes <= currentTimeAmountInMinutes &&
    currentTimeAmountInMinutes < closingRestuarantTimeAmountInMinutes &&
    currentRestaurantWorkingDay?.open &&
    !todayIsOffDay
  ) {
    openTime.currentlyOpen = true;
    openTime.message =
      "Restoran se zatvara u " + currentRestaurantWorkingDay.closingHours;
  } else {
    // find next open working day and skip day off
    for (var i = 1; i < 30; i++) {
      let nextDate = addDays(currentDate, i);

      console.log(nextDate, i);
      const todayIsDayOff = isTodayOffDay(nextDate);

      if (!todayIsDayOff) {
        let nextDateRestaurantWorkingDay: IWorkingHours =
          restaurant.workingHours.find(
            (workingDay) => workingDay.day === weekDays[nextDate.getDay()]
          ) || restaurant.workingHours[0];
        // this is in case some restaurant in database has no workinghours
        if (!nextDateRestaurantWorkingDay) {
          nextDateRestaurantWorkingDay = {
            closingHours: "00:00:00",
            day: "Tuesday" as DayInAWeek,
            open: 0,
            openingHours: "00:00:00",
            workingHoursId: 73,
          };
        }
        if (nextDateRestaurantWorkingDay.open) {
          openTime.currentlyOpen = false;
          openTime.message =
            "Restoran se otvara u " +
            weekDays[nextDate.getDay()] +
            " " +
            nextDateRestaurantWorkingDay.openingHours;
          break;
        }
      }
    }
  }

  return openTime;
}

export function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const params = useParams();
  console.log("RENDER RestaurantsPage RENDER RestaurantsPage RENDER!!");
  useEffect(() => {
    setLoading(true);

    api(
      "get",
      params.lid
        ? "/api/location/" + params.lid + "/restaurant"
        : "/api/restaurant",
      "user"
    )
      .then((res) => {
        if (res.status === "ok") {
          const restorani = res.data.map((restaurant: IRestaurant) => {
            const openTime = calculateOpenTime(restaurant);
            return { ...restaurant, openTime: openTime };
          });
          setRestaurants(restorani);
        } else {
          setError(res.data);
        }
      })
      .catch((res) => {
        setError(res.data);
      })
      .finally(() => setLoading(false));
  }, [params.lid]);

  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <p className="alert alert-danger">{error}</p>}

      <Container>
        <Row>
          {restaurants.map((restaurant) => {
            const photoFilePath: string =
              restaurant?.photos?.[0]?.filePath || "";
            return (
              <Col
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={"restaurant-" + restaurant.restaurantId}
                style={{ marginBottom: "30px" }}
              >
                <Link
                  to={
                    "/location/" +
                    params.lid +
                    "/restaurant/" +
                    restaurant.restaurantId
                  }
                  style={{
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Card style={{ width: "100%", maxHeight: "510px" }}>
                    {photoFilePath ? (
                      <Card.Img
                        variant="top"
                        src={
                          myConfig.apiBaseUrl +
                          "/assets/" +
                          path.dirname(photoFilePath) +
                          "/small-" +
                          path.basename(photoFilePath)
                        }
                        style={{
                          height: "200px",
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height: "200px",
                          width: "100%",
                          backgroundColor: "darkslategrey",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        No image
                      </div>
                    )}
                    <Card.Body>
                      <Card.Title
                        style={{
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {restaurant.name}
                      </Card.Title>
                      <Card.Text
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: "4",
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {restaurant.description || "No description..."}
                      </Card.Text>
                      <Alert
                        style={{
                          whiteSpace: "pre-wrap",
                        }}
                        variant={
                          restaurant.openTime.currentlyOpen
                            ? "success"
                            : "danger"
                        }
                      >
                        {restaurant.openTime.message}
                      </Alert>
                      <Button variant="primary">Detaljnije</Button>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
}

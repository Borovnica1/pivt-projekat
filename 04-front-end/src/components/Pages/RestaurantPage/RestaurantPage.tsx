import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Carousel,
  Col,
  Container,
  FloatingLabel,
  Form,
  Modal,
  Row,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { api } from "../../../api/api";
import IRestaurant, { ITableModel } from "../../../models/IRestaurant.model";
import * as path from "path-browserify";
import myConfig from "../../../config";
import "./RestaurantPage.sass";
import DatePicker from "react-datepicker";
import { addDays, subDays } from "date-fns";

import "react-datepicker/dist/react-datepicker.css";
import { IReservation } from "../../../models/IReservation.model";
import IWorkingHours from "../../../models/IWorkingHours.model";
import AuthStore from "../../../stores/AuthStore";
import IUser from "../../../models/IUser.model";
import { calculateOpenTime } from "../RestaurantsPage/RestaurantsPage";

export function RestaurantPage() {
  const [restaurant, setRestaurant] = useState<IRestaurant>();
  const [error, setError] = useState("");
  const [errorReservations, setErrorReservations] = useState("");
  const [errorMakeReservation, setErrorMakeReservation] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [tableChosen, setTableChosen] = useState<ITableModel>();
  const [selectedReservationDate, setSelectedReservationDate] =
    useState<Date>();

  const [show, setShow] = useState(false);
  const [toastShow, setToastShow] = useState(false);

  const [availableReservations, setAvailableReservations] = useState<string[]>(
    []
  );
  const [reservationTime, setReservationTime] = useState<string>("");
  const [reservationTimeDurations, setReservationTimeDurations] = useState<
    { value: number; time: string }[]
  >([]);
  const [reservationTimeDuration, setReservationTimeDuration] = useState<
    number | undefined
  >();
  const reservationTimeDurationRef = useRef<HTMLSelectElement>(null);
  const [role, setRole] = useState<
    "visitor" | "user" | "manager" | "administrator"
  >(AuthStore.getState().role);
  // to do: group some of these states into useReducer hook instead
  const [visitorFirstName, setVisitorFirstName] = useState("");
  const [visitorLastName, setVisitorLastName] = useState("");
  const [visitorPhoneNumber, setVisitorPhoneNumber] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");

  if (role === "user") {
    api("get", "/api/user/" + AuthStore.getState().id, "user").then((res) => {
      if (res.status === "ok") {
        setVisitorFirstName(res.data.forename);
        setVisitorLastName(res.data.surname);
        setVisitorEmail(res.data.email);
      }
    });
  }

  const handleMakeReservation = () => {
    // make a reservation
    console.log(
      "RESERVATION!!: ",
      selectedReservationDate,
      reservationTime,
      reservationTimeDuration
    );

    if (selectedReservationDate && reservationTime && reservationTimeDuration) {
      api(
        "post",
        "/api/restaurant/" +
          restaurant?.restaurantId +
          "/table/" +
          tableChosen?.tableId +
          "/reservation",
        "user",
        {
          firstName: visitorFirstName,
          lastName: visitorLastName,
          phoneNumber: visitorPhoneNumber ? visitorPhoneNumber : undefined,
          email: visitorEmail,
          reservationDate:
            selectedReservationDate?.getFullYear() +
            "-" +
            ("0" + (selectedReservationDate?.getMonth() + 1)).slice(-2) +
            "-" +
            ("0" + selectedReservationDate?.getDate()).slice(-2) +
            " " +
            reservationTime +
            ":00",
          reservationDuration: reservationTimeDuration,
          status: "pending",
        }
      )
        .then((res) => {
          if (res.status === "ok") {
            // reservation was successfull now we close modal make, show notification that it was successful and send email!!
            setToastShow(true);
            setShow(false);
          } else {
            console.log("make reservation error??? resresres:", res);
            setErrorMakeReservation(JSON.stringify(res.data));
          }
        })
        .catch((error) => {
          console.log("make reservation error???:", error);
          setErrorMakeReservation(error.data);
        });
    }
  };
  const handleClose = () => setShow(false);
  const handleShow = (table: ITableModel) => {
    setTableChosen(table);
    setReservationTime("");
    setReservationTimeDuration(undefined);
    setShow(true);
  };
  const dateChanged = async (date: Date) => {
    setErrorReservations("");
    const dateForSql =
      date.getFullYear() +
      "-" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + date.getDate()).slice(-2);
    let tableReservations: IReservation[] = await api(
      "get",
      "/api/table/" + tableChosen?.tableId + "/reservation/" + dateForSql,
      "user"
    )
      .then((res) => {
        if (res.status === "ok") return res.data;
        else return null;
      })
      .catch((error) => {
        setErrorReservations(error.data);
      });
    console.log(
      "izabran datum je: ",
      tableReservations,
      "asssss sql",
      dateForSql,
      "odabran dan datuma je: ",
      date.getDay()
    );
    tableReservations = tableReservations.filter(
      (tableReservation) => tableReservation.status === "confirmed"
    );

    let availableReservationsTimes = [];

    if (tableReservations && restaurant) {
      availableReservationsTimes =
        calculateAvailableReservationTimesForSpecificDay(
          date.getDay(),
          tableReservations,
          restaurant
        );
    }

    setAvailableReservations(availableReservationsTimes);
    setSelectedReservationDate(date);
  };

  function calculateAvailableReservationTimesForSpecificDay(
    dayIndex: number,
    tableReservations: IReservation[],
    restaurant2: IRestaurant
  ): any[] {
    const weekDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const restaurantWorkingDay: IWorkingHours =
      restaurant2.workingHours.find(
        (workingDay) => workingDay.day === weekDays[dayIndex]
      ) || restaurant2.workingHours[0];

    console.log(
      "working DAY JE: ",
      restaurantWorkingDay,
      "Table raeseservations: ",
      tableReservations,
      "dayIndex",
      dayIndex,
      weekDays[dayIndex]
    );

    if (!restaurantWorkingDay.open) {
      return [];
    }

    const tableReservationsTimes = tableReservations.map((reservation) => {
      const reservationDateTime = new Date(reservation.reservationDate);
      console.log(
        "reservationDateTime 11111: ",
        reservationDateTime,
        reservationDateTime.getHours(),
        reservationDateTime.getMinutes()
      );
      return {
        hours: reservationDateTime.getHours(),
        minutes: reservationDateTime.getMinutes(),
        duration: reservation.reservationDuration,
      };
    });

    const tableReservationsTimesSorted = tableReservationsTimes.sort(function (
      reservationA,
      reservationB
    ) {
      if (reservationA.hours === reservationB.hours) {
        // Price is only important when cities are the same
        return reservationA.minutes - reservationB.minutes;
      }
      return reservationA.hours > reservationB.hours ? 1 : -1;
    });
    console.log("tableReservationsTimesSorted", tableReservationsTimesSorted);

    const availableReservations = [];

    let [restaurantOpeningTimeInHours, restaurantOpeningTimeInMinutes]: [
      number,
      number
    ] = [
      +restaurantWorkingDay?.openingHours.slice(0, 2),
      +restaurantWorkingDay?.openingHours.slice(3, 5),
    ];
    let [restaurantClosingTimeInHours, restaurantClosingTimeInMinutes]: [
      number,
      number
    ] = [
      +restaurantWorkingDay?.closingHours.slice(0, 2),
      +restaurantWorkingDay?.closingHours.slice(3, 5),
    ];

    let reservationsTimesIndex = 0;
    console.log(
      "restaurantOpeningTimeInHours:",
      restaurantOpeningTimeInHours,
      "restaurantOpeningTimeInMinutes:",
      restaurantOpeningTimeInMinutes,
      "restaurantClosingTimeInHours:",
      restaurantClosingTimeInHours,
      "restaurantClosingTimeInMinutes:",
      restaurantClosingTimeInMinutes
    );
    while (
      restaurantOpeningTimeInHours < restaurantClosingTimeInHours ||
      restaurantOpeningTimeInMinutes < restaurantClosingTimeInMinutes
    ) {
      console.log(
        "restaurantOpeningTimeInHours:",
        restaurantOpeningTimeInHours,
        "restaurantOpeningTimeInMinutes:",
        restaurantOpeningTimeInMinutes
      );

      // here we are checking if we are overlapping with someone elses reservation and if we do we add that reservation duration and add it on our current time so we can continue to search for available times
      if (
        reservationsTimesIndex < tableReservationsTimesSorted.length &&
        restaurantOpeningTimeInHours ===
          tableReservationsTimesSorted[reservationsTimesIndex].hours &&
        restaurantOpeningTimeInMinutes ===
          tableReservationsTimesSorted[reservationsTimesIndex].minutes
      ) {
        const hoursToAdd = Math.floor(
          tableReservationsTimesSorted[reservationsTimesIndex].duration / 60
        );
        const minutesToAdd =
          tableReservationsTimesSorted[reservationsTimesIndex].duration % 60;

        restaurantOpeningTimeInHours += hoursToAdd;
        restaurantOpeningTimeInMinutes += minutesToAdd;
        // check after adding 30 minutes if minutes are 1 hour or more
        if (restaurantOpeningTimeInMinutes / 60 >= 1) {
          restaurantOpeningTimeInMinutes %= 60;
          restaurantOpeningTimeInHours += 1;
        }

        reservationsTimesIndex += 1;

        continue;
      }

      availableReservations.push(
        ("0" + restaurantOpeningTimeInHours).slice(-2) +
          ":" +
          ("0" + restaurantOpeningTimeInMinutes).slice(-2)
      );

      restaurantOpeningTimeInMinutes += 30;
      // check after adding 30 minutes if minutes are 1 hour or more
      if (restaurantOpeningTimeInMinutes / 60 >= 1) {
        restaurantOpeningTimeInMinutes %= 60;
        restaurantOpeningTimeInHours += 1;
      }
    }

    console.log("available reservation times: ", availableReservations);
    return availableReservations;
  }

  function reservationTimeDurationChanged(nes: any) {
    console.log("nes: ", nes);

    if (reservationTimeDurationRef) {
      console.log(
        "reservationTimeDurationRef: ",
        reservationTimeDurationRef?.current?.value
      );
    }

    setReservationTimeDuration(
      Number(reservationTimeDurationRef?.current?.value)
    );
  }

  const params = useParams();

  useEffect(() => {
    setLoading(true);

    api("get", "/api/restaurant/" + params.rid, "user")
      .then((res) => {
        if (res.status === "ok") {
          const openTime = calculateOpenTime(res.data);
          const restoran = { ...res.data, openTime: openTime };
          setRestaurant(restoran);
        } else {
          setError(res.data);
        }
      })
      .catch((res) => {
        setError(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  // everytime we choose reservation time we have to adjust how much time we can stay at that table depending on next reservation time and closing hours of restaurant. minimum time for every reservation is 30 min at least!
  useEffect(() => {
    const maxTableDurations: { value: number; time: string }[] = [];
    if (tableChosen) {
      let reservationTimeIndex = availableReservations.findIndex(
        (time) => time === reservationTime
      );
      let [nextReservationTimeHours, nextReservationTimeMinutes]: [
        number,
        number
      ] = [+reservationTime.slice(0, 2), +reservationTime.slice(3, 5)];
      let maxTableDurationTime = tableChosen.tableMaxReservationDuration;
      let tableDuration = 30;

      while (
        tableDuration <= maxTableDurationTime &&
        availableReservations[reservationTimeIndex] ===
          ("0" + nextReservationTimeHours).slice(-2) +
            ":" +
            ("0" + nextReservationTimeMinutes).slice(-2)
      ) {
        reservationTimeIndex += 1;
        nextReservationTimeMinutes += 30;
        if (nextReservationTimeMinutes / 60 >= 1) {
          nextReservationTimeHours += 1;
          nextReservationTimeMinutes %= 60;
        }

        maxTableDurations.push({
          value: tableDuration,
          time: tableDuration + " min",
        });
        tableDuration += 30;
        if (reservationTimeIndex >= availableReservations.length) break;
      }

      setReservationTimeDurations(maxTableDurations);
    }
  }, [reservationTime]);

  const photoFilePaths: string[] | undefined = restaurant?.photos?.map(
    (photo) => {
      return photo?.filePath;
    }
  );
  if (photoFilePaths) {
    photoFilePaths.forEach((photoFilePath) => {
      console.log(
        "photoFilePath::: ",
        "/assets/" +
          path.dirname(photoFilePath) +
          "/small-" +
          path.basename(photoFilePath)
      );
    });
  }

  return (
    <div style={{ marginBottom: "50px", position: "relative" }}>
      {loading && <p>Loading...</p>}
      {error && <p className="alert alert-danger">{error}</p>}

      {!loading && (
        <>
          <h2>{restaurant?.name}</h2>
          <Alert
            style={{
              whiteSpace: "pre-wrap",
            }}
            variant={restaurant?.openTime.currentlyOpen ? "success" : "danger"}
          >
            {restaurant?.openTime.message}
          </Alert>
          <Carousel style={{ height: "500px" }}>
            {restaurant?.photos?.map((photo) => (
              <Carousel.Item
                style={{ width: "100%", height: "100%" }}
                key={photo.filePath}
              >
                <img
                  className="d-block w-100"
                  src={
                    myConfig.apiBaseUrl +
                    "/assets/" +
                    path.dirname(photo.filePath) +
                    "/medium-" +
                    path.basename(photo.filePath)
                  }
                  alt={photo.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
          <p>{restaurant?.description || "No description..."}</p>
          {restaurant?.addresses?.map((address) => {
            return (
              <div key={address.addressId}>
                <h5>{address.streetAndNumber}</h5>
                <h6>telefon: {address.phoneNumber}</h6>
              </div>
            );
          })}
          <h5>Radno vreme restorana:</h5>
          <ul>
            {restaurant?.workingHours?.map((workingHoursDay) => {
              return (
                <div
                  key={
                    "workinghours-" +
                    restaurant?.restaurantId +
                    "-" +
                    workingHoursDay.workingHoursId
                  }
                >
                  {!workingHoursDay.open ? (
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
          <h4>Datumi kada restoran ne radi:</h4>
          <ul>
            {restaurant?.daysOff?.length
              ? restaurant?.daysOff?.map((dayOff) => {
                  const newDate = new Date(dayOff.dayOffDate);
                  return (
                    <Alert key={"dayoff-" + dayOff.dayOffId} variant="warning">
                      {newDate.getMonth() +
                        1 +
                        "/" +
                        newDate.getDate() +
                        "/" +
                        newDate.getFullYear() +
                        " Razlog: " +
                        dayOff.reason}
                    </Alert>
                  );
                })
              : "Nema datuma kada restoran ne radi!"}
          </ul>
          <h4>Stolovi:</h4>
          <Container>
            <Row xs={1} sm={2} md={3} lg={4} xxl={6}>
              {restaurant?.tables?.map((table) => (
                <Col style={{ padding: "10px" }} key={table.tableId}>
                  <h3>{table.tableName}</h3>
                  <h5>{"Broj mesta: " + table.tableCapacity}</h5>
                  <h5>
                    {"Max vreme rezervacije: " +
                      table.tableMaxReservationDuration +
                      "min"}
                  </h5>
                  <Button variant="primary" onClick={() => handleShow(table)}>
                    Slobodni termini
                  </Button>
                </Col>
              ))}
            </Row>
          </Container>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                Rezervacija stola: {tableChosen?.tableName}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div style={{ marginBottom: "10px" }}>
                <h5>1. Odaberite datum:</h5>
                <DatePicker
                  selected={selectedReservationDate}
                  onChange={(date: Date) => dateChanged(date)}
                  includeDateIntervals={[
                    {
                      start: subDays(new Date(), 1),
                      end: addDays(new Date(), 30),
                    },
                  ]}
                  excludeDates={restaurant?.daysOff?.map(
                    (dayOff) => new Date(dayOff.dayOffDate)
                  )}
                  placeholderText="Izaberite datum"
                />
              </div>
              <div>
                {errorReservations && (
                  <p className="alert alert-danger">{errorReservations}</p>
                )}
                {availableReservations.length === 0 &&
                  selectedReservationDate && (
                    <h5>Nema slobodnih termina za ovaj datum!</h5>
                  )}
                {availableReservations.length > 0 && (
                  <h5>2. Izaberite vreme rezervacije</h5>
                )}
                {availableReservations.length > 0 &&
                  availableReservations.map((availableReservation) => {
                    return (
                      <Badge
                        key={"availableReservation" + availableReservation}
                        onClick={() => setReservationTime(availableReservation)}
                        bg="info"
                        style={{
                          marginLeft: "5px",
                          marginRight: "5px",
                          cursor: "pointer",
                        }}
                      >
                        {availableReservation}
                      </Badge>
                    );
                  })}
                {reservationTime && (
                  <div>
                    Vreme rezervacije:{" "}
                    <Badge
                      bg="info"
                      style={{ marginLeft: "5px", marginRight: "5px" }}
                    >
                      {reservationTime}
                    </Badge>
                  </div>
                )}
              </div>
              {reservationTime && (
                <div style={{ marginTop: "10px" }}>
                  <h5>3. Izaberite vreme trajanja rezervacije</h5>
                  <Form.Select
                    aria-label="Default select example"
                    ref={reservationTimeDurationRef}
                    onChange={(e) => reservationTimeDurationChanged(e)}
                  >
                    <option>Duzine rezervacije</option>
                    {reservationTimeDurations.map((reservationTimeDuration) => {
                      return (
                        <option
                          key={
                            "reservationTimeDuration-" +
                            reservationTimeDuration.time
                          }
                          value={reservationTimeDuration.value}
                        >
                          {reservationTimeDuration.time}
                        </option>
                      );
                    })}
                  </Form.Select>
                </div>
              )}
              {selectedReservationDate &&
                reservationTime &&
                reservationTimeDuration && (
                  <div style={{ marginTop: "10px" }}>
                    <h5>4. Unesite podatke za rezervaciju</h5>
                    <FloatingLabel
                      controlId="floatingInput"
                      label="First name  (optional)"
                      className="mb-3 mt-3"
                    >
                      <Form.Control
                        type="text"
                        placeholder="Firstname"
                        defaultValue={visitorFirstName}
                        onChange={(e) => setVisitorFirstName(e.target.value)}
                      />
                    </FloatingLabel>
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Last name  (optional)"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        placeholder="Lastname"
                        defaultValue={visitorLastName}
                        onChange={(e) => setVisitorLastName(e.target.value)}
                      />
                    </FloatingLabel>
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Email address"
                      className="mb-3"
                    >
                      <Form.Control
                        type="email"
                        placeholder="name@example.com"
                        defaultValue={visitorEmail}
                        onChange={(e) => setVisitorEmail(e.target.value)}
                      />
                    </FloatingLabel>
                    <FloatingLabel
                      controlId="floatingPhoneNumber"
                      label="PhoneNumber (optional)"
                    >
                      <Form.Control
                        type="text"
                        placeholder="PhoneNumber"
                        onChange={(e) => setVisitorPhoneNumber(e.target.value)}
                      />
                    </FloatingLabel>
                    {errorMakeReservation && (
                      <Alert
                        style={{ marginTop: "10px", overflowWrap: "anywhere" }}
                        variant="warning"
                      >
                        {errorMakeReservation}
                      </Alert>
                    )}
                  </div>
                )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={handleMakeReservation}
                disabled={
                  selectedReservationDate &&
                  reservationTime &&
                  reservationTimeDuration &&
                  visitorEmail
                    ? false
                    : true
                }
              >
                Rezervisi sto
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
      <ToastContainer className="p-3" position="bottom-center">
        <Toast
          onClose={() => setToastShow(false)}
          show={toastShow}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>
            <Alert variant={"success"}>Reservation created successfully!</Alert>
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

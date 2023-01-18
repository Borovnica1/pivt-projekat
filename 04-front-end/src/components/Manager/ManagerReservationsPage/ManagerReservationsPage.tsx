import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useParams } from "react-router-dom";
import ManagerReservationList from "./ManagerReservationsList";
import { useState, useEffect } from "react";
import { IReservation } from "../../../models/IReservation.model";
import { api } from "../../../api/api";

export interface IReservationProps extends IReservation {
  tableName: string;
  restaurantName: string;
  restaurantId: number;
}

function ManagerReservationsPage() {
  const [reservations, setReservations] = useState<IReservationProps[]>([]);
  const params = useParams();
  const [key, setKey] = useState(params.filter as string);

  useEffect(() => {
    api("get", "/api/reservation", "manager").then((res) => {
      console.log("sta je ovo?", res.data);
      if (res.status === "ok") {
        setReservations(res.data);
      }
    });
  }, []);

  return (
    <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k as string)}
      className="mb-3"
    >
      <Tab eventKey="all" title="All">
        <ManagerReservationList
        setReservations={setReservations}
          setKey={setKey}
          itemsPerPage={10}
          filter="all"
          reservations={reservations}
        />
      </Tab>
      <Tab eventKey="pending" title="Pending">
        <ManagerReservationList
        setReservations={setReservations}
          setKey={setKey}
          itemsPerPage={10}
          filter="pending"
          reservations={reservations}
        />
      </Tab>
      <Tab eventKey="confirmed" title="Confirmed">
        <ManagerReservationList
        setReservations={setReservations}
          setKey={setKey}
          itemsPerPage={10}
          filter="confirmed"
          reservations={reservations}
        />
      </Tab>
    </Tabs>
  );
}

export default ManagerReservationsPage;

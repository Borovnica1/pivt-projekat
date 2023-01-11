import { useEffect, useState } from "react";
import {
  Alert,
  Col,
  Container,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { api } from "../../../api/api";
import ILocation from "../../../models/ILocation.model";

export function Locations() {
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api("get", "/api/location", "user")
      .then((res) => {
        if (res.status === "ok") {
          setLocations(res.data);
        } else {
          setError(res.data);
        }
      })
      .catch((res) => {
        setError(res.data);
      });
  }, []);

  return (
    <>
      {error && <p className="alert alert-danger">{error}</p>}

      <Container>
        {/* Stack the columns on mobile by making one full-width and the other half-width */}
        <Row>
          {locations.map((location) => {
            return (
              <OverlayTrigger
                key={"location-" + location.locationId}
                placement={"top"}
                overlay={
                  <Tooltip id={`tooltip-${"top"}`}>
                    <strong>{location.locationName}</strong>.
                  </Tooltip>
                }
              >
                <Col xs={12} sm={6} md={4} lg={3}>
                  <Link
                    to={"/restaurant/" + location.locationId}
                    style={{
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Alert
                      variant="info"
                      style={{ overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                      {"Restorani - " + location.locationName}
                    </Alert>
                  </Link>
                </Col>
              </OverlayTrigger>
            );
          })}
        </Row>
      </Container>
    </>
  );
}

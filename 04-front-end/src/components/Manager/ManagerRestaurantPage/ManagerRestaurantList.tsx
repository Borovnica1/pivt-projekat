import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { api } from "../../../api/api";
import IRestaurant from "../../../models/IRestaurant.model";
import * as path from "path-browserify";
import myConfig from "../../../config";

export function ManagerRestaurantList() {
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const params = useParams();
  useEffect(() => {
    setLoading(true);

    api("get", "/api/manager/restaurant", "manager")
      .then((res) => {
        if (res.status === "ok") {
          console.log("restauranrrss ", res.data);
          setRestaurants(res.data);
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
                    "/manager/restaurant/" + restaurant.restaurantId + "/edit"
                  }
                  style={{
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Card style={{ width: "100%", maxHeight: "410px" }}>
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
                          display: "-webkit-box",
                          WebkitLineClamp: "4",
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
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

                      <Button variant="primary">Izmeni</Button>
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

import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { api } from "../../../api/api";
import IRestaurant from "../../../models/IRestaurant.model";
import * as path from "path-browserify";
import myConfig from "../../../config";

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
                      <Card.Title>{restaurant.name}</Card.Title>
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

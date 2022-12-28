import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "../Menu/Menu";
import UserLocationPage from "../User/UserLocationPage/UserLocationPage";
import ContactPage from "../Pages/ContactPage/ContactPage";
import UserLocationList from "../User/UserLocationList/UserLocationList";
import UserLoginPage from "../User/UserLoginPage/UserLoginPage";

function Application() {
  return (
    <Container className="mt-4">
      <BrowserRouter>
        <Menu />
        <Routes>
          <Route path="/" element={<p>home page</p>}></Route>
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/auth/user/login" element={<UserLoginPage />} />
          <Route path="/locations" element={<UserLocationList />} />
          <Route path="/location/:id" element={<UserLocationPage />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default Application;

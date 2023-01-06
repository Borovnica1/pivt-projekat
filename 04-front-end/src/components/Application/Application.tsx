import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "../Menu/Menu";
import UserLocationPage from "../User/UserLocationPage/UserLocationPage";
import ContactPage from "../Pages/ContactPage/ContactPage";
import UserLocationList from "../User/UserLocationList/UserLocationList";
import UserLoginPage from "../User/UserLoginPage/UserLoginPage";
import AdminDashboard from "../Administrator/Dashboard/AdminDashboard";
import AdminLocationList from "../Administrator/Dashboard/AdminLocationList";
import AdminLocationAdd from "../Administrator/Dashboard/AdminLocationAdd";
import AdminManagerList from "../Administrator/Dashboard/AdminManagersList";
import AdminUserList from "../Administrator/Dashboard/AdminUserList";

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

          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route
            path="/admin/dashboard/location/list"
            element={<AdminLocationList />}
          />
          <Route
            path="/admin/dashboard/location/add"
            element={<AdminLocationAdd />}
          />

          <Route
            path="/admin/dashboard/manager/list"
            element={<AdminManagerList />}
          />
          <Route
            path="/admin/dashboard/user/list"
            element={<AdminUserList />}
          />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default Application;

import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "../Menu/Menu";
import UserLocationPage from "../User/UserLocationPage/UserLocationPage";
import UserLoginPage from "../User/UserLoginPage/UserLoginPage";
import AdminDashboard from "../Administrator/Dashboard/AdminDashboard";
import AdminLocationList from "../Administrator/Dashboard/AdminLocationList";
import AdminLocationAdd from "../Administrator/Dashboard/AdminLocationAdd";
import AdminManagerList from "../Administrator/Dashboard/AdminManagersList";
import AdminUserList from "../Administrator/Dashboard/AdminUserList";
import { Provider } from "react-redux";
import AuthStore from "../../stores/AuthStore";
import UserRegisterPage from "../User/UserRegisterPage/UserRegisterPage";
import AdministratorLoginPage from "../Administrator/AdministratorLoginPage/AdministratorLoginPage";
import ManagerLoginPage from "../Manager/ManagerLoginPage/ManagerLoginPage";
import ManagerRegisterPage from "../Manager/ManagerRegisterPage/ManagerRegisterPage";
import { LocationsPage } from '../Pages/LocationsPage/LocationsPage';
import { RestaurantsPage } from "../Pages/RestaurantsPage/RestaurantsPage";

function Application() {
  return (
    <Provider store={AuthStore}>
      <Container className="mt-4">
        <BrowserRouter>
          <Menu />
          <Routes>
            <Route path="/" element={<p>home page</p>}></Route>
            <Route path="/auth/user/register" element={<UserRegisterPage />} />
            <Route path="/auth/user/login" element={<UserLoginPage />} />
            <Route
              path="auth/manager/register"
              element={<ManagerRegisterPage />}
            />
            <Route path="auth/manager/login" element={<ManagerLoginPage />} />
            <Route
              path="/auth/administrator/login"
              element={<AdministratorLoginPage />}
            />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/location/:id" element={<UserLocationPage />} />
            <Route
              path="/location/:lid/restaurants"
              element={<RestaurantsPage />}
            />
            

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
    </Provider>
  );
}

export default Application;

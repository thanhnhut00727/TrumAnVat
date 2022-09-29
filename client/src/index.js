import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.3.0";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import AdminLayout from "layouts/Admin.js";
import Auth from "views/Auth";
import AuthContextProvider from "./contexts/AuthContext";
import Landing from "./layouts/Landing";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AuthContextProvider>
    <BrowserRouter>
      <Switch>
        <Route exact path={"/trum-an-vat"} component={Landing} />
        <Route exact path="/" component={Landing} />
        <Route
          exact
          path="/login"
          component={(props) => <Auth {...props} authRouter="login" />}
        />
        <Route
          exact
          path="/register"
          component={(props) => <Auth {...props} authRouter="register" />}
        />
        <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
      </Switch>
    </BrowserRouter>
  </AuthContextProvider>
);

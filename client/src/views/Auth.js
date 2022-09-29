import React, { useContext } from "react";
import Login from "components/Auth/Login";
import Register from "components/Auth/Register";
import { AuthContext } from "contexts/AuthContext";
import { Spinner } from "reactstrap";
import { Redirect } from "react-router-dom";
const Auth = ({ authRouter }) => {
  const {
    authState: { authLoading, isAuthenticated },
  } = useContext(AuthContext);
  let body;
  if (authLoading)
    body = (
      <div className="d-flex justify-content-center mt-2">
        <Spinner />
      </div>
    );
  else if (isAuthenticated) return <Redirect to={"/admin/dashboard"} />;
  else body = <div>{authRouter == "login" ? <Login /> : <Register />}</div>;
  return body;
};

export default Auth;

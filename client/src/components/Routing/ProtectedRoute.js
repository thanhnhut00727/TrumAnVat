import { Route, Redirect } from "react-router-dom";

import { useContext } from "react";

import { AuthContext } from "contexts/AuthContext";

const ProtecedRoute = ({ component: Component, ...rest }) => {
  const {
    authState: { isAuthenticated },
  } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...rest} {...props} />
        ) : (
          <Redirect to={"/login"} />
        )
      }
    />
  );
};
export default ProtecedRoute;

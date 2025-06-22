import React from "react";
import { Route, Routes } from "react-router-dom";
import { privateRoutes, publicRoutes } from "../../shared/config/routes";
import { ProtectedRoute } from "../../shared/config/ProtectedRoute";

const AppRouter = () => {
  return (
    <Routes>
      {publicRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<route.component />}
        />
      ))}
      {privateRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <ProtectedRoute>
              <route.component />
            </ProtectedRoute>
          }
        />
      ))}
    </Routes>
  );
};

export default AppRouter;

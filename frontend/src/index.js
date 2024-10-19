import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/fyp.scss";
import { Authenticated, LoignAuth } from "./utils/routeChekers";

import { ToastContainer } from "react-toastify";
import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import { Provider } from "react-redux";
import store from "./store/index.js";
import persistStore from "redux-persist/es/persistStore";
import { PersistGate } from "redux-persist/integration/react";

export const clearPersistedStore = () => {
  return new Promise((resolve, reject) => {
    persistor
      .purge()
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

let persistor = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route
            path="/admin/*"
            element={<LoignAuth element={<AdminLayout />} />}
          />
          <Route
            path="/student/*"
            element={<LoignAuth element={<AdminLayout />} />}
          />
          <Route
            path="/evaluator/*"
            element={<LoignAuth element={<AdminLayout />} />}
          />
          <Route
            path="/all/*"
            element={<LoignAuth element={<AdminLayout />} />}
          />
          <Route
            path="/auth/*"
            element={<Authenticated element={<AuthLayout />} />}
          />
          <Route
            path="/hod/*"
            element={<Authenticated element={<AdminLayout />} />}
          />

          <Route path="*" element={<Navigate to="/admin/index" replace />} />
        </Routes>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);

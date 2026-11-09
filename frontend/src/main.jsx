import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./utils/api.js";
import App from "./App.jsx";
import { Toaster } from "./components/ui/sonner.jsx";
import { Provider } from "react-redux";
import store, { persistor } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        
          <App />
       
        <Toaster />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
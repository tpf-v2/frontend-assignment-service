import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";

import * as Sentry from "@sentry/react";

if (process.env.REACT_APP_SENTRY_ENABLED == "true") {
  console.info("Sentry is enabled");
  Sentry.init({
    environment: process.env.REACT_APP_SENTRY_ENVIRONMENT,
    dsn: process.env.REACT_APP_SENTRY_DSN,
    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true
  });
} else {
  console.warn("Sentry is disabled");
}

ReactDOM.render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<div>Error</div>}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </PersistGate>
      </Provider>
    </Sentry.ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
);

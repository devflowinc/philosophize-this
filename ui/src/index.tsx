/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import { AppContainer } from "./App";
import { Route, Router } from "@solidjs/router";
import { SearchProvider } from "./SearchContext";

const root = document.getElementById("root");

render(
  () => (
    <Router>
      <Route
        path="/"
        component={() => (
          <SearchProvider>
            <AppContainer />
          </SearchProvider>
        )}
      />
    </Router>
  ),
  root!,
);

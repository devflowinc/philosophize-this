/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import { AppContainer } from "./App";
import { Route, Router } from "@solidjs/router";

const root = document.getElementById("root");

render(
  () => (
    <Router>
      <Route path="/" component={AppContainer} />
    </Router>
  ),
  root!
);

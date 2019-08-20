/* eslint-disable jsx-a11y/accessible-emoji */
import React from "react";
import { render } from "react-dom";
import Styles from "./Styles";
import FormNavigation from "./FormNavigation";
import Pages from "./pages";

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const onSubmit = async values => {
  await sleep(300);
  window.alert(JSON.stringify(values, 0, 2));
};

const App = () => (
  <Styles>
    <h1>React Final Form Example</h1>
    <h2>Wizard Form</h2>
    <a
      href="https://final-form.org/react"
      target="_blank"
      rel="noopener noreferrer"
    >
      Read Docs
    </a>
    <p>
      Notice the mixture of field-level and record-level (or <em>page-level</em>{" "}
      in this case) validation.
    </p>
    <FormNavigation
      initialValues={{ employed: true, stooge: "larry" }}
      onSubmit={onSubmit}
      pages={Pages}
    />
  </Styles>
);

render(<App />, document.getElementById("root"));

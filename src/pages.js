import React from "react";
import Wizard from "./Wizard";
import { Field } from "react-final-form";

const Error = ({ name }) => (
  <Field
    name={name}
    subscribe={{ touched: true, error: true }}
    render={({ meta: { touched, error } }) =>
      touched && error ? <span>{error}</span> : null
    }
  />
);

const required = value => (value ? undefined : "Required");

const validatePage1 = values => ({});

const validatePage2 = values => {
  const errors = {};
  if (!values.email) {
    errors.email = "WE REQUIRE YER EMAIL!!";
  }
  if (!values.favoriteColor) {
    errors.favoriteColor = "Required";
  }
  return errors;
};

const validatePage3 = values => {
  const errors = {};
  if (!values.toppings) {
    errors.toppings = "Required";
  } else if (values.toppings.length < 2) {
    errors.toppings = "Choose more";
  }
  return errors;
};

const validatePage4 = values => {
  const errors = {};
  if (!values.notes) {
    errors.notes = "Required";
  }
  return errors;
};

const page1 = (
  <Wizard.Page validate={validatePage1}>
    <div>
      <label>First Name</label>
      <Field
        name="firstName"
        component="input"
        type="text"
        placeholder="First Name"
        validate={required}
      />
      <Error name="firstName" />
    </div>
    <div>
      <label>Last Name</label>
      <Field
        name="lastName"
        component="input"
        type="text"
        placeholder="Last Name"
        validate={required}
      />
      <Error name="lastName" />
    </div>
  </Wizard.Page>
);

const page2 = (
  <Wizard.Page validate={validatePage2}>
    <div>
      <label>Email</label>
      <Field name="email" component="input" type="email" placeholder="Email" />
      <Error name="email" />
    </div>
    <div>
      <label>Favorite Color</label>
      <Field name="favoriteColor" component="select">
        <option />
        <option value="#ff0000">❤️ Red</option>
        <option value="#00ff00">💚 Green</option>
        <option value="#0000ff">💙 Blue</option>
      </Field>
      <Error name="favoriteColor" />
    </div>
  </Wizard.Page>
);

const page3 = (
  <Wizard.Page validate={validatePage3}>
    <div>
      <label>Employed?</label>
      <Field name="employed" component="input" type="checkbox" />
    </div>
    <div>
      <label>Toppings</label>
      <Field name="toppings" component="select" multiple>
        <option value="ham">🐷 Ham</option>
        <option value="mushrooms">🍄 Mushrooms</option>
        <option value="cheese">🧀 Cheese</option>
        <option value="chicken">🐓 Chicken</option>
        <option value="pineapple">🍍 Pinapple</option>
      </Field>
      <Error name="toppings" />
    </div>
  </Wizard.Page>
);

const page4 = (
  <Wizard.Page validate={validatePage4}>
    <div>
      <label>Best Stooge?</label>
      <div>
        <label>
          <Field name="stooge" component="input" type="radio" value="larry" />{" "}
          Larry
        </label>
        <label>
          <Field name="stooge" component="input" type="radio" value="moe" /> Moe
        </label>
        <label>
          <Field name="stooge" component="input" type="radio" value="curly" />{" "}
          Curly
        </label>
      </div>
    </div>
    <div>
      <label>Notes</label>
      <Field name="notes" component="textarea" placeholder="Notes" />
      <Error name="notes" />
    </div>
  </Wizard.Page>
);

let pages = [
  {
    component: page1,
    validate: validatePage1,
    isValid: false
  },
  {
    component: page2,
    validate: validatePage2,
    isValid: false
  },
  {
    component: page3,
    validate: validatePage3,
    isValid: false
  },
  {
    component: page4,
    validate: validatePage4,
    isValid: false
  }
];

const isValid = validationResult => {
  return validationResult && Object.keys(validationResult).length === 0;
};

const getById = index => {
  const matchedPage = pages[index];
  return {
    component: matchedPage.component,
    validation: values => isValid(matchedPage.validate(values))
  };
};

const totalPages = () => pages.length;

const isLastPage = currentPageId => {
  return currentPageId === totalPages() - 1;
};

const lastPageId = () => totalPages() - 1;

const updatePageValidity = (pageId, pageValidity) => {
  const page = pages[pageId];
  const updatedPage = {
    ...page,
    isValid: pageValidity
  };
  pages = Object.assign([], pages, { [pageId]: updatedPage });
};

export default {
  getById,
  totalPages,
  isLastPage,
  lastPageId,
  updatePageValidity
};

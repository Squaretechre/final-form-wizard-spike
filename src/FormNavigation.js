import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Form } from "react-final-form";

const FormNavigation = ({ pages, initialValues, onSubmit }) => {
  const [activePageId, setActivePageId] = useState(0);
  const [values, setValues] = useState(initialValues || {});

  useEffect(() => {
    return () => {
      pages.removeSubscribers();
    };
  });

  const next = values => {
    setActivePageId(Math.min(activePageId + 1, pages.lastPageId()));
    setValues(values);
  };

  const previous = () => setActivePageId(Math.max(activePageId - 1, 0));

  const validate = values => {
    const activePage = pages.getById(activePageId).component;
    return activePage.props.validate ? activePage.props.validate(values) : {};
  };

  const handleSubmit = values => {
    const isLastPage = pages.isLastPage(activePageId);
    if (isLastPage) {
      return onSubmit(values);
    } else {
      next(values);
    }
  };

  const isActivePageValid = values => {
    const activePage = pages.getById(activePageId);
    return activePage.validation(values);
  };

  const updatePageValidity = values => {
    pages.updatePageValidity(activePageId, isActivePageValid(values));
  };

  const activePage = pages.getById(activePageId);
  const isLastPage = pages.isLastPage(activePageId);

  return (
    <Form initialValues={values} validate={validate} onSubmit={handleSubmit}>
      {({ handleSubmit, submitting, values }) => {
        updatePageValidity(values);
        return (
          <form onSubmit={handleSubmit}>
            {activePage.component}
            <div className="buttons">
              {activePageId > 0 && (
                <button type="button" onClick={previous}>
                  « Previous
                </button>
              )}
              {!isLastPage && isActivePageValid(values) && (
                <button type="submit">Next »</button>
              )}
              {isLastPage && (
                <button type="submit" disabled={submitting}>
                  Submit
                </button>
              )}
            </div>
            <pre>{JSON.stringify(values, 0, 2)}</pre>
          </form>
        );
      }}
    </Form>
  );
};

FormNavigation.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default FormNavigation;

import React from "react";
import PropTypes from "prop-types";
import { Form } from "react-final-form";

export default class Wizard extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired
  };
  static Page = ({ children }) => children;

  constructor(props) {
    super(props);
    this.pages = this.props.pages;
    this.state = {
      activePageId: 0,
      values: props.initialValues || {}
    };
  }

  next = values =>
    this.setState(state => ({
      activePageId: Math.min(state.activePageId + 1, this.pages.lastPageId()),
      values
    }));

  previous = () =>
    this.setState(state => ({
      activePageId: Math.max(state.activePageId - 1, 0)
    }));

  validate = values => {
    const { activePageId } = this.state;
    const activePage = this.pages.getById(activePageId).component;
    return activePage.props.validate ? activePage.props.validate(values) : {};
  };

  handleSubmit = values => {
    const { onSubmit } = this.props;
    const { activePageId } = this.state;
    const isLastPage = this.pages.isLastPage(activePageId);
    if (isLastPage) {
      return onSubmit(values);
    } else {
      this.next(values);
    }
  };

  isActivePageValid = values => {
    const { activePageId } = this.state;
    const activePage = this.pages.getById(activePageId);
    return activePage.validation(values);
  };

  updatePageValidity = values => {
    const { activePageId } = this.state;
    const isActivePageValid = this.isActivePageValid(values);
    this.pages.updatePageValidity(activePageId, isActivePageValid);
  };

  render() {
    const { activePageId, values } = this.state;
    const activePage = this.pages.getById(activePageId);
    const isLastPage = this.pages.isLastPage(activePageId);
    return (
      <Form
        initialValues={values}
        validate={this.validate}
        onSubmit={this.handleSubmit}
      >
        {({ handleSubmit, submitting, values }) => {
          this.updatePageValidity(values);
          return (
            <form onSubmit={handleSubmit}>
              {activePage.component}
              <div className="buttons">
                {activePageId > 0 && (
                  <button type="button" onClick={this.previous}>
                    « Previous
                  </button>
                )}
                {!isLastPage && this.isActivePageValid(values) && (
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
  }
}

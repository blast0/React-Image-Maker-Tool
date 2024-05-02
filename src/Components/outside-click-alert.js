import React, { Component } from "react";
import PropTypes from "prop-types";
import { noop } from "lodash";

/**
 * Component that alerts if you click outside of it
 */
export default class OutsideClickAlert extends Component {
  constructor(props) {
    super(props);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside, true);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside, true);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  /**
   * Alert if clicked on outside of element
   */
  handleClickOutside(event) {
    const { excludeSelector } = this.props;
    // check if any exception is given for excluding any CSS selector
    let isOutsideClick = false;

    isOutsideClick = excludeSelector.every((item) => {
      // excludeSelector item is a CSS selector
      if (typeof item === "string") {
        if (event.target.closest(item)) {
          return false;
        } else {
          return true;
        }
      } else {
        // excludeSelector item is an HTML element
        if (
          !item?.contains(event.target) &&
          !this?.wrapperRef?.contains(event.target)
        ) {
          return true;
        } else {
          return false;
        }
      }
    });

    if (isOutsideClick) {
      this.props.onOutsideClick(event);
    }
  }

  render() {
    const { onOutsideClick, excludeSelector, ...otherProps } = this.props;

    return (
      <div
        className="OutsideClickAlert"
        ref={this.setWrapperRef}
        {...otherProps}
      >
        {this.props.children}
      </div>
    );
  }
}

OutsideClickAlert.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  onOutsideClick: PropTypes.func,
  excludeSelector: PropTypes.array,
};

OutsideClickAlert.defaultProps = {
  onOutsideClick: noop,
  excludeSelector: [],
};

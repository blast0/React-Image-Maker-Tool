import React, { Component } from "react";
// import { clone as _clone } from "lodash";
import PropTypes from "prop-types";

import "./css/range-slider.css";

class RangeSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      label,
      min,
      max,
      value,
      unitText,
      step,
      customSteps,
      error,
      errorMsg,
      errorDirection,
      disabled,
      updateRangeSliderValue,
      showValue,
      topRightValue,
      ...inputProps
    } = this.props;
    return (
      <div className="range-slider">
        {label ? (
          <div className={error ? `error-label` : `range-label`}>
            {label ? <div>{label}</div> : null}
            {showValue && topRightValue ? (
              <div className="value-right">
                {value} {unitText}
              </div>
            ) : null}
          </div>
        ) : null}
        <div className="range-slider-main">
          <input
            {...inputProps}
            className={
              disabled ? "range-slider__disabled" : "range-slider__range"
            }
            disabled={disabled}
            type="range"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => this.props.updateRangeSliderValue(e)}
          />
          {customSteps.length ? (
            <div>{customSteps?.find((el) => el.value === value)["label"]}</div>
          ) : showValue && !topRightValue ? (
            <div
              className={error ? `tooltip tooltip-${errorDirection}` : ""}
              data-tooltip={error ? errorMsg : ""}
            >{`${value} ${unitText}`}</div>
          ) : null}
        </div>
      </div>
    );
  }
}

RangeSlider.prototypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.number,
  unitText: PropTypes.string,
  step: PropTypes.number,
  updateRangeSliderValue: PropTypes.func,
  error: PropTypes.bool,
  errorMsg: PropTypes.string,
  disabled: PropTypes.bool,
  showValue: PropTypes.bool,
};

RangeSlider.defaultProps = {
  min: 0,
  max: 100,
  value: 5,
  unitText: "",
  step: 1,
  updateRangeSliderValue: (e) => {},
  customSteps: [],
  error: false,
  errorMsg: "",
  disabled: false,
  showValue: true,
};

export default RangeSlider;

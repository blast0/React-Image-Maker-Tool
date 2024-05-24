import React, { Component } from "react";
import GradientContext from "./gradient-context";
import { noop } from "lodash";
import PropTypes from "prop-types";
import ColorSelectorButton from "../Buttons/ColorSelectorBtn";

class GradientMaker extends Component {
  static contextType = GradientContext;
  constructor(props) {
    super(props);
    this.state = {
      switchToColor: props.config.colorStops.length < 2 ? true : false,
    };
  }

  render() {
    const {
      config,
      // previewHeight,
      // previewWidth,
      onGradientChange,
      opt,
      label,
      containerClass,
      containerStyle,
      controlStyle,
      // canChooseGradientType,
      isGradientAllowed,
      value,
    } = this.props;
    const containerStyles = {
      width: opt?.fullWidth
        ? "100%"
        : opt?.containerWidth
        ? opt?.containerWidth
        : "100%",
      ...containerStyle,
    };

    const controlStyles = {
      width: opt?.controlWidth ? opt?.controlWidth : "100%",
      ...controlStyle,
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "column",
    };
    console.log(this.state.switchToColor);
    return (
      <div
        className={`control-wrapper GradientMaker canvas-parent ${
          containerClass ?? ""
        }`}
        style={{ ...containerStyles }}
      >
        {label ? <label className="InputLabel">{label}</label> : null}
        <div style={{ ...controlStyles }}>
          {!isGradientAllowed || this.state.switchToColor ? (
            <ColorSelectorButton
              // theme={theme}
              onGradientChange={onGradientChange}
              onChange={(color) => {
                onGradientChange({
                  config: {
                    colorStops: [
                      {
                        color,
                        offset: 10,
                      },
                    ],
                    type: "linear",
                    angle: 45,
                  },
                  gradient: color,
                });
              }}
              value={config.colorStops[0].color}
              gradient={value}
              config={config}
              isGradientAllowed={true}
            />
          ) : null}
        </div>
        {isGradientAllowed ? (
          <span
            className="siteSettingsBtn"
            style={{
              marginTop: "5px",
            }}
            onClick={() => {
              this.setState({
                switchToColor: !this.state.switchToColor,
              });
            }}
          >
            {this.state.switchToColor ? "Use Gradient" : "Use Color"}
          </span>
        ) : null}
      </div>
    );
  }
}

GradientMaker.defaultProps = {
  previewHeight: 120,
  previewWidth: 200,
  onGradientChange: noop,
  opt: {},
  containerStyle: {},
  controlStyle: {},
  canChooseGradientType: true,
  isGradientAllowed: true,
  showSiteColorBtn: false,
};

GradientMaker.propTypes = {
  previewHeight: PropTypes.number,
  previewWidth: PropTypes.number,
  onGradientChange: PropTypes.func,
  opt: PropTypes.object,
  containerStyle: PropTypes.object,
  controlStyle: PropTypes.object,
  canChooseGradientType: PropTypes.bool,
};

export default GradientMaker;

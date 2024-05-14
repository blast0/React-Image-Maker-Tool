import React, { Component } from "react";
import GradientPreview from "./gradient-preview/gradient-preview";
import GradientContext, { GradientProvider } from "./gradient-context";
import GradientControls from "./gradient-controls/gradient-controls";
import { noop } from "lodash";
import PropTypes from "prop-types";
import ColorSelector from "../ColorSelector";

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
      previewHeight,
      previewWidth,
      onGradientChange,
      opt,
      label,
      containerClass,
      containerStyle,
      controlStyle,
      canChooseGradientType,
      isGradientAllowed,
      siteColorData,
      nativeElement,
      onOutsideClick,
      showSiteColorBtn,
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
            <ColorSelector
              color={config.colorStops[0].color}
              elemRef={nativeElement}
              onOutsideClick={onOutsideClick}
              siteColorData={siteColorData}
              showSiteColor={this.state.showSiteColor}
              showSiteColorBtn={showSiteColorBtn}
              showInPopup={false}
              controlStyle={{
                width: "35px",
                height: "18px",
                marginRight: "4px",
              }}
              optData={{ showSiteSettings: showSiteColorBtn }}
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
            />
          ) : isGradientAllowed && !this.state.switchToColor ? (
            <GradientProvider>
              <GradientPreview
                width={previewWidth}
                height={previewHeight}
                config={config}
                value={value}
              />
              <div className="controls-small slim-scroll">
                <GradientControls
                  config={config}
                  canChooseGradientType={canChooseGradientType}
                  onControlValueChange={(value) => {
                    onGradientChange({
                      config: value.config,
                      gradient: value.gradient,
                    });
                  }}
                />
              </div>
            </GradientProvider>
          ) : null}
        </div>
        {isGradientAllowed ? (
          <span
            className="siteSettingsBtn"
            style={{
              marginTop: "5px",
            }}
          >
            <a
              onClick={() => {
                this.setState({
                  switchToColor: !this.state.switchToColor,
                });
              }}
              style={{ cursor: "pointer" }}
            >
              {this.state.switchToColor ? "Use Gradient" : "Use Color"}
            </a>
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

import React, { Component } from "react";
import ColorBox from "../color-box";
import produce from "immer";
import PopupContainer from "../../PopMenu/popup-container";
import PopMenuPortal from "../../PopMenu/popmenu-portal";
import RangeSlider from "../../range-slider";
import RadioButtonGroup from "../../radio-button-group";
import RadioButton from "../../radio-button";
import { SketchPicker } from "react-color";
import { isUndefined, noop, orderBy } from "lodash";
import GradientContext, { GradientConsumer } from "../gradient-context";
import PropTypes from "prop-types";
// CSS
import "./gradient-controls.css";

class GradientControls extends Component {
  static contextType = GradientContext;
  constructor(props) {
    super(props);
    this.state = {
      showPicker: null,
      gradient: "",
      config: props.config,
    };
    this.colorBoxRefs = [];
  }

  componentDidMount() {
    const colorStops = this.props.config.colorStops;
    if (colorStops.length < 2) {
      this.addNewStop(colorStops.length, colorStops[0].color);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.config !== this.props.config) {
      this.setState({
        config: this.props.config,
      });
    }
  }

  hideColorPicker() {
    this.setState({
      showPicker: null,
    });
  }

  handleControlValueChange() {
    const { config, gradient } = this.state;
    this.props.onControlValueChange({
      config,
      gradient,
    });
  }

  addNewStop(index, color) {
    const { colorStops } = this.state.config;
    let newColorStop = this.alterColor(color, -10 * index);
    const _colorStops = produce(colorStops, (draftState) => {
      draftState.splice(index, 0, {
        color: newColorStop,
        offset: 100,
      });
    });
    let newcolorStops = this.resetOffsetIndex({
      ...this.state.config,
      colorStops: _colorStops,
    });
    this.setState(
      {
        config: {
          ...this.state.config,
          colorStops: newcolorStops,
        },
      },
      () => {
        this.generateGradient();
      }
    );
  }

  removeStop(index) {
    const { colorStops } = this.state.config;
    const _colorStops = produce(colorStops, (draftState) => {
      draftState.splice(index, 1);
    });
    let newcolorStops = this.resetOffsetIndex({
      ...this.state.config,
      colorStops: _colorStops,
    });
    this.setState(
      {
        config: {
          ...this.state.config,
          colorStops: newcolorStops,
        },
      },
      () => {
        this.generateGradient();
      }
    );
  }

  generateGradient() {
    const { colorStops, angle, type } = this.state.config;
    let gradient = "";
    colorStops.forEach((tab, index) => {
      gradient = gradient + `${tab.color} ${tab.offset}%,`;
    });
    gradient = gradient.slice(0, gradient.length - 1);
    switch (type) {
      case "linear":
        gradient = `linear-gradient(${angle}deg, ${gradient})`;
        break;
      case "radial":
        gradient = `radial-gradient(circle at center, ${gradient})`;
        break;
      default:
        break;
    }
    this.setState(
      {
        gradient: colorStops.length === 1 ? colorStops[0].color : gradient,
      },
      () => {
        this.handleControlValueChange();
        if (!isUndefined(this.context)) this.context.setGradientCode(gradient);
      }
    );
  }

  tabStopchangeHandler(key, value, index) {
    const { colorStops } = this.state.config;
    const _colorStops = produce(colorStops, (draftState) => {
      if (key === "color") {
        draftState[index][key] = this.evaluateRGBA(value);
      } else {
        draftState[index][key] = value;
      }
    });
    this.setState(
      {
        config: {
          ...this.state.config,
          colorStops: _colorStops,
        },
      },
      () => {
        this.generateGradient();
      }
    );
  }

  evaluateRGBA(rgba) {
    const rgbaHash = Object.keys(rgba);
    let _rgba = "";
    rgbaHash.forEach((c, index) => {
      _rgba = _rgba + rgba[c] + ",";
    });
    _rgba = _rgba.slice(0, _rgba.length - 1);
    _rgba = `rgba(${_rgba})`;
    return _rgba;
  }

  angleChangeHandler(angle) {
    this.setState(
      {
        config: {
          ...this.state.config,
          angle,
        },
      },
      () => {
        this.generateGradient();
      }
    );
  }

  gradientTypeChangeHandler(gradientType) {
    let type = "";
    switch (gradientType) {
      case "linear":
        type = "linear";
        break;
      case "radial":
        type = "radial";
        break;
      default:
        break;
    }
    this.setState(
      {
        config: {
          ...this.state.config,
          type,
        },
      },
      () => {
        this.generateGradient();
      }
    );
  }

  alterColor(hex, percentage) {
    if (hex?.[0] !== "#") {
      let rgbs = hex.split(",");
      let a = rgbs[0].match(/\d/g);
      a = parseInt(a.join(""));
      let k = rgbs[1].match(/\d/g);
      k = parseInt(k.join(""));
      let c = rgbs[2].match(/\d/g);
      c = parseInt(c.join(""));
      const amount = Math.floor((percentage / 100) * 255);
      const newR = this.increase0To255(a, amount);
      const newG = this.increase0To255(k, amount);
      const newB = this.increase0To255(c, amount);
      return this.convertRGBtoHex(newR, newG, newB);
    } else {
      const { r, g, b } = this.convertHexToRGB(hex);
      const amount = Math.floor((percentage / 100) * 255);
      const newR = this.increase0To255(r, amount);
      const newG = this.increase0To255(g, amount);
      const newB = this.increase0To255(b, amount);
      return this.convertRGBtoHex(newR, newG, newB);
    }
  }

  convertHexToRGB(hex) {
    // if (!isValidHex(hex)) return null;

    let strippedHex = hex.replace("#", "");

    if (strippedHex.length === 3) {
      strippedHex =
        strippedHex[0] +
        strippedHex[0] +
        strippedHex[1] +
        strippedHex[1] +
        strippedHex[2] +
        strippedHex[2];
    }

    const r = parseInt(strippedHex.substring(0, 2), 16);
    const g = parseInt(strippedHex.substring(2, 4), 16);
    const b = parseInt(strippedHex.substring(4, 6), 16);

    return {
      r,
      g,
      b,
    };
  }

  increase0To255(hex, amount) {
    return Math.min(255, Math.max(0, hex + amount));
  }

  convertRGBtoHex(r, g, b) {
    const firstPair = ("0" + r.toString(16)).slice(-2);
    const secondPair = ("0" + g.toString(16)).slice(-2);
    const thirdPair = ("0" + b.toString(16)).slice(-2);
    const hex = "#" + firstPair + secondPair + thirdPair;
    return hex;
  }

  resetOffsetIndex(config) {
    const { colorStops } = config;
    const offset = parseInt(100 / (colorStops.length - 1));
    let newColorStops = [];
    colorStops.forEach((item, index) => {
      newColorStops.push({
        color: item.color,
        offset: parseInt(offset * index),
      });
    });
    return newColorStops;
  }

  render() {
    const { showPicker, config } = this.state;
    const { canChooseGradientType } = this.props;
    const maxColorStops = 6;
    const minColorStops = 2;
    return (
      <GradientConsumer>
        {(props) => {
          return (
            <div className="GradientControls">
              {canChooseGradientType === true ? (
                <div>
                  {/* <RadioButtonGroup
                    groupId={"gradientStyle"}
                    groupLabel={"Gradient Style"}
                    inline={true}
                  > */}
                  <RadioButton
                    value={"linear"}
                    label={"Linear"}
                    checked={config.type === "linear"}
                    onChange={(e) => {
                      this.gradientTypeChangeHandler(e.target.value);
                    }}
                  />
                  <RadioButton
                    value={"radial"}
                    label={"Radial"}
                    checked={config.type === "radial"}
                    onChange={(e) => {
                      this.gradientTypeChangeHandler(e.target.value);
                    }}
                  />
                  {/* </RadioButtonGroup> */}
                </div>
              ) : null}
              <div className="GradientControls__angle">
                {config.type === "linear" ? (
                  <>
                    <div className="form-label">Angle</div>
                    <div className="linear">
                      <label className="offset">{config.angle}°</label>
                      <RangeSlider
                        min={0}
                        max={360}
                        showValue={false}
                        value={config.angle}
                        updateRangeSliderValue={(e) => {
                          this.angleChangeHandler(parseInt(e.target.value));
                        }}
                      />
                    </div>
                  </>
                ) : null}
              </div>
              <div className="form-label">Colors</div>
              <div className="ColorStops-scroll slim-scroll">
                {config.colorStops?.length
                  ? config.colorStops.map((stop, index) => {
                      return (
                        <div className="colorStops" key={index}>
                          <label className="offset">{stop.offset}%</label>
                          <div
                            className="colorbox-container"
                            style={{ border: "1px solid #f3f3f3" }}
                            ref={(ref) => {
                              this.colorBoxRefs[index] = ref;
                            }}
                            onClick={(e) => {
                              if (showPicker || showPicker === 0) {
                                this.setState({
                                  showPicker: null,
                                });
                              } else {
                                this.setState({
                                  showPicker: index,
                                });
                              }
                            }}
                          >
                            <ColorBox color={stop.color} />
                          </div>
                          <div className="slider">
                            <RangeSlider
                              min={0}
                              max={100}
                              step={1}
                              value={stop.offset}
                              showValue={false}
                              label={""}
                              unitText="%"
                              updateRangeSliderValue={(e) => {
                                this.tabStopchangeHandler(
                                  "offset",
                                  parseInt(e.target.value),
                                  index
                                );
                              }}
                            />
                          </div>
                          <div className="add-remove-buttons">
                            {config.colorStops.length < maxColorStops ? (
                              <div className="add">
                                <i
                                  className="icon-common icon-add-circle"
                                  onClick={(e) => {
                                    if (
                                      config.colorStops.length === maxColorStops
                                    ) {
                                      noop();
                                    } else {
                                      this.addNewStop(index + 1, stop.color);
                                    }
                                  }}
                                ></i>
                              </div>
                            ) : null}
                            {config.colorStops.length > minColorStops ? (
                              <div className="remove">
                                <i
                                  className="icon-common icon-cancel-circle"
                                  onClick={(e) => {
                                    if (
                                      config.colorStops.length === minColorStops
                                    ) {
                                      noop();
                                    } else {
                                      this.removeStop(index);
                                    }
                                  }}
                                ></i>
                              </div>
                            ) : null}
                          </div>
                          {showPicker === index && (
                            <PopMenuPortal>
                              <PopupContainer
                                nativeElement={this.colorBoxRefs[index]}
                                outsideClickExcludeSelectors={[
                                  ".chrome-picker-container",
                                ]}
                                onOutsideClick={() => this.hideColorPicker()}
                              >
                                <div className="chrome-picker-container">
                                  <SketchPicker
                                    color={stop.color}
                                    presetColors={[
                                      "#D0021B",
                                      "#F5A623",
                                      "#F8E71C",
                                      "#8B572A",
                                      "#7ED321",
                                      "#417505",
                                      "#BD10E0",
                                      "#9013FE",
                                      "#4A90E2",
                                      "#50E3C2",
                                      "#B8E986",
                                      "#000000",
                                      "#4A4A4A",
                                      "#9B9B9B",
                                      "#FFFFFF",
                                      "rgba(0,0,0,0)",
                                    ]}
                                    onChange={(e) => {
                                      this.tabStopchangeHandler(
                                        "color",
                                        e.rgb,
                                        index
                                      );
                                    }}
                                  />
                                </div>
                              </PopupContainer>
                            </PopMenuPortal>
                          )}
                        </div>
                      );
                    })
                  : null}
              </div>
            </div>
          );
        }}
      </GradientConsumer>
    );
  }
}

GradientControls.defaultProps = {
  canChooseGradientType: false,
  onControlValueChange: noop,
  gradient: "",
  config: {
    colorStops: [
      {
        color: "rgba(252, 165, 241, 1)",
        offset: 10,
      },
      {
        color: "rgba(181, 255, 255, 1)",
        offset: 70,
      },
    ],
    type: "linear",
    angle: 45,
  },
};

GradientControls.propTypes = {
  canChooseGradientType: PropTypes.bool,
  onControlValueChange: PropTypes.func,
  gradient: PropTypes.string,
  config: PropTypes.object,
};

export default GradientControls;

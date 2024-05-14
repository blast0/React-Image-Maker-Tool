import React, { Component } from "react";

const GradientContext = React.createContext();
export const GradientConsumer = GradientContext.Consumer;

export class GradientProvider extends Component {
  state = {
    gradient: "linear-gradient(45deg, rgba(252, 165, 241, 1) 10%,rgba(181, 255, 255, 1) 70%)",
    gradientConfig: {
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
    height: 200,
    width: 200,
    canvasRef: "",
    error: {
      width: 180,
      height: 180,
    },
  }

  setCanvas = (val) => {
    this.setState({
      canvasRef: val
    })
  }

  setGradientCode = (val) => {
    this.setState({
      gradient: val
    })
  }

  setGradientConfig = (val) => {
    this.setState({
      gradientConfig: val
    })
  }

  setHeight = (h) => {
    this.setState({
      height: h,
    })
  }

  setWidth = (w) => {
    this.setState({
      width: w
    })
  }

  render() {
    const { gradientConfig, height, width, gradient, canvasRef, error } = this.state;
    const { setGradientConfig, setHeight, setWidth, setGradientCode, setCanvas } = this;


    return (
      <GradientContext.Provider value={{
        gradient,
        gradientConfig,
        height,
        width,
        canvasRef,
        error,
        setGradientConfig,
        setHeight,
        setWidth,
        setGradientCode,
        setCanvas
      }}>
        {this.props.children}
      </GradientContext.Provider>
    )
  }
}

export default GradientContext;
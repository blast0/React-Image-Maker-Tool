import React from "react";
import PropTypes from "prop-types";
import manager from "./manager";
import "./style.css";

class SpinnerApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }
  componentDidMount() {
    manager.register(this.props.id, {
      showSpinner: this.show,
      hideSpinner: this.hide,
    });
  }
  show() {
    console.log("S");
    this.setState({ active: "active" });
  }

  hide() {
    this.setState({ active: "" });
  }

  render() {
    const { overlayProps } = this.props;
    return (
      <React.Fragment>
        {this.state.active ? (
          <div className="loading-overlay" style={overlayProps}>
            <span class="loader"></span>
          </div>
        ) : null}
      </React.Fragment>
    );
  }
}

SpinnerApp.propTypes = {
  id: PropTypes.string.isRequired,
  overlayProps: PropTypes.object,
};

SpinnerApp.defaultProps = {
  overlayProps: {},
};

export default SpinnerApp;

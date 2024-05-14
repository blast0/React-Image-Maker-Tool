import React from "react";

import EditableInput from "react-color/lib/components/common/EditableInput";

const isValidHex = (hex) => {
  if (hex === "transparent") {
    return true;
  }
  // disable hex4 and hex8
  const lh = String(hex).charAt(0) === "#" ? 1 : 0;
  return hex.length !== 4 + lh && hex.length < 7 + lh;
};

export class ChromeFields extends React.Component {
  constructor(props) {
    super();

    this.state = {
      view: "hex",
    };
  }

  handleChange = (data, e) => {
    if (data) {
      isValidHex(data) &&
        this.props.onChange(
          {
            hex: data,
            source: "hex",
          },
          e
        );
    }
  };

  showHighlight = (e) => {
    e.currentTarget.style.background = "#eee";
  };

  hideHighlight = (e) => {
    e.currentTarget.style.background = "transparent";
  };

  render() {
    const styles = {
      wrap: {
        paddingBottom: "10px",
        display: "flex",
      },
      fields: {
        flex: "1",
        display: "flex",
      },
      field: {
        width: "100%",
      },
      input: {
        fontSize: "11px",
        color: "#333",
        width: "100%",
        borderRadius: "2px",
        border: "none",
        boxShadow: "inset 0 0 0 1px #dadada",
        height: "21px",
        textAlign: "center",
      },
      label: {
        textTransform: "uppercase",
        fontSize: "11px",
        lineHeight: "11px",
        color: "#969696",
        textAlign: "center",
        display: "block",
        marginTop: "12px",
      },
    };

    let fields;
    if (this.state.view === "hex") {
      fields = (
        <div style={styles.fields} className="">
          <div style={styles.field}>
            <EditableInput
              style={{ input: styles.input, label: styles.label }}
              // label="hex"
              value={this.props.hex}
              onChange={this.handleChange}
            />
          </div>
        </div>
      );
    }

    return (
      <div style={styles.wrap} className="">
        {fields}
      </div>
    );
  }
}

ChromeFields.defaultProps = {
  view: "hex",
};

export default ChromeFields;

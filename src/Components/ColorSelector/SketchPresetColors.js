import React from "react";
import Swatch from "react-color/lib/components/common/Swatch";

export const SketchPresetColors = ({
  colors,
  onClick = () => {},
  onSwatchHover,
}) => {
  const styles = {
    colors: {
      margin: "0 -10px",
      padding: "10px 0 0 10px",
      borderTop: "1px solid #eee",
      display: "flex",
      flexWrap: "wrap",
      position: "relative",
    },
    swatchWrap: {
      width: "16px",
      height: "16px",
      margin: "0 10px 10px 0",
    },
    swatch: {
      borderRadius: "3px",
      boxShadow: "inset 0 0 0 1px rgba(0,0,0,.15)",
    },
  };

  const handleClick = (hex, e) => {
    onClick(
      {
        hex,
        source: "hex",
      },
      e
      // console.log("new color", hex)
    );
  };

  return (
    <div style={styles.colors}>
      {colors.map((colorObjOrString) => {
        const c =
          typeof colorObjOrString === "string"
            ? { color: colorObjOrString }
            : colorObjOrString;
        const key = `${c.color}${c.title || ""}`;
        return (
          <div key={key} style={styles.swatchWrap}>
            <Swatch
              {...c}
              style={styles.swatch}
              onClick={handleClick}
              onHover={onSwatchHover}
              focusStyle={{
                boxShadow: `inset 0 0 0 1px rgba(0,0,0,.15), 0 0 4px ${c.color}`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

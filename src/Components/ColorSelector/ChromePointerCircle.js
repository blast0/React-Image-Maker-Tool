import React from "react";

export const ChromePointerCircle = () => {
  const style = {
    width: '12px',
    height: '12px',
    borderRadius: '6px',
    boxShadow: 'inset 0 0 0 1px #fff',
    transform: 'translate(-6px, -6px)'
  };

  return <div style={style} />;
};

export default ChromePointerCircle;

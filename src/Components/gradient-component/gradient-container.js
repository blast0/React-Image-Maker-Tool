import React, { memo } from "react";
import { isEqual } from "lodash";
import PropTypes from "prop-types";
import GradientMaker from "./index";
import { convertGradientToConfig } from "../utilities";

const GradientContainer = ({
  showInPopup = true,
  canChooseGradientType = true,
  configKey,
  ...restProps
}) => {
  return (
    <GradientMaker
      {...restProps}
      outsideClickExcludeSelectors={[
        ".ddList",
        ".chrome-picker-container",
        ".Gradient-Icon",
      ]}
      label={restProps.label}
      controlStyle={{ ...restProps.controlStyle, gap: "20px" }}
      config={convertGradientToConfig(restProps.value)}
      onGradientChange={(val) =>
        restProps.onValueChange(val.gradient, configKey, val.config)
      }
    />
  );
};

GradientContainer.propTypes = {
  showInPopup: PropTypes.bool,
  canChooseGradientType: PropTypes.bool,
  restProps: PropTypes.object,
};

export default memo(GradientContainer, isEqual);

import React, { memo } from "react";
import { isEqual } from "lodash";
import PropTypes from "prop-types";
// import GradientMakerWithPopup from "./gradient-maker-with-popup";
import GradientMaker from "./gradient-component/index";
import { convertGradientToConfig } from "./utilities";
// import GradientMakerWithInput from "./gradient-maker-with-input";

const GradientContainer = ({ showInPopup, configKey, ...restProps }) => {
  return (
    <>
      {/* {showInPopup ? (
        <GradientMakerWithPopup
          {...restProps}
          controlStyle={{
            width: "24px",
            height: "24px",
            borderRadius: "3px",
          }}
          onValueChange={(val) =>
            restProps.onValueChange(val.gradient, configKey, val.config)
          }
        />
      ) : restProps?.opt?.showInput ? (
        <GradientMakerWithInput
          {...restProps}
          onValueChange={(val) =>
            restProps.onValueChange(val.gradient, configKey, val.config)
          }
        />
      ) : ( */}
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
      {/* )} */}
    </>
  );
};

GradientContainer.defaultProps = {
  showInPopup: true,
  canChooseGradientType: true,
  restProps: {},
};

GradientContainer.propTypes = {
  showInPopup: PropTypes.bool,
  canChooseGradientType: PropTypes.bool,
  restProps: PropTypes.object,
};

export default memo(GradientContainer, isEqual);

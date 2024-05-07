import React, { memo } from "react";
import { isEqual } from "lodash";

import ImageConfig from "./image-config";

const ImageContainer = ({ showInPopup, ...restProps }) => {
  return (
    <>
      <ImageConfig {...restProps} />
    </>
  );
};

export default memo(ImageContainer, isEqual);

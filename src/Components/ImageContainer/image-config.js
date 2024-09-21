import React from "react";
import TextInput from "../Input/text-input";
import { imgUrl } from "./placeHolderImage";

class ImageConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgContainerHeight: null,
      isUrlValid: false,
      isImageLoading: false,
      isImageError: false,
      showImageDropZone: true,
    };
    this.imageContainerRef = React.createRef(null);
    this.descriptionRef = React.createRef(null);
  }

  isImageUrlValid = (url) => {
    const img = new Image();
    img.src = url;
    return new Promise((resolve) => {
      img.onerror = () => resolve(false);
      img.onload = () => resolve(true);
    });
  };

  async checkImageUrl() {
    try {
      this.setState({
        isImageLoading: true,
        isImageError: false,
        isUrlValid: false,
      });
      // Skip checking if the input is empty
      if (!this.props.value) return;
      let value = await this.isImageUrlValid(this.props.value);
      if (value) {
        this.setState({ isUrlValid: value });
      } else {
        // Invalid URL
        this.setState({ isImageError: true });
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.setState({ isImageLoading: false });
    }
  }

  componentDidMount() {
    this._init();
  }

  componentDidUpdate(prevProps, prevState) {
    // check wheather image src is reachable when value changes
    if (prevProps.value !== this.props.value) {
      this.checkImageUrl();
    }
    if (prevProps.description !== this.props.description) {
      this.descriptionRef.current.innerHTML = this.props.description;
    }
  }

  _init() {
    // check wheather image src is reachable or not
    this.checkImageUrl();
    if (this.props.description) {
      this.descriptionRef.current.innerHTML = this.props.description;
    }
  }

  showImagePlaceholder() {
    const { showImageDropZone, isUrlValid, isImageError } = this.state;
    /**
     * Show Image Placeholder in either of these cases:
     * 1. showImageDropZone is enabled
     * 2. There's a valid URL in the input
     * 3. There's a URL but it's invalid
     */
    if (showImageDropZone || isUrlValid || (this.props.value && isImageError)) {
      return true;
    }
    return false;
  }

  render() {
    const {
      value: imgSrc,
      onChange,
      containerStyle,
      containerClass,
      tooltip,
      label,
      showImageDropZone,
      configKey,
      theme,
    } = this.props;
    const { isUrlValid, isImageLoading, isImageError } = this.state;

    return (
      <div
        className={`control-wrapper ${containerClass ?? ""}`}
        style={{
          ...containerStyle,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
        title={tooltip ? tooltip : label}
      >
        <div
          className="image-url"
          style={{
            display: "flex",
            width: "100%",
          }}
        >
          <TextInput
            label={label}
            theme={theme}
            placeholder="Image URL"
            value={imgSrc}
            onChange={(value) => onChange(value, configKey)}
            opt={{ containerWidth: "100%", controlWidth: "99%" }}
          />
          {imgSrc ? (
            <span
              className="del-icon"
              onClick={(e) => {
                e.stopPropagation();
                onChange("", configKey);
              }}
            >
              <i
                className="icon-delete"
                style={
                  theme === "light"
                    ? {
                        color: "#212529",
                        display: "flex",
                        flexDirection: "column-reverse",
                        width: "30px",
                        height: "44px",
                        fontSize: "large",
                      }
                    : {
                        color: "#fff",
                        display: "flex",
                        flexDirection: "column-reverse",
                        width: "30px",
                        height: "44px",
                        fontSize: "large",
                      }
                }
              ></i>
            </span>
          ) : null}
        </div>
        {isImageLoading ? (
          <div
            style={{
              height: "150px",
              width: "auto",
            }}
          >
            <InlineLoader />
          </div>
        ) : (
          <div
            className="control-wrapper"
            style={{
              width: "100%",
            }}
          >
            {this.showImagePlaceholder() ? (
              <React.Fragment>
                <div
                  className="image-container"
                  ref={this.imageContainerRef}
                  onClick={() => {}}
                  style={{
                    height: "150px",
                    width: "auto",
                    border: "1px solid black",
                    marginTop: "1px",
                  }}
                >
                  {imgSrc === "" ? (
                    <img
                      style={{
                        objectFit: "contain",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#fff",
                      }}
                      src={imgUrl}
                      width={"auto"}
                      alt="loading failed"
                    />
                  ) : null}
                  {/* Show the image */}
                  {isUrlValid ? (
                    <img
                      style={{
                        objectFit: "contain",
                        width: "100%",
                        height: "100%",
                      }}
                      src={imgSrc}
                      width={"auto"}
                      alt="loading failed"
                    />
                  ) : null}
                  {/* Show blank area with image icon */}
                  {showImageDropZone && !isUrlValid ? (
                    <span>
                      hello
                      <i className="icon-image"></i>
                    </span>
                  ) : null}
                  {/* Show blank area with error icon */}
                  {imgSrc && isImageError ? (
                    <span>
                      <img
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                          padding: "5px 0",
                        }}
                        src={
                          "https://icons.veryicon.com/png/o/business/new-vision-2/picture-loading-failed-1.png"
                        }
                        width={"auto"}
                        alt="loading failed"
                      />
                    </span>
                  ) : null}
                </div>
              </React.Fragment>
            ) : null}
          </div>
        )}
      </div>
    );
  }
}

function InlineLoader(props) {
  return (
    <div
      className="TextLabel icon-only image-loading-icon"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        background: "#f1f1f1",
      }}
    >
      <span class="loader"></span>
    </div>
  );
}

export default ImageConfig;

import { noop } from "lodash";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import OutsideClickAlert from "../outside-click-alert";

// Others
const containerStyle = {
  position: "absolute",
  visibility: "hidden",
  zIndex: -1,
};

class PopupContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      renderChild: false,
      containerOffset: {},
    };
  }

  componentDidMount() {
    this._init();
  }

  componentDidUpdate(prevProps, prevState) {
    // if popup-container is used from singleton components, then we have to re-calculate placement offsets if native element ref changes
    if (this.props.nativeElement !== prevProps.nativeElement) {
      this._init();
    }
  }

  async _init() {
    const { nativeElement } = this.props;
    if (!nativeElement) return;
    try {
      // calculate offset of clicked item and save to state
      const _containerOffset = await this.getContainerOffset(nativeElement);
      this.setState(
        {
          containerOffset: _containerOffset,
          renderChild: true,
        },
        () => {
          // send confirmation
          this.props.onChildRendered();
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  getContainerOffset(nativeElem) {
    const promise = new Promise((resolve, reject) => {
      try {
        // we have to render the menu virtually to calculate it's offset
        // - before actual rendering
        const nativeElemRect = nativeElem.getBoundingClientRect();
        // if element left is outside viewport at left, set menu left to 0
        const nativeElemLeft =
          nativeElemRect.left > 0 ? nativeElemRect.left : 0;

        const nativeElemOffsets = {
          top: nativeElemRect.bottom,
          left: nativeElemLeft,
        };

        if (this.props.detectChildElemWidth) {
          nativeElemOffsets["width"] = nativeElemRect.width;
        }

        // creates the hidden div appended to the document body
        const container = document.createElement("div");
        container.style = containerStyle;
        document.body.appendChild(container);
        // renders the React element into the hidden div
        const vChildStyle = {
          ...this.props.children?.props?.style,
          position: "absolute",
          ...nativeElemOffsets,
        };
        const vChild = React.cloneElement(this.props.children, {
          style: vChildStyle,
        });
        ReactDOM.render(vChild, container, () => {
          try {
            // Gets the element size
            const vChildElem = container.children[0];
            if (!vChildElem) {
              reject(
                new Error(
                  "PopupContainer: could not detect child element or it took longer time to render."
                )
              );
            }
            const vChildRect = vChildElem.getBoundingClientRect();

            // now we have to detect if the menu has enough space at all
            // - 4 directions (top | bottom | left | right) to ensure it
            // renders at proper position
            let offsetX = 0;
            let offsetY = 0;
            // by default we show the menu at right of the element, so check if there are enough space at right
            // check if element can be rendered at right side (origin at left-bottom corner of clicked item)
            const windowWidth =
              window.innerWidth || document.documentElement.clientWidth;
            if (vChildRect.right > windowWidth) {
              // element can not be rendered, so we have to change the origin to right-bottom corner of clicked element
              offsetX = vChildRect.width - nativeElemRect.width;
            }
            // gap to maintain when element's bottom is fixed and is placed at top of referenced element
            const topGap = 2;
            // we always show the menu at bottom, so check if there are enough space at right
            if (vChildRect.bottom > window.innerHeight) {
              // not enough space at bottom, try at top
              if (vChildRect.height > nativeElemRect.top) {
                // not enough space at top, place at center of viewport
                nativeElemOffsets.top = "10px";
                delete nativeElemOffsets.bottom;
              } else {
                // can be placed at top
                delete nativeElemOffsets.top;
                nativeElemOffsets.bottom =
                  window.innerHeight - nativeElemRect.top + topGap;
              }
            } else {
              // can be placed at bottom
              nativeElemOffsets.top = nativeElemRect.bottom + topGap;
            }

            // Removes the element and its wrapper from the document
            ReactDOM.unmountComponentAtNode(container);
            container.parentNode.removeChild(container);

            // return
            resolve({
              ...nativeElemOffsets,
              transform:
                "translateX(-" +
                offsetX +
                "px) translateY(-" +
                offsetY +
                "px) ",
            });
          } catch (error) {
            resolve();
          }
        });
      } catch (error) {
        reject(error);
      }
    });

    return promise;
  }

  render() {
    const { renderChild, containerOffset } = this.state;
    const { onOutsideClick, outsideClickExcludeSelectors, nativeElement } =
      this.props;
    return renderChild ? (
      <OutsideClickAlert
        onOutsideClick={(e) => onOutsideClick(e)}
        // merge nativeElement (ref element) and other exclude selectors
        // NOTE: we are passing nativeElement to excludeSelectors by default
        // - as clicking on the ref element should not be treated as an outside click
        excludeSelector={[...outsideClickExcludeSelectors, nativeElement]}
      >
        {React.cloneElement(this.props.children, {
          style: { position: "fixed", ...containerOffset },
        })}
      </OutsideClickAlert>
    ) : null;
  }
}

PopupContainer.defaultProps = {
  nativeElement: null,
  children: <></>,
  containerClass: "",
  detectChildElemWidth: false,
  outsideClickExcludeSelectors: [],
  onChildRendered: noop,
  onOutsideClick: noop,
};

export default PopupContainer;

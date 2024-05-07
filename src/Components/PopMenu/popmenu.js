import React, { Component } from "react";
import { noop } from "lodash";
import PropTypes from "prop-types";
import manager from "./manager";
import PopupContainer from "./popup-container";

// CSS
import "./popmenu.css";

// Others
const defaultConfig = {
  takeContainerWidth: false,
};

// interface for popmenu item
const IPopMenuItem = PropTypes.shape({
  title: PropTypes.string.isRequired,
  // for section title, value will be null
  value: PropTypes.string,
  selected: PropTypes.bool,
  type: PropTypes.oneOf(["link", "type"]),
  divider: PropTypes.bool,
  icon: PropTypes.string,
  cssClass: PropTypes.string,
  section: PropTypes.bool,
});

// interface for popmenu config
const IPopMenuConfig = {
  hasPopoverMenu: PropTypes.bool.isRequired,
  popoverData: PropTypes.arrayOf(IPopMenuItem),
  popoverStyle: PropTypes.object,
};

class PopMenuComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      config: {},
    };

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.sendCallback = noop;
    this.outsideClickCallback = noop;
  }

  componentDidMount() {
    // register compoennt instance with manager
    manager.register(this.props.id, {
      showMenu: this.show,
      hideMenu: this.hide,
    });
    // watch window resize event
    window.addEventListener("resize", this.onWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onWindowResize);
  }

  onWindowResize() {
    // hide PopMenu on window resize
    this.hide();
  }

  async show(nativeElement, config, cb = noop, cbOnOutsideClick = noop) {
    if (!nativeElement) return;
    // validate config and popoverData through PropTypes. errors will be displayed to console
    PropTypes.checkPropTypes(IPopMenuConfig, config, "config", "PopMenu");
    // save callback fn reference to local variable
    this.sendCallback = cb;
    this.outsideClickCallback = cbOnOutsideClick;
    this.nativeElementSelector = nativeElement;
    // calculate offset of clicked item and save to state
    const _config = Object.assign(defaultConfig, config);
    this.setState({ config: _config, visible: true });
  }

  hide() {
    this.setState({
      visible: false,
    });
  }

  /**
   * create list for popover items
   * @param {Array<Object>} items popover items
   * @param {Object} popoverStyle css style as key-value
   * @returns popover JSX
   */
  getPopoverItems(items, popoverStyle) {
    const listItems = [...items];
    return (
      <div className="pop-menu" style={{ ...popoverStyle }}>
        <ul className="menu slim-scroll">
          {listItems.length ? (
            listItems
              .filter((item) => {
                if (item.section) return true; // skip sections
                if (item.divider) return true; // skip dividers
                // show items which does not have a `visible` key defined or defined and set to true
                return (
                  typeof item["visible"] === "undefined" ||
                  item.visible === true
                );
              })
              .map((option, index) => {
                const {
                  divider,
                  section,
                  title,
                  icon,
                  cssClass,
                  selected,
                  type,
                } = option;
                if (divider) {
                  return <li key={index} className="divider"></li>;
                } else if (section) {
                  return (
                    <li
                      key={index}
                      className={`menu-item section-title text-strong`}
                    >
                      {title}
                    </li>
                  );
                } else {
                  return (
                    <li
                      key={index}
                      className={`menu-item ${selected ? "selected" : ""} ${
                        cssClass ?? ""
                      }`}
                      onClick={(e) => {
                        // let the event propagate to popover-container and let it handle the event
                        this.sendCallback(option);
                        this.hide();
                      }}
                    >
                      {type === "text" ? (
                        <>{title}</>
                      ) : (
                        <a href="" onClick={(e) => e.preventDefault()}>
                          {icon ? (
                            <i className={`menu-item-icon ${icon}`} />
                          ) : null}
                          {title}
                        </a>
                      )}
                    </li>
                  );
                }
              })
          ) : (
            <li className="menu-item">No options</li>
          )}
        </ul>
      </div>
    );
  }

  render() {
    const { visible } = this.state;
    const { hasPopoverMenu, popoverData, popoverStyle, takeContainerWidth } =
      this.state.config;

    return hasPopoverMenu && visible ? (
      <PopupContainer
        nativeElement={this.nativeElementSelector}
        outsideClickExcludeSelectors={[]}
        onOutsideClick={() => {
          // send outside click callback to parent
          this.outsideClickCallback();
          this.hide();
        }}
        detectChildElemWidth={takeContainerWidth}
      >
        {this.getPopoverItems(popoverData, popoverStyle)}
      </PopupContainer>
    ) : null;
  }
}

export default PopMenuComponent;

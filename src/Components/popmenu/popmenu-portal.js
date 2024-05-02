import { Component } from "react";
import ReactDOM from "react-dom";

class PopMenuPortal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      renderChildren: false,
    };
    const { containerClass, containerStyle } = this.props;
    // create a new div that wraps the component
    this.el = document.createElement("div");
    this.el.classList.add("PopMenuPortal");
    // set to 100% of viewport height and width
    for (let key in containerStyle) {
      this.el.style[key] = containerStyle[key];
    }
    if (containerClass) {
      this.el.classList.add(containerClass);
    }
    // get root element of portal
    this.portalRoot = document.getElementById("popmenu-container");
  }
  // 2: Append the element to the DOM when it mounts
  componentDidMount() {
    // The portal element is inserted in the DOM tree after
    // the Modal's children are mounted, meaning that children
    // will be mounted on a detached DOM node. If a child
    // component requires to be attached to the DOM tree
    // immediately when mounted, for example to measure a
    // DOM node, or uses 'autoFocus' in a descendant, add
    // state to Modal and only render the children when Modal
    // is inserted in the DOM tree.

    // https://reactjs.org/docs/portals.html
    this.portalRoot.appendChild(this.el);
    // portal is mounted, now render the children
    this.setState({ renderChildren: true });
  }
  // 3: Remove the element when it unmounts
  componentWillUnmount() {
    this.portalRoot.removeChild(this.el);
  }
  render() {
    // 4: Render the element's children in a Portal
    const { children } = this.props;
    const { renderChildren } = this.state;
    return renderChildren ? ReactDOM.createPortal(children, this.el) : true;
  }
}

PopMenuPortal.defaultProps = {
  containerClass: "",
  containerStyle: {},
};

export default PopMenuPortal;

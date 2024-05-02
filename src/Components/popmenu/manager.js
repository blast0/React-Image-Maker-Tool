import { find } from "lodash";

const defaultMenuId = "root";
function Manager() {
  this.show = () => {};
  this.hide = () => {};
  this.refMenus = {};

  this.showMenu = (nativeEl, config, cb, cbOnOutsideClick) => {
    // find the reference of menu having id = menuId
    const _ref = find(this.refMenus, (menu) => menu.id === defaultMenuId);
    // if ref to menu exists
    if (_ref) {
      return _ref.fn.show(nativeEl, config, cb, cbOnOutsideClick);
    }
  };

  this.hideMenu = () => {
    // find the reference of menu having id = menuId
    const _ref = find(this.refMenus, (menu) => menu.id === defaultMenuId);
    // if ref to menu exists
    if (_ref) {
      return _ref.fn.hide();
    }
  };

  this.register = (menuId, { showMenu, hideMenu }) => {
    console.log(menuId);
    const newRef = {
      id: menuId,
      fn: {
        show: showMenu,
        hide: hideMenu,
      },
    };
    // store ref to this menu
    this.refMenus[menuId] = newRef;
  };

  return this;
}
const manager = new Manager();
export default manager;

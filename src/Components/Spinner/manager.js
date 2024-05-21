import { find } from "lodash";

function Manager() {
  this.show = () => {};
  this.hide = () => {};
  this.refSpinners = {};
  this.defaultSpinnerId = "root";

  this.showSpinner = (spinnerId = this.defaultSpinnerId) => {
    // find the reference of spinner having id = spinnerId
    const _ref = find(this.refSpinners, (spinner) => spinner.id === spinnerId);
    // if ref to spinner exists
    if (_ref) {
      return _ref.fn.show();
    }
  };

  this.hideSpinner = (spinnerId = this.defaultSpinnerId) => {
    // find the reference of spinner having id = spinnerId
    const _ref = find(this.refSpinners, (spinner) => spinner.id === spinnerId);
    // if ref to spinner exists
    if (_ref) {
      return _ref.fn.hide();
    }
  };

  this.register = (spinnerId, { showSpinner, hideSpinner }) => {
    const newRef = {
      id: spinnerId,
      fn: {
        show: showSpinner,
        hide: hideSpinner,
      },
    };
    // store ref to this spinner
    this.refSpinners[spinnerId] = newRef;
  };

  return this;
}

let manager = new Manager();
export default manager;

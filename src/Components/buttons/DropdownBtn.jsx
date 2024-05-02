import Dropdown from "react-bootstrap/Dropdown";

function DropdownButton(props) {
  const { btnText, leftIcon, rightIcon, buttons, onDropBtnClick, variant } =
    props;
  // console.log(leftIcon);
  return (
    <Dropdown
      onClick={() => {
        if (buttons.length === 0) {
          onDropBtnClick();
        }
      }}
    >
      <Dropdown.Toggle variant={variant} id="dropdown-basic">
        {leftIcon ? <i className={"icon-common " + leftIcon}></i> : null}
        {btnText}
        {rightIcon ? <i className={"icon-common " + rightIcon}></i> : null}
      </Dropdown.Toggle>
      {buttons.length > 0 ? (
        <Dropdown.Menu>
          {buttons.map((item) => {
            return (
              <Dropdown.Item
                href="#/action"
                onClick={() => {
                  onDropBtnClick(item);
                }}
              >
                {item.leftIcon ? (
                  <i
                    style={{ marginRight: "10px" }}
                    className={"icon-common " + item.leftIcon}
                  ></i>
                ) : null}
                {item.btnText}
                {item.rightIcon ? (
                  <i
                    style={{ marginLeft: "10px" }}
                    className={"icon-common " + item.rightIcon}
                  ></i>
                ) : null}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      ) : null}
    </Dropdown>
  );
}
DropdownButton.defaultProps = {
  name: "Button",
  buttons: [],
  onBtnClick: () => {},
  variant: "success",
};
export default DropdownButton;

import Dropdown from "react-bootstrap/Dropdown";

const DropdownButton = (props) => {
  const {
    btnText,
    leftIcon,
    rightIcon,
    buttons,
    onDropBtnClick,
    variant,
    btnHeight,
  } = props;
  return (
    <Dropdown
      onClick={() => {
        if (buttons.length === 0) {
          onDropBtnClick();
        }
      }}
      style={{
        border: "1px solid #f1f1f1",
        borderRadius: "10px",
      }}
    >
      <Dropdown.Toggle
        variant={variant}
        id="dropdown-basic"
        style={{
          width: "100%",
          height: btnHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {leftIcon ? <i className={"icon-common " + leftIcon}></i> : null}
        {btnText}
        {rightIcon ? <i className={"icon-common " + rightIcon}></i> : null}
      </Dropdown.Toggle>
      {buttons.length > 0 ? (
        <Dropdown.Menu style={{ width: "100%" }}>
          {buttons.map((item, index) => {
            return (
              <Dropdown.Item
                href="#/action"
                onClick={() => {
                  onDropBtnClick(item);
                }}
                key={"dropbtn" + index}
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
};
DropdownButton.defaultProps = {
  name: "Button",
  buttons: [],
  onBtnClick: () => {},
  variant: "success",
  btnHeight: "100%",
};
export default DropdownButton;

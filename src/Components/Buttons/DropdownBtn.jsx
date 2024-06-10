import Dropdown from "react-bootstrap/Dropdown";

const DropdownButton = (props) => {
  const {
    // name = "Button",
    // onBtnClick = () => {},
    buttons = [],
    variant = "success",
    btnHeight = "100%",
    btnText,
    leftIcon,
    rightIcon,
    onDropBtnClick,
    label,
    theme,
  } = props;
  return (
    <div
    // style={{
    //   padding: "10px 0",
    // }}
    >
      {label ? (
        <label
          style={
            theme !== "light"
              ? {
                  color: "#fff",
                }
              : {}
          }
          className="InputLabel"
        >
          {label}
        </label>
      ) : null}
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
                  onClick={() => {
                    onDropBtnClick(item);
                  }}
                  key={"dropbtn" + index}
                >
                  {item.leftIcon ? (
                    <i
                      style={{ marginRight: "20px" }}
                      className={"icon-common " + item.leftIcon}
                    ></i>
                  ) : null}
                  {item.btnText}
                  {item.rightIcon ? (
                    <i
                      style={{ marginLeft: "20px" }}
                      className={"icon-common " + item.rightIcon}
                    ></i>
                  ) : null}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        ) : null}
      </Dropdown>
    </div>
  );
};

export default DropdownButton;

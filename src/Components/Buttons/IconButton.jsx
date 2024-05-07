import Button from "react-bootstrap/Button";

function IconButton(props) {
  const {
    btnClick,
    rightIcon,
    leftIcon,
    //  variant, variants,
    btnText,
    theme,
  } = props;
  return (
    <>
      <Button
        variant={"outline-" + theme !== "light" ? "light" : "dark"}
        onClick={() => btnClick()}
        style={{
          border: "1px solid #f1f1f1",
        }}
      >
        <i
          stye={theme === "light" ? { color: "#fff" } : { color: "#212529" }}
          className={`icon-common ${leftIcon}`}
        ></i>
        <span
          style={
            btnText
              ? {
                  margin: "5px 0",
                }
              : {}
          }
        >
          {btnText}
        </span>
        <i className={`icon-common ${rightIcon}`}></i>
      </Button>
    </>
  );
}
IconButton.defaultProps = {
  variant: "dark",
  variants: [
    "secondary",
    "success",
    "warning",
    "danger",
    "info",
    "light",
    "dark",
    "Link",
  ],
  btnClick: () => {},
};

export default IconButton;

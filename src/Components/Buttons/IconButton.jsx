import Button from "react-bootstrap/Button";

function IconButton({
  variant = "dark",
  variants = [
    "secondary",
    "success",
    "warning",
    "danger",
    "info",
    "light",
    "dark",
    "Link",
  ],
  btnClick = () => {},
  rightIcon,
  leftIcon,
  btnText,
  theme,
  title,
}) {
  return (
    <>
      <Button
        variant={"outline-" + theme !== "light" ? "light" : "dark"}
        onClick={() => btnClick()}
        style={{
          border: "1px solid #f1f1f1",
          padding: "2px 10px",
        }}
        title={title}
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

export default IconButton;

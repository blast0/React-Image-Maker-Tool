import { useState } from "react";
import "./App.css";
import Designer from "./Components/ImageEditor/imageEditor";
import NavbarApp from "./Components/navbar/navbar";
import Spinner from "./Components/spinner/spinner";
function App() {
  const [theme, setTheme] = useState("light");
  return (
    <div
      className="App"
      id="popmenu-container"
      style={{
        zIndex: 100,
        position: "fixed",
      }}
    >
      <NavbarApp
        onThemeChange={(theme) => {
          setTheme(theme);
        }}
      />
      <Designer theme={theme} />
      <Spinner id="root" overlayProps={{ position: "fixed" }} />
    </div>
  );
}

export default App;

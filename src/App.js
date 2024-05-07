import { useState } from "react";
import "./App.css";
import Designer from "./Components/ImageEditor";
import NavbarApp from "./Components/Navbar/navbar";
import Spinner from "./Components/Spinner/spinner";
function App() {
  const [theme, setTheme] = useState("dark");
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
        themed={theme}
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

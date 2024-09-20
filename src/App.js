import { useState } from "react";
import ImageMaker from "./Components/ImageEditor";
import NavbarApp from "./Components/Navbar/navbar";
import "./App.css";
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
      <ImageMaker theme={theme} />
    </div>
  );
}

export default App;

import { useState, useEffect } from "react";
import "./HeaderSection.css";
import LogoLight from "../assets/rec-logo-light.png";
import LogoDark from "../assets/rec-logo-dark.png";

function HeaderSection() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      setTheme(currentTheme || "light");
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const logoSrc = theme === "dark" ? LogoLight : LogoDark;

  return (
    <section className="header-section">
      <div className="logo-container">
        {/* <img src={logoSrc} alt="Logo" className="logo" /> */}
        <img src={logoSrc}
              alt="Logo"
              style={{
                height: "100%",       // fill the container height
                width: "auto",        // maintain aspect ratio
                objectFit: "contain", // scale without cropping
                display: "block",
              }}
        />
      </div>
    </section>
  );
}

export default HeaderSection;

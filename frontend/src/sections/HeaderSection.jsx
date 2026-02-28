import { useState, useEffect } from "react";
import "./HeaderSection.css";
import LogoLight from "../assets/big-logo-light.png";
import LogoDark from "../assets/big-logo-dark.png";

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

  const logoSrc = theme === "dark" ? LogoDark : LogoLight;

  return (
    <section className="header-section">
      <div className="logo-container">
        <img src={logoSrc} alt="Logo" className="logo" />
      </div>
    </section>
  );
}

export default HeaderSection;

import React from "react";
import CrashOutPage from "./pages/CrashOutPage.jsx";
import DynamicBackground from "./components/background/DynamicBackground";

// Keep Shirley’s style imports so the app still looks correct
import "./App.css";
import "./styles/globals.css";

export default function App() {
  return (
    <>
      <DynamicBackground />
      <div className="appShell">
        <CrashOutPage />
      </div>
    </>
  );
}
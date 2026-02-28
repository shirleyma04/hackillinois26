import CrashOutPage from "./pages/CrashOutPage.jsx";
import "./App.css";
import "./styles/globals.css";
import DynamicBackground from "./components/background/DynamicBackground.jsx";

function App() {
  return (
    <>
      <DynamicBackground />
      <div className="appShell">
        <CrashOutPage />
      </div>
    </>
  );
}

export default App;

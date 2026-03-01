import HeaderSection from "../sections/HeaderSection";
import InputSection from "../sections/InputSection";
import GenerateSection from "../sections/GenerateSection";
import OutputSection from "../sections/OutputSection";
import "./CrashOutPage.css";

function CrashOutPage() {
  return (
    <div>
      <HeaderSection />
      <main className="page-shell">
        <InputSection />
        <GenerateSection />
        <OutputSection />
      </main>
    </div>
  );
}

export default CrashOutPage;

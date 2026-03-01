import HeaderSection from "../sections/HeaderSection";
import TargetSection from "../sections/TargetSection";
import InputSection from "../sections/InputSection";
import GenerateSection from "../sections/GenerateSection";
import StyleSection from "../sections/StyleSection";
import TransformSection from "../sections/TransformSection";
import FooterSection from "../sections/FooterSection";
import "./CrashOutPage.css";

function CrashOutPage() {
  return (
    <div>
      <HeaderSection />
      <main className="page-shell">
        {/* <TargetSection /> */}
        <InputSection />
        <GenerateSection />
        {/* <StyleSection /> */}
        {/* <TransformSection /> */}
        {/* <FooterSection /> */}
      </main>
    </div>
  );
}

export default CrashOutPage;

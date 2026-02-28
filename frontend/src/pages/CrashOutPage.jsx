import HeaderSection from '../sections/HeaderSection'
import TargetSection from '../sections/TargetSection'
import InputSection from '../sections/InputSection'
import StyleSection from '../sections/StyleSection'
import TransformSection from '../sections/TransformSection'
import OutputSection from '../sections/OutputSection'
import FooterSection from '../sections/FooterSection'

function CrashOutPage() {
  return (
    <main className="page-shell">
      <HeaderSection />
      <TargetSection />
      <InputSection />
      <StyleSection />
      <TransformSection />
      <OutputSection />
      <FooterSection />
    </main>
  )
}

export default CrashOutPage
import React from 'react'
import CrashOutPage from './pages/CrashOutPage'
import DynamicBackground from './components/background/DynamicBackground'

export default function App() {
  return (
    <>
      <DynamicBackground />
      <div className="appShell">
        <CrashOutPage />
      </div>
    </>
  )
}

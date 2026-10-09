import './index.css'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import SensoryDelightBar from './components/SensoryDelightBar'
import WasteToTasteSection from './components/WasteToTasteSection'
import FlavorTastingRoom from './components/FlavorTastingRoom'
import SocialProofSection from './components/SocialProofSection'
import OrderBuilderSection from './components/OrderBuilderSection'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-[#FFFDF7]">
      <Navbar />
      <main>
        <HeroSection />
        <SensoryDelightBar />
        <WasteToTasteSection />
        <FlavorTastingRoom />
        <SocialProofSection />
        <OrderBuilderSection />
      </main>
      <Footer />
    </div>
  )
}

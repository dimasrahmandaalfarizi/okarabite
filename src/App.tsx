import './index.css'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import SensoryDelightBar from './components/SensoryDelightBar'
import WasteToTasteSection from './components/WasteToTasteSection'
import FlavorTastingRoom from './components/FlavorTastingRoom'
import CustomerReviewSection from './components/CustomerReviewSection'
import OrderBuilderSection from './components/OrderBuilderSection'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-[#FFFDF7] overflow-x-hidden text-[#211814]">
      <Navbar />
      <main>
        {/* 1. Hero Showcase */}
        <HeroSection />

        {/* 2. Sensory Advantage Bar & Highlights */}
        <SensoryDelightBar />

        {/* 3. Upcycled Origin Story */}
        <WasteToTasteSection />

        {/* 4. Artisanal Flavor Tasting Room & Benchmarks */}
        <FlavorTastingRoom />

        {/* 5. Customer Reviews Section (Kosong secara default, interaktif buat diisi) */}
        <CustomerReviewSection />

        {/* 6. Direct WhatsApp Order Builder */}
        <OrderBuilderSection />
      </main>
      <Footer />
    </div>
  )
}

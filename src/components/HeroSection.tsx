import { useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore, FLAVORS, type FlavorId } from '../store'
import Interactive3DBiscuit from './Interactive3DBiscuit'

interface FloatingMarker {
  label: string
  sublabel: string
  x: string
  y: string
  blur: string
  scale: number
  delay: number
}

// Floating organic specification notes (Depth-of-Field bokeh without cartoon emojis)
const INGREDIENTS_DATA: Record<FlavorId, FloatingMarker[]> = {
  original: [
    { label: 'OKARA 100%', sublabel: 'Upcycled Soy Pulp', x: '12%', y: '22%', blur: 'blur-[1.5px]', scale: 1.0, delay: 0 },
    { label: 'ARTISAN CRUMB', sublabel: 'Golden Butter Base', x: '84%', y: '25%', blur: 'blur-none', scale: 0.95, delay: 0.8 },
    { label: 'AREN EXTRACT', sublabel: 'Organic Palm Nectar', x: '16%', y: '68%', blur: 'blur-[2.5px]', scale: 0.85, delay: 1.4 },
    { label: 'FIBER DENSITY', sublabel: '12.5g Dietary Fiber', x: '82%', y: '68%', blur: 'blur-[1px]', scale: 1.05, delay: 0.4 },
    { label: 'SOY CRUST', sublabel: 'Triple-Baked Crisp', x: '7%', y: '46%', blur: 'blur-[3px]', scale: 1.15, delay: 1.1 },
    { label: 'ZERO TRANS-FAT', sublabel: 'Plant-Based Goodness', x: '91%', y: '46%', blur: 'blur-[1.5px]', scale: 0.9, delay: 0.6 },
  ],
  choco: [
    { label: 'DARK CACAO 70%', sublabel: 'Single-Origin Cocoa', x: '11%', y: '23%', blur: 'blur-[2px]', scale: 1.05, delay: 0 },
    { label: 'CACAO NIBS', sublabel: 'Roasted Crunch', x: '85%', y: '24%', blur: 'blur-none', scale: 0.9, delay: 0.7 },
    { label: 'ANTIOXIDANTS', sublabel: 'Polyphenol Rich', x: '15%', y: '68%', blur: 'blur-[2px]', scale: 1.0, delay: 1.2 },
    { label: 'CACAO CRUST', sublabel: 'Crispy Okara Blend', x: '83%', y: '68%', blur: 'blur-[1px]', scale: 1.1, delay: 0.3 },
    { label: 'LOW GLYCEMIC', sublabel: 'Unrefined Sweetener', x: '8%', y: '46%', blur: 'blur-[3px]', scale: 1.1, delay: 0.9 },
    { label: 'PURE BUTTER', sublabel: 'Slowly Melted', x: '90%', y: '46%', blur: 'blur-[1.5px]', scale: 0.95, delay: 1.5 },
  ],
  matcha: [
    { label: 'UJI MATCHA', sublabel: 'Ceremonial Stoneground', x: '12%', y: '22%', blur: 'blur-[1.5px]', scale: 1.05, delay: 0 },
    { label: 'L-THEANINE', sublabel: 'Calm Sustained Focus', x: '84%', y: '25%', blur: 'blur-none', scale: 0.95, delay: 0.8 },
    { label: 'HERBAL UMAMI', sublabel: 'Balanced Fragrance', x: '14%', y: '68%', blur: 'blur-[2.5px]', scale: 0.85, delay: 1.3 },
    { label: 'GREEN CRUMB', sublabel: 'Matcha Okara Crisp', x: '84%', y: '68%', blur: 'blur-[1px]', scale: 1.05, delay: 0.5 },
    { label: 'ZEN PROFILE', sublabel: 'Clean Bittersweet', x: '7%', y: '46%', blur: 'blur-[3px]', scale: 1.1, delay: 1.0 },
    { label: 'PLANT PROTEIN', sublabel: '7.2g Soy Nutrition', x: '91%', y: '46%', blur: 'blur-[1.5px]', scale: 0.9, delay: 0.7 },
  ],
}

export default function HeroSection() {
  const { activeFlavor, setActiveFlavor, updateQuantity, orderItems } = useStore()
  const touchStartY = useRef<number | null>(null)
  const touchStartX = useRef<number | null>(null)

  const currentIndex = FLAVORS.findIndex((f) => f.id === activeFlavor)
  const currentFlavor = FLAVORS[currentIndex] || FLAVORS[0]

  // Switch flavor safely with wrap-around
  const switchFlavor = useCallback(
    (direction: 'next' | 'prev') => {
      const total = FLAVORS.length
      const newIndex =
        direction === 'next' ? (currentIndex + 1) % total : (currentIndex - 1 + total) % total
      setActiveFlavor(FLAVORS[newIndex].id)
    },
    [currentIndex, setActiveFlavor]
  )

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        switchFlavor('next')
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        switchFlavor('prev')
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [switchFlavor])

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null || touchStartX.current === null) return
    const diffX = touchStartX.current - e.changedTouches[0].clientX
    const diffY = touchStartY.current - e.changedTouches[0].clientY

    // Only swipe if horizontal motion is dominant (don't interfere with normal page scroll)
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) switchFlavor('next')
      else switchFlavor('prev')
    }

    touchStartY.current = null
    touchStartX.current = null
  }

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleBuyNow = () => {
    const existing = orderItems.find((o) => o.flavorId === currentFlavor.id)
    const currentQty = existing ? existing.quantity : 0
    updateQuantity(currentFlavor.id, currentQty + 1)
    scrollTo('#order')
  }

  return (
    <section
      id="hero"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full min-h-screen flex flex-col justify-between pt-24 pb-8 sm:pb-12 px-5 sm:px-10 lg:px-16 transition-all duration-700 overflow-hidden"
      style={{
        background: currentFlavor.bgGradient,
      }}
    >
      {/* Soft Vignette & Ambient Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${currentFlavor.glowColor} 0%, transparent 68%)`,
        }}
      />
      <div className="absolute inset-0 bg-radial-[at_center] from-transparent via-black/10 to-black/50 pointer-events-none" />

      {/* Floating Organic Ingredients (Depth-of-Field bokeh) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFlavor.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full relative"
          >
            {INGREDIENTS_DATA[currentFlavor.id].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.6, y: 20 }}
                animate={{
                  opacity: 1,
                  scale: item.scale,
                  y: [0, -10, 0],
                }}
                transition={{
                  opacity: { duration: 0.5, delay: item.delay * 0.4 },
                  scale: { duration: 0.5, delay: item.delay * 0.4 },
                  y: {
                    repeat: Infinity,
                    duration: 4 + idx * 0.8,
                    ease: 'easeInOut',
                    delay: item.delay,
                  },
                }}
                className={`absolute flex items-center justify-center select-none pointer-events-none ${item.blur}`}
                style={{
                  left: item.x,
                  top: item.y,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-xl flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623]" />
                  <div className="font-mono text-left leading-tight">
                    <div className="text-[10px] font-black text-white tracking-widest uppercase">{item.label}</div>
                    <div className="text-[8px] text-white/60 tracking-wider hidden sm:block">{item.sublabel}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* TOP FLAVOR SELECTOR PILLS (Clean, below fixed navbar, no double header) */}
      <div className="relative z-20 flex items-center justify-center w-full mt-2">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-full bg-black/35 backdrop-blur-xl border border-white/15 shadow-2xl">
          {FLAVORS.map((flavor) => {
            const active = flavor.id === activeFlavor
            return (
              <button
                key={flavor.id}
                onClick={() => setActiveFlavor(flavor.id)}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  active
                    ? 'bg-white text-black shadow-lg scale-105'
                    : 'bg-transparent text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="font-mono text-[10px] font-black opacity-60">{flavor.code}</span>
                <span>{flavor.giantTitle}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* CENTER VISUAL STAGE: 3D Biscuit Centerpiece with Giant Typography BEHIND it (from videoframe_6199.png) */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full my-auto py-2">
        <div className="relative w-full max-w-7xl mx-auto flex items-center justify-center select-none min-h-[340px] sm:min-h-[400px] md:min-h-[460px]">
          {/* 1. GIANT TYPOGRAPHY LAYER - BEHIND THE 3D MODEL (z-0) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
            <AnimatePresence mode="wait">
              <motion.h1
                key={currentFlavor.id}
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -15 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="font-black tracking-tight text-white/95 uppercase text-center leading-none select-none whitespace-nowrap"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 'clamp(3rem, 7.8vw, 7.8rem)',
                  textShadow: '0 25px 60px rgba(0,0,0,0.7), 0 4px 15px rgba(0,0,0,0.5)',
                  letterSpacing: '0.02em',
                }}
              >
                {currentFlavor.giantTitle}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* 2. 3D BISCUIT CENTERPIECE LAYER - IN THE CENTER, IN FRONT OF TEXT (z-20) */}
          <div
            className="relative z-20 w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[420px] md:h-[420px] lg:w-[460px] lg:h-[460px] flex items-center justify-center pointer-events-auto"
          >
            <Interactive3DBiscuit flavorId={activeFlavor} />
          </div>
        </div>
      </div>

      {/* BOTTOM HUD CONTROLS: Left CTA & Right Vertical Steppers (from videoframe_6199.png) */}
      <div className="relative z-20 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 w-full max-w-7xl mx-auto pt-4">
        {/* Left: Capsule CTA + Clean Sensory Notes */}
        <div className="max-w-md">
          {/* Pill CTA Button (Buy Now + Price) - Exactly matching videoframe_6199.png */}
          <div className="inline-flex items-center gap-3 p-1 pr-4 rounded-full bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl hover:border-white/35 transition-all">
            <button
              onClick={handleBuyNow}
              className="btn-pill-cta inline-flex items-center px-4 sm:px-5 py-2 rounded-full bg-white text-black font-extrabold text-xs sm:text-sm tracking-tight shadow-lg hover:bg-[#FFF7ED] cursor-pointer transition-transform active:scale-95"
            >
              Pesan Sekarang
            </button>
            <span className="text-white font-extrabold text-xs sm:text-sm tracking-wide font-mono">
              Rp {currentFlavor.price.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Mouth-watering Sensory Flavor Description */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFlavor.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="mt-3.5 space-y-1.5 max-w-sm"
            >
              <p className="text-white/85 text-xs sm:text-sm font-medium leading-relaxed drop-shadow-md">
                {currentFlavor.description}
              </p>
              <div className="text-[#F5A623] text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase opacity-90">
                {currentFlavor.tasteNotes.join('  •  ')}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Vertical Navigation Steppers (↑ and ↓ from videoframe_6199.png) */}
        <div className="flex items-center sm:flex-col gap-2.5 self-end sm:self-auto">
          <button
            onClick={() => switchFlavor('prev')}
            aria-label="Previous flavor"
            title="Varian Sebelumnya (Panah Atas)"
            className="w-11 h-11 rounded-full bg-white/15 hover:bg-white text-white hover:text-black backdrop-blur-xl border border-white/25 flex items-center justify-center transition-all shadow-lg active:scale-90 cursor-pointer"
          >
            <span className="font-mono text-base font-bold leading-none select-none">↑</span>
          </button>

          {/* Flavor Index Counter (e.g. 01 / 03) */}
          <div className="px-3.5 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white font-mono text-xs font-black tracking-wider text-center select-none">
            0{currentIndex + 1} / 0{FLAVORS.length}
          </div>

          <button
            onClick={() => switchFlavor('next')}
            aria-label="Next flavor"
            title="Varian Berikutnya (Panah Bawah)"
            className="w-11 h-11 rounded-full bg-white/15 hover:bg-white text-white hover:text-black backdrop-blur-xl border border-white/25 flex items-center justify-center transition-all shadow-lg active:scale-90 cursor-pointer"
          >
            <span className="font-mono text-base font-bold leading-none select-none">↓</span>
          </button>
        </div>
      </div>
    </section>
  )
}

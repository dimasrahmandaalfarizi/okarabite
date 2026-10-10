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
    { label: 'OKARA 100%', sublabel: 'Upcycled Soy Pulp', x: '12%', y: '20%', blur: 'blur-[1.5px]', scale: 1.0, delay: 0 },
    { label: 'ARTISAN CRUMB', sublabel: 'Golden Butter Base', x: '84%', y: '22%', blur: 'blur-none', scale: 0.95, delay: 0.8 },
    { label: 'AREN EXTRACT', sublabel: 'Organic Palm Nectar', x: '15%', y: '72%', blur: 'blur-[2.5px]', scale: 0.85, delay: 1.4 },
    { label: 'FIBER DENSITY', sublabel: '12.5g Dietary Fiber', x: '83%', y: '72%', blur: 'blur-[1px]', scale: 1.05, delay: 0.4 },
    { label: 'SOY CRUST', sublabel: 'Triple-Baked Crisp', x: '8%', y: '36%', blur: 'blur-[3px]', scale: 1.15, delay: 1.1 },
    { label: 'ZERO TRANS-FAT', sublabel: 'Plant-Based Goodness', x: '90%', y: '36%', blur: 'blur-[1.5px]', scale: 0.9, delay: 0.6 },
  ],
  choco: [
    { label: 'DARK CACAO 70%', sublabel: 'Single-Origin Cocoa', x: '12%', y: '20%', blur: 'blur-[2px]', scale: 1.05, delay: 0 },
    { label: 'CACAO NIBS', sublabel: 'Roasted Crunch', x: '85%', y: '22%', blur: 'blur-none', scale: 0.9, delay: 0.7 },
    { label: 'ANTIOXIDANTS', sublabel: 'Polyphenol Rich', x: '15%', y: '72%', blur: 'blur-[2px]', scale: 1.0, delay: 1.2 },
    { label: 'CACAO CRUST', sublabel: 'Crispy Okara Blend', x: '83%', y: '72%', blur: 'blur-[1px]', scale: 1.1, delay: 0.3 },
    { label: 'LOW GLYCEMIC', sublabel: 'Unrefined Sweetener', x: '8%', y: '36%', blur: 'blur-[3px]', scale: 1.1, delay: 0.9 },
    { label: 'PURE BUTTER', sublabel: 'Slowly Melted', x: '90%', y: '36%', blur: 'blur-[1.5px]', scale: 0.95, delay: 1.5 },
  ],
  matcha: [
    { label: 'UJI MATCHA', sublabel: 'Ceremonial Stoneground', x: '12%', y: '20%', blur: 'blur-[1.5px]', scale: 1.05, delay: 0 },
    { label: 'L-THEANINE', sublabel: 'Calm Sustained Focus', x: '84%', y: '22%', blur: 'blur-none', scale: 0.95, delay: 0.8 },
    { label: 'HERBAL UMAMI', sublabel: 'Balanced Fragrance', x: '15%', y: '72%', blur: 'blur-[2.5px]', scale: 0.85, delay: 1.3 },
    { label: 'GREEN CRUMB', sublabel: 'Matcha Okara Crisp', x: '83%', y: '72%', blur: 'blur-[1px]', scale: 1.05, delay: 0.5 },
    { label: 'ZEN PROFILE', sublabel: 'Clean Bittersweet', x: '8%', y: '36%', blur: 'blur-[3px]', scale: 1.1, delay: 1.0 },
    { label: 'PLANT PROTEIN', sublabel: '7.2g Soy Nutrition', x: '90%', y: '36%', blur: 'blur-[1.5px]', scale: 0.9, delay: 0.7 },
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
      className="relative w-full min-h-[100dvh] flex flex-col justify-between pt-16 sm:pt-20 lg:pt-20 pb-3 sm:pb-4 lg:pb-6 px-4 sm:px-8 lg:px-16 transition-all duration-700 overflow-hidden"
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

      {/* Floating Organic Ingredients (Depth-of-Field bokeh) - Hide on mobile to prevent clipping and clutter */}
      <div className="hidden md:block absolute inset-0 pointer-events-none overflow-hidden">
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

      {/* TOP FLAVOR SELECTOR PILLS */}
      <div className="relative z-20 flex items-center justify-center w-full mt-1 sm:mt-1.5 px-1">
        <div className="inline-flex items-center gap-1 sm:gap-2 p-1 sm:p-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/15 shadow-2xl max-w-full overflow-x-auto no-scrollbar">
          {FLAVORS.map((flavor) => {
            const active = flavor.id === activeFlavor
            return (
              <button
                key={flavor.id}
                onClick={() => setActiveFlavor(flavor.id)}
                className={`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 whitespace-nowrap active:scale-95 ${
                  active
                    ? 'bg-white text-black shadow-lg scale-105'
                    : 'bg-transparent text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="font-mono text-[9px] sm:text-[10px] font-black opacity-60">{flavor.code}</span>
                <span>{flavor.giantTitle}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* CENTER VISUAL STAGE: 3D Biscuit Centerpiece with Giant Typography BEHIND it */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full my-auto py-1 sm:py-2">
        {/* 1. GIANT TYPOGRAPHY LAYER - WIDENED FULL-WIDTH CONTAINER BEHIND THE 3D MODEL */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none select-none z-0 px-2 sm:px-6 w-full overflow-hidden">
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
                fontSize: 'clamp(2rem, 8.2vw, 7.5rem)',
                textShadow: '0 25px 60px rgba(0,0,0,0.7), 0 4px 15px rgba(0,0,0,0.5)',
                letterSpacing: '0.01em',
              }}
            >
              {currentFlavor.giantTitle}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* 2. 3D BISCUIT CENTERPIECE LAYER - IN THE CENTER, IN FRONT OF TEXT */}
        <div className="relative w-full max-w-7xl mx-auto flex items-center justify-center select-none min-h-[220px] sm:min-h-[320px] md:min-h-[380px] lg:min-h-[420px]">
          <div
            className="relative z-20 w-[220px] h-[220px] sm:w-[320px] sm:h-[320px] md:w-[400px] md:h-[400px] lg:w-[450px] lg:h-[450px] flex items-center justify-center pointer-events-auto"
          >
            <Interactive3DBiscuit flavorId={activeFlavor} />
          </div>
        </div>
      </div>

      {/* BOTTOM HUD CONTROLS: Left CTA & Right Steppers */}
      <div className="relative z-20 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-2.5 sm:gap-6 w-full max-w-7xl mx-auto pt-1 sm:pt-2">
        {/* Left: Capsule CTA + Clean Sensory Notes */}
        <div className="w-full sm:max-w-lg text-center sm:text-left flex flex-col items-center sm:items-start">
          {/* Pill CTA Button (Buy Now + Price) */}
          <div className="inline-flex items-center gap-2 sm:gap-3 p-1 pr-3 sm:pr-4 rounded-full bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl hover:border-white/35 transition-all">
            <button
              onClick={handleBuyNow}
              className="btn-pill-cta inline-flex items-center px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-white text-black font-extrabold text-xs sm:text-sm tracking-tight shadow-lg hover:bg-[#FFF7ED] cursor-pointer transition-transform active:scale-95"
            >
              Order Now
            </button>
            <span className="text-white font-extrabold text-xs sm:text-sm tracking-wide font-mono">
              Rp {currentFlavor.price.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Sensory Flavor Description */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFlavor.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="mt-2 sm:mt-2.5 space-y-1 max-w-sm sm:max-w-md mx-auto sm:mx-0"
            >
              <p className="text-white/90 text-xs sm:text-sm font-medium leading-relaxed drop-shadow-md">
                {currentFlavor.description}
              </p>
              <div className="text-[#F5A623] text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase opacity-90">
                {currentFlavor.tasteNotes.join('  •  ')}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Stepper Controls */}
        <div className="flex items-center sm:flex-col gap-1.5 sm:gap-2 self-center sm:self-auto mt-1 sm:mt-0">
          <button
            onClick={() => switchFlavor('prev')}
            aria-label="Varian Sebelumnya"
            title="Varian Sebelumnya (Panah Atas)"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/15 hover:bg-white text-white hover:text-black backdrop-blur-xl border border-white/25 flex items-center justify-center transition-all shadow-lg active:scale-90 cursor-pointer"
          >
            <span className="font-mono text-xs sm:text-sm font-bold leading-none select-none">↑</span>
          </button>

          {/* Flavor Index Counter (e.g. 01 / 03) */}
          <div className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white font-mono text-[11px] sm:text-xs font-black tracking-wider text-center select-none">
            0{currentIndex + 1} / 0{FLAVORS.length}
          </div>

          <button
            onClick={() => switchFlavor('next')}
            aria-label="Varian Berikutnya"
            title="Varian Berikutnya (Panah Bawah)"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/15 hover:bg-white text-white hover:text-black backdrop-blur-xl border border-white/25 flex items-center justify-center transition-all shadow-lg active:scale-90 cursor-pointer"
          >
            <span className="font-mono text-xs sm:text-sm font-bold leading-none select-none">↓</span>
          </button>
        </div>
      </div>
    </section>
  )
}

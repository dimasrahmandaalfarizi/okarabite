import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useStore, FLAVORS } from '../store'

const NUTRITION_BENCHMARKS = [
  { code: 'FIBER', label: 'Serat Pangan Nabati', okara: '12.5g', regular: '2.8g', diff: '+346%' },
  { code: 'PROTEIN', label: 'Protein Kedelai Alami', okara: '7.2g', regular: '3.4g', diff: '+112%' },
  { code: 'GLYCEMIC', label: 'Gula Tebu / Pemanis', okara: '4.1g', regular: '18.5g', diff: '-78%' },
  { code: 'CIRCULAR', label: 'Limbah Ampas Diselamatkan', okara: '150g / pack', regular: '0g', diff: '100% Eco' },
]

export default function FlavorTastingRoom() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { activeFlavor, setActiveFlavor, updateQuantity, orderItems } = useStore()

  const currentFlavor = FLAVORS.find((f) => f.id === activeFlavor) || FLAVORS[0]

  const scrollToOrder = () => {
    document.querySelector('#order')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="flavors"
      ref={ref}
      className="relative bg-[#1A110B] text-[#FFFDF7] py-20 lg:py-32 overflow-hidden"
    >
      {/* Ambient gradient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-20 transition-all duration-700"
        style={{ backgroundColor: currentFlavor.color }}
      />

      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-mono font-bold text-[#F5A623] uppercase tracking-wider mb-4">
            THE ARTISANAL TASTING BENCH
          </div>
          <h2
            className="text-2xl sm:text-4xl lg:text-6xl font-black text-white leading-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Satu Gigitan, Tiga Cerita Rasa
          </h2>
          <p className="text-white/70 mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Formulasi artisan tanpa kompromi: renyah gurihnya bikin nagih, nutrisi ampas tahunya
            bikin tubuh berterima kasih.
          </p>
        </motion.div>

        {/* 2-Column Showcase */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-start mb-12 sm:mb-16">
          {/* Left Column: Interactive Flavor Tasting Cards (col-span-7) */}
          <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
            {FLAVORS.map((flavor) => {
              const isActive = activeFlavor === flavor.id
              const orderItem = orderItems.find((o) => o.flavorId === flavor.id)
              const qty = orderItem ? orderItem.quantity : 0

              return (
                <motion.div
                  key={flavor.id}
                  onClick={() => setActiveFlavor(flavor.id)}
                  className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl cursor-pointer transition-all duration-300 border ${
                    isActive
                      ? 'bg-white/12 border-white/35 shadow-2xl scale-[1.01]'
                      : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                      {/* Typographic Index Stamp */}
                      <div
                        className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-mono font-black text-xs sm:text-sm tracking-widest text-white/90 flex-shrink-0 border border-white/15 shadow-inner"
                        style={{ backgroundColor: `${flavor.color}35` }}
                      >
                        {flavor.code}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3
                            className="text-lg sm:text-xl font-bold text-white tracking-tight"
                            style={{ fontFamily: "'Syne', sans-serif" }}
                          >
                            {flavor.name}
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold bg-white/15 text-white/90">
                            {flavor.tagline}
                          </span>
                        </div>

                        <p className="text-white/75 text-xs sm:text-sm mt-1.5 sm:mt-2 leading-relaxed">
                          {flavor.description}
                        </p>

                        <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3 text-[11px] sm:text-xs text-white/60 font-semibold font-mono flex-wrap">
                          <span className="text-[#F5A623]">{flavor.nutritionHighlight}</span>
                          <span>•</span>
                          <span>Rp {flavor.price.toLocaleString('id-ID')} / 100g</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Add Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        updateQuantity(flavor.id, qty + 1)
                      }}
                      className="flex-shrink-0 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white text-black hover:bg-[#F5A623] hover:text-white flex items-center justify-center shadow-lg transition-all cursor-pointer active:scale-90"
                      title="Tambah ke Pesanan"
                      aria-label={`Tambah ${flavor.name}`}
                    >
                      <span className="font-mono text-lg sm:text-xl font-bold leading-none select-none">+</span>
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Right Column: Upcycled Nutrition Comparison Matrix (col-span-5) */}
          <div className="lg:col-span-5 bg-white/5 backdrop-blur-xl border border-white/15 rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-9 shadow-2xl">
            <div className="flex items-center justify-between pb-5 sm:pb-6 border-b border-white/10">
              <div>
                <span className="text-[11px] sm:text-xs font-mono font-bold text-[#F5A623] uppercase tracking-wider">
                  UJI LABORATORIUM PMW
                </span>
                <h4
                  className="text-xl sm:text-2xl font-black text-white mt-1"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  Okara vs Biskuit Biasa
                </h4>
              </div>
              <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-white/10 border border-white/15 font-mono text-[9px] sm:text-[10px] font-black text-[#F5A623] tracking-widest uppercase">
                SPEC-2026
              </div>
            </div>

            <div className="space-y-4 sm:space-y-5 pt-5 sm:pt-6">
              {NUTRITION_BENCHMARKS.map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <span className="px-1.5 sm:px-2 py-0.5 rounded bg-white/10 border border-white/10 font-mono text-[9px] sm:text-[10px] font-bold text-[#F5A623] tracking-wider flex-shrink-0">
                      {item.code}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-white/95 truncate">{item.label}</div>
                      <div className="text-[10px] sm:text-xs text-white/50">Biskuit Biasa: {item.regular}</div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-sm sm:text-base font-black text-[#F5A623] font-mono">{item.okara}</div>
                    <span className="inline-block px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black bg-[#F5A623]/20 text-[#F5A623] border border-[#F5A623]/30 font-mono">
                      {item.diff}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
              <div className="text-[11px] sm:text-xs text-white/60 font-mono">
                Kemasan eco-ziplock tahan renyah hingga 3 bulan
              </div>
              <button
                onClick={scrollToOrder}
                className="w-full sm:w-auto px-5 sm:px-6 py-2.5 rounded-full bg-[#F5A623] text-black font-extrabold text-xs shadow-md hover:bg-white transition-all cursor-pointer text-center"
              >
                Pesan Pouch
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

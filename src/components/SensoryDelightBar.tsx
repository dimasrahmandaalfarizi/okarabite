import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const MARQUEE_ITEMS = [
  'UPCYCLED SOYBEAN OKARA',
  '•',
  '100% ARTISAN BAKERY CRUNCH',
  '•',
  'TINGGI SERAT PANGAN NABATI',
  '•',
  'BEBAS PENGAWET & TRANS-FAT',
  '•',
  'KENYANG LEBIH LAMA',
  '•',
  'HARGA MAHASISWA RP 15.000',
  '•',
]

export default function SensoryDelightBar() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="delight" className="relative bg-[#FFFDF7] py-16 lg:py-28 overflow-hidden">
      {/* KINETIC INFINITE TYPOGRAPHY MARQUEE */}
      <div className="w-full bg-[#1A110B] text-white py-4 -rotate-1 scale-105 border-y border-[#F5A623]/30 overflow-hidden mb-16 shadow-xl">
        <div className="flex whitespace-nowrap animate-[marquee_24s_linear_infinite] gap-8 text-xs sm:text-sm font-black tracking-widest uppercase">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
            <span
              key={idx}
              className={item === '•' ? 'text-[#F5A623]' : 'text-white/90 font-mono'}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-8" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#F5EDE4] text-[#4A2E18] text-xs font-mono font-black uppercase tracking-wider mb-4 border border-[#EFE4DC]">
            THE OKARABITE ADVANTAGE
          </span>
          <h2
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#211814] tracking-tight leading-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Mengapa OkaraBite Berbeda?
          </h2>
          <p className="text-[#6E5D53] mt-4 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Menghubungkan kebaikan sirkular dengan cita rasa artisanal kelas atas.
            Camilan fungsional yang memberi energi tanpa lonjakan gula berlebih.
          </p>
        </motion.div>

        {/* GAPLESS EDITORIAL BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:auto-rows-[220px]">
          {/* Card 1: 3.8x Serat Pangan (Spans 8 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-8 md:row-span-2 rounded-[2rem] sm:rounded-[2.5rem] bg-[#F5EDE4] p-6 sm:p-8 lg:p-12 flex flex-col justify-between border border-[#EFE4DC] relative overflow-hidden group hover:shadow-2xl transition-all min-h-[320px] md:min-h-0"
          >
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#E29526]/12 blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 text-[#211814] text-xs font-mono font-bold border border-[#EFE4DC] mb-4 sm:mb-6">
                BENCHMARK NUTRISI FUNGSIONAL
              </div>
              <div
                className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#211814] tracking-tight leading-tight"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                3.8x <span className="text-[#E29526] text-2xl sm:text-4xl lg:text-5xl font-extrabold block sm:inline">Serat Lebih Tinggi</span>
              </div>
              <p className="text-[#6E5D53] text-sm sm:text-base lg:text-lg font-medium max-w-xl mt-3 sm:mt-4 leading-relaxed">
                Tepung okara menyumbang serat larut dan tidak larut alami yang memperlambat pelepasan glukosa.
                Hasilnya: rasa kenyang bertahan 2x lebih lama, ideal untuk fokus maraton belajar dan kerja.
              </p>
            </div>

            <div className="relative z-10 pt-5 sm:pt-6 mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-[#EFE4DC]">
              <span className="text-[11px] sm:text-xs font-mono font-bold text-[#4A2E18] uppercase">
                Hasil Uji Laboratorium PMW 2026
              </span>
              <button
                onClick={() => scrollTo('#story')}
                className="inline-flex items-center gap-2 text-xs font-black text-[#211814] group-hover:text-[#E29526] transition-colors cursor-pointer"
              >
                <span>Pelajari Proses Tepung Okara</span>
                <span className="font-mono text-sm leading-none">→</span>
              </button>
            </div>
          </motion.div>

          {/* Card 2: 150g Limbah Terpangkas (Spans 4 cols) - Warm cohesive palette */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-4 md:row-span-1 rounded-[2rem] sm:rounded-[2.5rem] bg-[#FDF3E3] p-6 sm:p-7 flex flex-col justify-between border border-[#E8CBA0] relative overflow-hidden group min-h-[170px] md:min-h-0"
          >
            <div>
              <div className="text-[11px] sm:text-xs font-black font-mono uppercase text-[#7C4A00] tracking-wider mb-2">
                DAMPAK SIRKULAR
              </div>
              <div
                className="text-3xl sm:text-4xl font-black text-[#211814] tracking-tight"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                150g Okara
              </div>
              <p className="text-[#6E5D53] text-xs font-medium mt-1 leading-relaxed">
                Limbah ampas tahu lokal terselamatkan dari pembuangan per pouch.
              </p>
            </div>
            <div className="text-[10px] sm:text-[11px] font-bold text-[#7C4A00] font-mono uppercase tracking-wider mt-3">
              Zero Food Waste Standard
            </div>
          </motion.div>

          {/* Card 3: Artisan Bakery (Spans 4 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-4 md:row-span-1 rounded-[2rem] sm:rounded-[2.5rem] bg-[#F2E8E0] p-6 sm:p-7 flex flex-col justify-between border border-[#C8892A]/30 relative overflow-hidden group min-h-[170px] md:min-h-0"
          >
            <div>
              <div className="text-[11px] sm:text-xs font-black font-mono uppercase text-[#4A2E18] tracking-wider mb-2">
                FORMULASI ARTISAN
              </div>
              <div
                className="text-2xl sm:text-3xl font-black text-[#2A1408] tracking-tight"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Mentega & Aren
              </div>
              <p className="text-[#6E5D53] text-xs font-medium mt-1 leading-relaxed">
                Dipanggang suhu terkontrol. Wangi bakery autentik sejak kemasan dibuka.
              </p>
            </div>
            <div className="text-[10px] sm:text-[11px] font-bold text-[#4A2E18] font-mono uppercase tracking-wider mt-3">
              100% Bebas Pengawet Sintetis
            </div>
          </motion.div>

          {/* Card 4: Harga Mahasiswa Rp 15.000 (Spans 12 cols banner) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="md:col-span-12 md:row-span-1 rounded-[2rem] sm:rounded-[2.5rem] bg-[#1A110B] text-white p-6 sm:p-8 lg:p-9 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6 border border-white/15 shadow-xl relative overflow-hidden min-h-fit"
          >
            <div className="relative z-10 flex-1">
              <span className="text-[11px] sm:text-xs font-mono font-bold text-[#F5A623] uppercase tracking-widest">
                Affordable Premium Quality
              </span>
              <div
                className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mt-1 leading-tight"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Cuma Rp 15.000 / Pouch 100g
              </div>
              <p className="text-white/70 text-xs sm:text-sm font-medium mt-1.5 max-w-xl">
                Kualitas artisan superfood dengan harga yang bersahabat untuk kantong mahasiswa.
              </p>
            </div>

            <button
              onClick={() => scrollTo('#order')}
              className="relative z-10 w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-full bg-[#F5A623] text-black font-extrabold text-xs sm:text-sm hover:bg-white transition-all shadow-lg cursor-pointer whitespace-nowrap active:scale-95 text-center flex items-center justify-center"
            >
              Order Sekarang Langsung via WA
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

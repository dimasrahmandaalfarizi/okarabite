import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const testimonials = [
  {
    name: 'Salsa Nabila',
    role: 'Mahasiswi Teknik Kimia',
    initials: 'SN',
    rating: '5.0',
    quote:
      'Kaget banget waktu tau ini dari ampas tahu! Rasanya buttery banget kayak cookies kafe mahal. Sama sekali ga nyangka bisa se-enak ini!',
    flavor: 'Original Butter Crisp',
    flavorColor: '#E29526',
    bg: '#FDF3E3',
  },
  {
    name: 'Farhan Rizki',
    role: 'Mahasiswa Informatika',
    initials: 'FR',
    rating: '5.0',
    quote:
      'Camilan andalan pas nugas tengah malam. Nggak bikin begah dan bikin kenyang lama banget. Cokelatnya pekat dan nagih abis!',
    flavor: 'Dark Choco Chips',
    flavorColor: '#4A2E18',
    bg: '#F2E8E0',
  },
  {
    name: 'Anisa Putri',
    role: 'Mahasiswi Gizi & Nutrisi',
    initials: 'AP',
    rating: '5.0',
    quote:
      'Dari perspektif gizi, ini genuinely impressive. High fiber, plant protein, no synthetic preservatives. Untuk harga 15rb ini sangat worth it!',
    flavor: 'Kyoto Matcha Blend',
    flavorColor: '#5B8266',
    bg: '#ECFCE5',
  },
  {
    name: 'Bayu Adi',
    role: 'Mahasiswa Manajemen Bisnis',
    initials: 'BA',
    rating: '5.0',
    quote:
      'Blind taste test di kelas, semua orang pikir ini cookies mahal dari kafe. Waktu tau harganya 15rb semua langsung pesan! Konsepnya keren banget.',
    flavor: 'Original Butter Crisp',
    flavorColor: '#E29526',
    bg: '#FDF3E3',
  },
  {
    name: 'Reva Andini',
    role: 'Mahasiswi Desain Komunikasi',
    initials: 'RA',
    rating: '5.0',
    quote:
      'Packagingnya cakep banget dan konsepnya upcycled food itu keren. Matcha-nya autentik, ga terlalu manis. Ini favorit buat teman ngemil sambil desain.',
    flavor: 'Kyoto Matcha Blend',
    flavorColor: '#5B8266',
    bg: '#ECFCE5',
  },
  {
    name: 'Dimas Okta',
    role: 'Mahasiswa Teknik Lingkungan',
    initials: 'DO',
    rating: '5.0',
    quote:
      'Beli OkaraBite bukan cuma soal enak, tapi juga soal impact. Setiap beli berarti aku bantu kurangi limbah ampas tahu. Small act, big difference!',
    flavor: 'Original Butter Crisp',
    flavorColor: '#E29526',
    bg: '#FDF3E3',
  },
]

export default function SocialProofSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="proof" ref={ref} className="py-16 lg:py-28 bg-[#FFFDF7]">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <span className="badge-pill bg-[#FDF3E3] text-[#7C4A00] border border-[#E2A84A] mb-3 sm:mb-4 text-xs font-mono uppercase tracking-wider font-bold">
            REAL MOMENTS • BLIND TASTE TEST
          </span>
          <h2
            className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#211814] mt-2 sm:mt-3"
            style={{ fontFamily: 'Fraunces, Georgia, serif' }}
          >
            Mereka Sudah Merasakannya
          </h2>
          <p className="text-[#6E5D53] mt-2 sm:mt-3 text-sm sm:text-base lg:text-lg max-w-xl mx-auto font-medium leading-relaxed">
            Hasil blind taste test mahasiswa kampus yang tidak berbohong — biskuit
            ampas tahu yang rasanya setara kafe premium.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 relative group hover:-translate-y-1.5 transition-transform duration-300 border border-black/5"
              style={{ backgroundColor: t.bg }}
            >
              <div className="flex items-center gap-3 mb-3.5 sm:mb-4">
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-mono font-black text-xs sm:text-sm tracking-widest text-[#211814]"
                  style={{ backgroundColor: t.flavorColor + '25' }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-[#211814] text-xs sm:text-sm">{t.name}</p>
                  <p className="text-[#6E5D53] text-[11px] sm:text-xs font-medium">{t.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs font-bold text-[#E29526] tracking-wider mb-2">
                <span>RATING {t.rating} / 5.0</span>
                <span className="text-[#6E5D53]/40">•</span>
                <span className="text-[#6E5D53] text-[9px] sm:text-[10px] uppercase font-mono">VERIFIED</span>
              </div>

              <blockquote className="text-[#4A2E18] text-xs sm:text-sm leading-relaxed font-medium mt-1.5 sm:mt-2 mb-3 sm:mb-4">
                "{t.quote}"
              </blockquote>

              <span
                className="badge-pill text-[10px] font-bold font-mono"
                style={{
                  backgroundColor: t.flavorColor + '18',
                  color: t.flavorColor,
                }}
              >
                {t.flavor}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Summary bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 sm:mt-12 grid grid-cols-3 gap-2 sm:gap-4 bg-[#F5EDE4] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-[#EFE4DC]"
        >
          {[
            { value: '100%', label: 'Puas Rasa', code: 'RATE-A' },
            { value: '5.0', label: 'Rating Konsumen', code: 'SCORE' },
            { value: '150+', label: 'Packs Terdistribusi', code: 'BATCH' },
          ].map((stat, i) => (
            <div key={i} className="text-center px-1">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#A08C80] uppercase tracking-wider block mb-1">
                {stat.code}
              </span>
              <p
                className="text-xl sm:text-3xl lg:text-4xl font-black text-[#211814] tracking-tight"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {stat.value}
              </p>
              <p className="text-[#6E5D53] text-[10px] sm:text-xs font-semibold mt-1 font-mono uppercase tracking-tight sm:tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

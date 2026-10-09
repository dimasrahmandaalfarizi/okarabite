import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

const steps = [
  {
    stepNumber: '01',
    phase: 'FASE 01 • THE FRESH ORIGIN',
    title: 'Dari Pengrajin Tahu Lokal',
    desc: 'Ampas tahu segar berkualitas tinggi diambil langsung dari pengrajin tahu lokal binaan. Bahan dasar kaya serat dan protein yang selama ini terbuang sia-sia.',
    color: '#5B8266',
    bg: '#ECFCE5',
    detail: 'Setiap batch: 14 kg ampas tahu segar',
  },
  {
    stepNumber: '02',
    phase: 'FASE 02 • THE CRAFT',
    title: 'Diproses Secara Higienis',
    desc: 'Ampas tahu dikeringkan, diayak, dan dihaluskan menjadi tepung okara berprotein tinggi. Proses higienis bersertifikat yang menjaga nutrisi alaminya tetap utuh.',
    color: '#E29526',
    bg: '#FDF3E3',
    detail: 'Tepung okara: protein nabati ~7g/100g',
  },
  {
    stepNumber: '03',
    phase: 'FASE 03 • THE CRISP MASTERPIECE',
    title: 'Biskuit Renyah Sempurna',
    desc: 'Dipanggang bersama mentega premium, gula aren, dan bumbu pilihan hingga lahir sebagai biskuit renyah keemasan yang wangi bakery dan dikemas dalam eco-ziplock tahan 3 bulan.',
    color: '#4A2E18',
    bg: '#F2E8E0',
    detail: 'Masa simpan renyah: 3 bulan kedap udara',
  },
]

export default function WasteToTasteSection() {
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const lineHeight = useTransform(scrollYProgress, [0.1, 0.8], ['0%', '100%'])

  return (
    <section id="story" ref={sectionRef} className="py-20 lg:py-32 bg-[#FFFDF7]">
      <div className="max-w-5xl mx-auto px-5 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="badge-pill bg-[#FDF3E3] text-[#7C4A00] border border-[#E2A84A] mb-4 text-xs font-mono uppercase tracking-wider font-bold">
            ASAL MUASAL KERENYAHAN
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#211814] mt-3"
            style={{ fontFamily: 'Fraunces, Georgia, serif' }}
          >
            From Waste{' '}
            <em className="text-[#E29526] italic">to Taste</em>
          </h2>
          <p className="text-[#6E5D53] mt-4 text-base lg:text-lg max-w-xl mx-auto font-medium leading-relaxed">
            Di balik setiap gigitan OkaraBite, ada perjalanan transformasi yang
            mengubah limbah industri tahu menjadi mahakarya kuliner.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#EFE4DC] -translate-x-1/2 hidden sm:block" />
          <motion.div
            className="absolute left-8 md:left-1/2 top-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-[#E29526] to-[#5B8266] hidden sm:block"
            style={{ height: lineHeight }}
          />

          <div className="space-y-10 lg:space-y-16">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.65, delay: 0.2 + i * 0.18 }}
                className={`relative flex items-start gap-6 ${
                  i % 2 !== 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Step card */}
                <div
                  className={`flex-1 rounded-3xl p-6 lg:p-8 ${
                    i % 2 !== 0 ? 'md:text-right' : ''
                  }`}
                  style={{ backgroundColor: step.bg }}
                >
                  <div
                    className={`flex items-center gap-3 mb-3 ${
                      i % 2 !== 0 ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    <span className="px-2.5 py-1 rounded-xl bg-black/5 font-mono text-xs font-black tracking-widest text-[#211814]">
                      {step.stepNumber}
                    </span>
                    <span
                      className="text-xs font-mono font-bold uppercase tracking-wider"
                      style={{ color: step.color }}
                    >
                      {step.phase}
                    </span>
                  </div>
                  <h3
                    className="text-xl lg:text-2xl font-black text-[#211814] mb-3"
                    style={{ fontFamily: 'Fraunces, Georgia, serif' }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-[#6E5D53] leading-relaxed text-sm lg:text-base font-medium mb-4">
                    {step.desc}
                  </p>
                  <span
                    className="inline-block badge-pill text-xs font-bold border font-mono"
                    style={{
                      backgroundColor: step.color + '18',
                      color: step.color,
                      borderColor: step.color + '40',
                    }}
                  >
                    {step.detail}
                  </span>
                </div>

                {/* Circle dot */}
                <div
                  className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-white text-sm font-mono font-black shadow-lg flex-shrink-0 mt-4 md:mt-0 z-10"
                  style={{ backgroundColor: step.color }}
                >
                  {i + 1}
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16 p-8 bg-[#F5EDE4] rounded-3xl"
        >
          <p
            className="text-xl lg:text-2xl font-black text-[#211814] mb-2"
            style={{ fontFamily: 'Fraunces, Georgia, serif' }}
          >
            "Bukan limbah. Ini adalah{' '}
            <span className="text-[#E29526]">bahan baku emas</span> yang menunggu
            untuk dinikmati."
          </p>
          <p className="text-[#6E5D53] text-sm font-medium font-mono uppercase tracking-wider">
            — TIM OKARABITE, PMW 2026
          </p>
        </motion.div>
      </div>
    </section>
  )
}

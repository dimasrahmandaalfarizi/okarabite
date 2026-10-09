import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useStore, FLAVORS } from '../store'

const WHATSAPP_NUMBER = '6281234567890' // Replace with actual number

export default function OrderBuilderSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { orderItems, updateQuantity, getTotal, getTotalPacks, generateWhatsAppMessage } =
    useStore()

  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [sent, setSent] = useState(false)

  const total = getTotal()
  const totalPacks = getTotalPacks()
  const totalWaste = totalPacks * 150

  const handleWhatsApp = () => {
    if (totalPacks === 0) return
    const msg = generateWhatsAppMessage(
      name || 'Pelanggan OkaraBite',
      location || 'Belum diisi'
    )
    const encoded = encodeURIComponent(msg)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank')
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <section
      id="order"
      ref={ref}
      className="relative bg-[#F5EDE4] py-16 lg:py-28 torn-paper-top"
    >
      <div className="max-w-5xl mx-auto px-5 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="badge-pill bg-[#FFFDF7] text-[#4A2E18] border border-[#EFE4DC] mb-4 text-xs font-mono uppercase tracking-wider font-bold">
            DIRECT ORDER
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#211814] mt-3"
            style={{ fontFamily: 'Fraunces, Georgia, serif' }}
          >
            Langsung ke{' '}
            <em className="text-[#E29526] italic">WhatsApp</em>
          </h2>
          <p className="text-[#6E5D53] mt-3 text-base lg:text-lg max-w-xl mx-auto font-medium">
            Pilih varian dan jumlah, klik tombol — pesananmu terkirim otomatis ke
            WhatsApp kami. Tanpa ribet, langsung dilayani.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Order items */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="lg:col-span-3 bg-[#FFFDF7] rounded-3xl p-6 border border-[#EFE4DC]"
          >
            <h3
              className="font-black text-[#211814] text-lg mb-5"
              style={{ fontFamily: 'Fraunces, Georgia, serif' }}
            >
              Pilih Varian & Jumlah
            </h3>

            <div className="space-y-3">
              {FLAVORS.map((flavor) => {
                const item = orderItems.find((o) => o.flavorId === flavor.id)!
                return (
                  <div
                    key={flavor.id}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-300 ${
                      item.quantity > 0 ? '' : 'opacity-70'
                    }`}
                    style={{
                      backgroundColor: item.quantity > 0 ? flavor.bgColor : '#F5EDE4',
                    }}
                  >
                    {/* Typographic Tag */}
                    <span className="w-8 h-8 rounded-xl bg-black/10 flex items-center justify-center font-mono font-black text-xs text-[#211814] flex-shrink-0">
                      {flavor.code}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#211814] text-sm truncate">
                        {flavor.name}
                      </p>
                      <p className="text-[#6E5D53] text-xs font-mono font-medium">
                        Rp 15.000 / pouch
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => updateQuantity(flavor.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-[#FFFDF7] border-2 border-[#EFE4DC] flex items-center justify-center text-[#4A2E18] hover:border-[#E29526] transition-colors cursor-pointer"
                        aria-label="Kurang"
                      >
                        <span className="font-mono text-sm font-bold leading-none select-none">−</span>
                      </button>
                      <span
                        className="w-7 text-center font-black text-[#211814] text-sm font-mono"
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(flavor.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer"
                        style={{ backgroundColor: flavor.color }}
                        aria-label="Tambah"
                      >
                        <span className="font-mono text-sm font-bold leading-none select-none">+</span>
                      </button>
                    </div>
                    {item.quantity > 0 && (
                      <span
                        className="flex-shrink-0 text-xs font-bold min-w-[60px] text-right font-mono"
                        style={{ color: flavor.color }}
                      >
                        Rp {(item.quantity * 15000).toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Info fields */}
            <div className="mt-5 space-y-3">
              <input
                type="text"
                placeholder="Nama kamu (opsional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#F5EDE4] border border-[#EFE4DC] text-[#211814] text-sm font-medium placeholder-[#A08C80] focus:outline-none focus:border-[#E29526] transition-colors"
              />
              <input
                type="text"
                placeholder="Kantin kampus / alamat pengiriman (opsional)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#F5EDE4] border border-[#EFE4DC] text-[#211814] text-sm font-medium placeholder-[#A08C80] focus:outline-none focus:border-[#E29526] transition-colors"
              />
            </div>
          </motion.div>

          {/* Order summary */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.25 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Summary card */}
            <div className="bg-[#FFFDF7] rounded-3xl p-6 border border-[#EFE4DC]">
              <h3
                className="font-black text-[#211814] text-lg mb-4"
                style={{ fontFamily: 'Fraunces, Georgia, serif' }}
              >
                Ringkasan Pesanan
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm font-medium text-[#6E5D53]">
                  <span>Total pack</span>
                  <span className="text-[#211814] font-bold font-mono">{totalPacks} pack</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-[#6E5D53]">
                  <span>Harga per pack</span>
                  <span className="text-[#211814] font-bold font-mono">Rp 15.000</span>
                </div>
                <div className="border-t border-[#EFE4DC] pt-2">
                  <div className="flex justify-between font-black text-[#211814]">
                    <span style={{ fontFamily: 'Fraunces, Georgia, serif' }}>
                      Total
                    </span>
                    <span
                      className="text-[#E29526] text-lg font-mono font-black"
                    >
                      Rp {total.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Zero waste impact */}
              {totalPacks > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#ECFCE5] rounded-2xl p-3 mb-4 border border-[#A8C9B0]"
                >
                  <p className="text-[#1A4731] text-xs font-semibold leading-relaxed">
                    Dengan pesanan ini, kamu menyelamatkan{' '}
                    <strong>{totalWaste.toLocaleString('id-ID')} gram</strong> ampas
                    tahu dari pembuangan.
                  </p>
                </motion.div>
              )}

              {/* WhatsApp button */}
              <motion.button
                onClick={handleWhatsApp}
                disabled={totalPacks === 0}
                whileHover={totalPacks > 0 ? { scale: 1.02 } : {}}
                whileTap={totalPacks > 0 ? { scale: 0.97 } : {}}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  totalPacks > 0
                    ? 'bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.35)] hover:bg-[#20B858]'
                    : 'bg-[#EFE4DC] text-[#A08C80] cursor-not-allowed'
                }`}
              >
                {sent
                  ? 'Pesanan Berhasil Disiapkan'
                  : totalPacks > 0
                  ? `Kirim Pesanan ke WhatsApp`
                  : 'Pilih minimal 1 rasa'}
              </motion.button>
            </div>

            {/* Marketplace alternatives */}
            <div className="bg-[#FFFDF7] rounded-3xl p-5 border border-[#EFE4DC]">
              <p className="text-[#6E5D53] text-xs font-mono font-semibold uppercase tracking-wider mb-3">
                Atau beli di Marketplace
              </p>
              <div className="space-y-2">
                <a
                  href="https://shopee.co.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-[#F5EDE4] rounded-2xl hover:bg-[#EFE4DC] transition-colors group"
                >
                  <span className="w-8 h-8 rounded-lg bg-black/5 font-mono text-[10px] font-black text-[#211814] flex items-center justify-center">
                    SHP
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-[#211814] text-sm">Shopee</p>
                    <p className="text-[#6E5D53] text-xs">Official Store OkaraBite</p>
                  </div>
                  <span className="text-[#A08C80] group-hover:text-[#E29526] font-mono text-xs">
                    ↗
                  </span>
                </a>
                <a
                  href="https://tiktok.com/shop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-[#F5EDE4] rounded-2xl hover:bg-[#EFE4DC] transition-colors group"
                >
                  <span className="w-8 h-8 rounded-lg bg-black/5 font-mono text-[10px] font-black text-[#211814] flex items-center justify-center">
                    TTK
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-[#211814] text-sm">TikTok Shop</p>
                    <p className="text-[#6E5D53] text-xs">Promo spesial live streaming</p>
                  </div>
                  <span className="text-[#A08C80] group-hover:text-[#E29526] font-mono text-xs">
                    ↗
                  </span>
                </a>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2">
              {[
                'Bebas Pengawet Sintetis',
                '100% Upcycled Food',
                'Eco Ziplock Pouch',
                'Respon Cepat 24 Jam',
              ].map((b) => (
                <span
                  key={b}
                  className="badge-pill bg-[#FFFDF7] border border-[#EFE4DC] text-[#6E5D53] text-[10px] font-mono font-semibold"
                >
                  {b}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

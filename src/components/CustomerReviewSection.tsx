import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

export interface CustomerReview {
  id: string
  name: string
  role?: string
  flavor: string
  rating: number
  comment: string
  date: string
  verified?: boolean
}

const STORAGE_KEY = 'okarabite_customer_reviews'

const FLAVOR_OPTIONS = [
  { id: 'original', name: 'Original Butter Crisp', color: '#E29526', bg: '#FDF3E3' },
  { id: 'choco', name: 'Dark Choco Chips', color: '#4A2E18', bg: '#F2E8E0' },
  { id: 'matcha', name: 'Kyoto Matcha Blend', color: '#6B705C', bg: '#F4EFE6' },
]

export default function CustomerReviewSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  // Initialize with empty array as requested: "kosongin maksudnya karena belum ada yang beli"
  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Form states
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [selectedFlavor, setSelectedFlavor] = useState(FLAVOR_OPTIONS[0].name)
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [submittedToast, setSubmittedToast] = useState(false)

  // Save to localStorage when reviews change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
    } catch (err) {
      console.error('Failed to save reviews', err)
    }
  }, [reviews])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !comment.trim()) return

    const newReview: CustomerReview = {
      id: Date.now().toString(),
      name: name.trim(),
      role: role.trim() || 'Konsumen OkaraBite',
      flavor: selectedFlavor,
      rating,
      comment: comment.trim(),
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      verified: true,
    }

    setReviews([newReview, ...reviews])
    setName('')
    setRole('')
    setComment('')
    setRating(5)
    setShowForm(false)
    setSubmittedToast(true)

    setTimeout(() => {
      setSubmittedToast(false)
    }, 4500)
  }

  const handleClearReviews = () => {
    if (window.confirm('Kosongkan kembali semua ulasan (reset ke kondisi awal)?')) {
      setReviews([])
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const getInitials = (text: string) => {
    return text
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  const getFlavorMeta = (flavorName: string) => {
    return (
      FLAVOR_OPTIONS.find((f) => f.name === flavorName) || {
        color: '#E29526',
        bg: '#FDF3E3',
      }
    )
  }

  return (
    <section id="reviews" ref={ref} className="py-16 lg:py-28 bg-[#FFFDF7] relative overflow-hidden">
      {/* Toast Notification (No emoji) */}
      <AnimatePresence>
        {submittedToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#211814] text-[#FFFDF7] px-6 py-3 rounded-full shadow-2xl border border-[#E29526] flex items-center gap-3 text-xs sm:text-sm font-semibold"
          >
            <span className="w-2 h-2 rounded-full bg-[#E29526] animate-pulse" />
            <span>Terima kasih! Ulasan rasa kamu berhasil ditambahkan.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 sm:mb-14"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="badge-pill bg-[#FDF3E3] text-[#7C4A00] border border-[#E2A84A] mb-3 text-xs font-mono uppercase tracking-wider font-bold inline-block">
                SUARA KONSUMEN • ULASAN RASA
              </span>
              <h2
                className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#211814] mt-1"
                style={{ fontFamily: 'Fraunces, Georgia, serif' }}
              >
                Ulasan & <em className="text-[#E29526] italic">Kesan Rasa</em>
              </h2>
              <p className="text-[#6E5D53] mt-2 sm:mt-3 text-sm sm:text-base lg:text-lg max-w-xl font-medium leading-relaxed">
                Ruang bagi kamu yang telah mencicipi OkaraBite. Bagikan penilaian jujurmu
                mengenai rasa, kerenyahan, dan pengalaman ngemil kamu!
              </p>
            </div>

            {/* Write Review Button (No emoji) */}
            <div className="flex items-center gap-4 self-start sm:self-end">
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-5 sm:px-6 py-2.5 rounded-full bg-[#211814] text-[#FFFDF7] hover:bg-[#E29526] hover:text-black font-extrabold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2 whitespace-nowrap"
              >
                <span>{showForm ? 'Tutup Formulir' : 'Tulis Ulasan'}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Customer Review Form (Expandable) */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mb-12 overflow-hidden"
            >
              <div className="bg-[#FAF4EB] rounded-3xl p-5 sm:p-8 lg:p-10 border border-[#E8DACB] shadow-xl max-w-3xl mx-auto">
                <div className="flex items-center justify-between pb-4 border-b border-[#E8DACB] mb-6">
                  <div>
                    <h3
                      className="text-lg sm:text-2xl font-black text-[#211814]"
                      style={{ fontFamily: 'Fraunces, Georgia, serif' }}
                    >
                      Kirim Ulasan Rasa Kamu
                    </h3>
                    <p className="text-[#6E5D53] text-xs sm:text-sm font-medium mt-1">
                      Ulasanmu langsung tampil di halaman ini dan membantu kami terus berinovasi.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-[#4A2E18] mb-1.5">
                        Nama Kamu <span className="text-[#E29526]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Rania Maharani"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-2xl bg-[#FFFDF7] border border-[#E0D0C0] text-[#211814] text-xs sm:text-sm font-medium placeholder-[#A08C80] focus:outline-none focus:border-[#E29526]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-[#4A2E18] mb-1.5">
                        Status / Kampus (Opsional)
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Mahasiswi FEB / Penggemar Camilan"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-2xl bg-[#FFFDF7] border border-[#E0D0C0] text-[#211814] text-xs sm:text-sm font-medium placeholder-[#A08C80] focus:outline-none focus:border-[#E29526]"
                      />
                    </div>
                  </div>

                  {/* Flavor Picker (No emoji) */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#4A2E18] mb-1.5">
                      Varian yang Dicicipi
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {FLAVOR_OPTIONS.map((flavor) => (
                        <button
                          key={flavor.id}
                          type="button"
                          onClick={() => setSelectedFlavor(flavor.name)}
                          className={`px-3 py-2.5 rounded-2xl border text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                            selectedFlavor === flavor.name
                              ? 'bg-[#211814] text-white border-[#211814] shadow-md scale-[1.02]'
                              : 'bg-[#FFFDF7] text-[#4A2E18] border-[#E0D0C0] hover:bg-[#F2E8E0]'
                          }`}
                        >
                          <span className="truncate">{flavor.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#4A2E18] mb-1.5">
                      Penilaian Rasa & Kerenyahan (1-5 Bintang)
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(null)}
                            className="text-2xl sm:text-3xl transition-transform hover:scale-125 cursor-pointer focus:outline-none"
                            aria-label={`Bintang ${star}`}
                          >
                            <span
                              className={
                                (hoverRating !== null ? hoverRating >= star : rating >= star)
                                  ? 'text-[#E29526]'
                                  : 'text-[#D0C2B4]'
                              }
                            >
                              ★
                            </span>
                          </button>
                        ))}
                      </div>
                      <span className="text-xs font-mono font-bold text-[#E29526] ml-2">
                        {rating === 5 && '5.0 • Super Nagih & Crunchy'}
                        {rating === 4 && '4.0 • Sangat Gurih & Enak'}
                        {rating === 3 && '3.0 • Lumayan Renyah'}
                        {rating === 2 && '2.0 • Cukup'}
                        {rating === 1 && '1.0 • Perlu Peningkatan'}
                      </span>
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#4A2E18] mb-1.5">
                      Cerita & Komentar Rasa <span className="text-[#E29526]">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Bagaimana teksturnya? Apakah rasa butter atau cokelatnya pas? Ceritakan sensasi setelah mencicipi..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-[#FFFDF7] border border-[#E0D0C0] text-[#211814] text-xs sm:text-sm font-medium placeholder-[#A08C80] focus:outline-none focus:border-[#E29526] resize-none"
                    />
                  </div>

                  {/* Submit Button (No emoji) */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-5 py-2.5 rounded-full text-xs font-bold text-[#6E5D53] hover:text-black cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-[#E29526] text-black font-black text-xs sm:text-sm hover:bg-[#F5A623] shadow-lg transition-transform active:scale-95 cursor-pointer"
                    >
                      Kirim Ulasan Rasa
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Body: Empty State vs Live Reviews */}
        {reviews.length === 0 ? (
          /* EMPTY STATE (No emoji, clean warm card) */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="rounded-[2.5rem] bg-[#FAF4EB] border-2 border-dashed border-[#DCCBBA] p-8 sm:p-12 lg:p-16 text-center max-w-3xl mx-auto relative overflow-hidden group shadow-sm"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFDF7] text-[#7C4A00] border border-[#E2A84A]/60 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider mb-4">
              BATCH PERDANA BARU MATANG
            </div>

            <h3
              className="text-xl sm:text-3xl font-black text-[#211814] mb-3"
              style={{ fontFamily: 'Fraunces, Georgia, serif' }}
            >
              Belum Ada Ulasan Masuk
            </h3>

            <p className="text-[#6E5D53] text-xs sm:text-sm lg:text-base max-w-lg mx-auto font-medium leading-relaxed mb-6">
              OkaraBite diproduksi terbatas dalam batch segar. Jadilah yang pertama
              mencicipi kelezatan renyah ampas tahu pilihan dan tinggalkan ulasan rasa pertamamu!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setShowForm(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#211814] text-[#FFFDF7] hover:bg-[#E29526] hover:text-black font-extrabold text-xs sm:text-sm shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center"
              >
                Jadilah yang Pertama Mengisi Ulasan
              </button>
              <a
                href="#order"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#FFFDF7] text-[#4A2E18] border border-[#D5C2B2] hover:border-[#E29526] font-extrabold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center"
              >
                Cicipi & Pesan Pack
              </a>
            </div>
          </motion.div>
        ) : (
          /* REVIEWS GRID (No emoji) */
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {reviews.map((rev) => {
                const meta = getFlavorMeta(rev.flavor)
                return (
                  <motion.div
                    key={rev.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-3xl p-5 sm:p-6 relative group hover:-translate-y-1.5 transition-all duration-300 border border-black/5 shadow-sm"
                    style={{ backgroundColor: meta.bg }}
                  >
                    <div className="flex items-center justify-between gap-3 mb-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-mono font-black text-xs sm:text-sm tracking-widest text-[#211814] border border-black/10 shadow-inner"
                          style={{ backgroundColor: `${meta.color}25` }}
                        >
                          {getInitials(rev.name)}
                        </div>
                        <div>
                          <p className="font-bold text-[#211814] text-xs sm:text-sm">{rev.name}</p>
                          <p className="text-[#6E5D53] text-[11px] sm:text-xs font-medium">
                            {rev.role}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono font-medium text-[#8C7A70]">
                        {rev.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs font-bold text-[#E29526] tracking-wider mb-2">
                      <div className="flex text-[#E29526] text-xs">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i}>{i < rev.rating ? '★' : '☆'}</span>
                        ))}
                      </div>
                      <span className="text-[#6E5D53]/40">•</span>
                      <span className="text-[#6E5D53] text-[9px] sm:text-[10px] uppercase font-mono">
                        VERIFIED TASTE
                      </span>
                    </div>

                    <blockquote className="text-[#4A2E18] text-xs sm:text-sm leading-relaxed font-medium mb-3.5 italic">
                      "{rev.comment}"
                    </blockquote>

                    <div className="flex items-center justify-between pt-1">
                      <span
                        className="badge-pill text-[10px] font-bold font-mono inline-flex items-center"
                        style={{
                          backgroundColor: `${meta.color}20`,
                          color: meta.color,
                        }}
                      >
                        <span>{rev.flavor}</span>
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Reset / Test button */}
            <div className="text-center mt-8">
              <button
                onClick={handleClearReviews}
                className="text-[11px] font-mono text-[#8C7A70] hover:text-[#C84B31] transition-colors underline cursor-pointer"
              >
                Reset Semua Ulasan (Kosongkan Kembali)
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

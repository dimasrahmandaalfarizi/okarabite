import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'

const navLinks = [
  { label: 'Flavor Arena', href: '#hero' },
  { label: 'The Crunch', href: '#delight' },
  { label: 'Our Story', href: '#story' },
  { label: 'Nutrition & Flavors', href: '#flavors' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Order', href: '#order' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const totalPacks = useStore((s) => s.getTotalPacks())

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (href: string) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-2.5 sm:top-3 left-0 right-0 z-50 px-3 sm:px-6 lg:px-8 transition-all duration-300"
      >
        <div
          className={`max-w-7xl mx-auto rounded-full px-3.5 sm:px-5 lg:px-7 flex items-center justify-between h-13 sm:h-16 transition-all duration-500 border ${
            scrolled
              ? 'bg-[#FFFDF7]/90 text-[#211814] backdrop-blur-xl border-[#EFE4DC] shadow-[0_10px_35px_rgba(74,46,24,0.12)]'
              : 'bg-black/45 text-white backdrop-blur-xl border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.4)]'
          }`}
        >
          {/* Logo */}
          <button
            onClick={() => scrollTo('#hero')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span
              style={{ fontFamily: "'Syne', sans-serif" }}
              className="text-base sm:text-lg font-black tracking-tight"
            >
              Okara<span className="text-[#F5A623]">Bite</span>
            </span>
            <span
              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider hidden sm:inline-block font-mono ${
                scrolled
                  ? 'bg-[#E29526]/15 text-[#9C6114] border border-[#E29526]/30'
                  : 'bg-white/20 text-white/90 border border-white/20'
              }`}
            >
              UPCYCLED
            </span>
          </button>

          {/* Desktop Navigation Links (All in English) */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  scrolled
                    ? 'text-[#6E5D53] hover:text-[#211814] hover:bg-[#F5EDE4]'
                    : 'text-white/80 hover:text-white hover:bg-white/15'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action CTA & Mobile Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollTo('#order')}
              className={`relative inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs font-black tracking-tight shadow-md transition-all cursor-pointer active:scale-95 ${
                scrolled
                  ? 'bg-[#F5A623] text-black hover:bg-[#E29526]'
                  : 'bg-white text-black hover:bg-[#FFF7ED]'
              }`}
            >
              <span>Order</span>
              {totalPacks > 0 && (
                <span className="w-4.5 h-4.5 bg-[#211814] text-white text-[10px] font-mono font-bold rounded-full flex items-center justify-center">
                  {totalPacks}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button (44px min touch target) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden w-10 h-10 rounded-full flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                scrolled ? 'hover:bg-[#F5EDE4] text-[#211814]' : 'hover:bg-white/15 text-white'
              }`}
              aria-label="Toggle Menu"
            >
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                className={`w-4 h-0.5 rounded-full block transition-all ${
                  scrolled ? 'bg-[#211814]' : 'bg-white'
                }`}
              />
              <motion.span
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                className={`w-4 h-0.5 rounded-full block ${scrolled ? 'bg-[#211814]' : 'bg-white'}`}
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                className={`w-4 h-0.5 rounded-full block transition-all ${
                  scrolled ? 'bg-[#211814]' : 'bg-white'
                }`}
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer (English Navigation) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-18 left-3 right-3 z-40 bg-[#1A110B]/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-5 md:hidden text-white"
          >
            <nav className="flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-left px-4 py-2.5 rounded-2xl font-bold text-white/90 hover:bg-white/10 transition-colors flex items-center justify-between cursor-pointer text-sm"
                >
                  {link.label}
                  <span className="text-[#F5A623] font-mono font-bold text-xs">→</span>
                </button>
              ))}
              <button
                onClick={() => scrollTo('#order')}
                className="mt-3 w-full py-3 rounded-full bg-[#F5A623] text-black font-black text-sm flex items-center justify-center shadow-lg cursor-pointer"
              >
                Order Now — Rp 15,000 / pack
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

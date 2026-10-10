export default function Footer() {
  const currentYear = new Date().getFullYear()

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-[#211814] text-[#EFE4DC]">
      {/* Eco pledge section */}
      <div className="bg-[#2A1F18] py-12 px-5 lg:px-8 text-center border-b border-[#382010]">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[#F5A623] text-xs font-mono font-bold uppercase tracking-widest mb-4 border border-white/15">
            SUSTAINABLE CIRCULAR BAKERY
          </span>
          <p
            className="text-2xl lg:text-3xl font-black text-[#F5EDE4] leading-tight mb-3"
            style={{ fontFamily: 'Fraunces, Georgia, serif' }}
          >
            "Crunch for your soul,{' '}
            <em className="text-[#E29526] italic">care for the earth.</em>"
          </p>
          <p className="text-[#A08C80] font-medium text-sm lg:text-base">
            Setiap gigitan OkaraBite adalah langkah kecil yang bermakna besar untuk
            bumi dan kesehatan kamu.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 sm:mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-3.5 sm:mb-4">
              <span
                className="text-xl font-bold text-[#F5EDE4]"
                style={{ fontFamily: 'Fraunces, Georgia, serif' }}
              >
                Okara<span className="text-[#E29526]">Bite</span>
              </span>
            </div>
            <p className="text-[#8C7A70] text-xs sm:text-sm leading-relaxed font-medium mb-4 max-w-sm">
              Camilan biskuit sehat berbahan dasar 100% tepung ampas tahu pilihan.
              Tinggi serat, kaya protein nabati, bebas pengawet sintetis. Dibuat
              dengan dedikasi oleh mahasiswa wirausaha.
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://instagram.com/okarabite.id"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full bg-[#382010] hover:bg-[#E29526] hover:text-black transition-colors text-white font-mono text-xs font-bold"
                aria-label="Instagram OkaraBite"
              >
                IG: @okarabite.id
              </a>
              <a
                href="https://tiktok.com/@okarabite"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full bg-[#382010] hover:bg-[#E29526] hover:text-black transition-colors text-white font-mono text-xs font-bold"
                aria-label="TikTok OkaraBite"
              >
                TT: @okarabite
              </a>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full bg-[#382010] hover:bg-[#25D366] hover:text-white transition-colors text-white font-mono text-xs font-bold"
                aria-label="WhatsApp OkaraBite"
              >
                WA: ORDER DIRECT
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4
              className="font-black text-[#F5EDE4] mb-3 sm:mb-4 text-xs font-mono uppercase tracking-widest"
            >
              NAVIGATION
            </h4>
            <ul className="space-y-2 sm:space-y-2.5">
              {[
                { label: 'The Crunch', href: '#delight' },
                { label: 'Our Story', href: '#story' },
                { label: 'Nutrition & Flavors', href: '#flavors' },
                { label: 'Customer Reviews', href: '#reviews' },
                { label: 'Order Now', href: '#order' },
              ].map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-[#8C7A70] hover:text-[#E29526] text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Product info */}
          <div>
            <h4
              className="font-black text-[#F5EDE4] mb-3 sm:mb-4 text-xs font-mono uppercase tracking-widest"
            >
              VARIAN ARTISAN
            </h4>
            <ul className="space-y-2 sm:space-y-2.5 text-[#8C7A70] text-xs sm:text-sm font-medium font-mono">
              <li>01 / Original Butter Crisp</li>
              <li>02 / Dark Choco Chips</li>
              <li>03 / Kyoto Matcha Blend</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#382010] pt-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-2.5 text-center sm:text-left">
          <p className="text-[#6E5D53] text-[11px] sm:text-xs font-mono font-medium">
            © {currentYear} OkaraBite. Program Mahasiswa Wirausaha (PMW) 2026.
          </p>
          <p className="text-[#6E5D53] text-[11px] sm:text-xs font-mono font-medium">
            Tim OkaraBite: Bagas, Nadia, Dimas, Dewa
          </p>
        </div>
      </div>
    </footer>
  )
}

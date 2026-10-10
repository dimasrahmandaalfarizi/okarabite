import { create } from 'zustand'

export type FlavorId = 'original' | 'choco' | 'matcha'

export interface Flavor {
  id: FlavorId
  code: string
  name: string
  splitText: { left: string; right: string }
  giantTitle: string
  tagline: string
  sensoryHeadline: string
  description: string
  color: string
  accentColor: string
  bgColor: string
  bgGradient: string
  glowColor: string
  textColor: string
  price: number
  nutritionHighlight: string
  tasteNotes: string[]
}

export const FLAVORS: Flavor[] = [
  {
    id: 'original',
    code: '01',
    name: 'Original Butter Crisp',
    splitText: { left: 'ORI', right: 'GINAL' },
    giantTitle: 'ORIGINAL',
    tagline: 'Toasted Soy & Golden Butter',
    sensoryHeadline: 'The Heritage Crunch',
    description: 'Sweet, sun-toasted organic okara crumb paired with rich artisan butter notes on a golden, silky crunchy base.',
    color: '#E29526',
    accentColor: '#F5A623',
    bgColor: '#FDF3E3',
    bgGradient: 'radial-gradient(ellipse at center, #5A2D0D 0%, #361705 55%, #180902 100%)',
    glowColor: 'rgba(226, 149, 38, 0.35)',
    textColor: '#FFF5E6',
    price: 15000,
    nutritionHighlight: '3.8x Serat Lebih Tinggi',
    tasteNotes: ['100% Okara Kedelai Lokal', 'Mentega Artisan', 'Renyah Gurih Lembut'],
  },
  {
    id: 'choco',
    code: '02',
    name: 'Dark Choco Chips',
    splitText: { left: 'CHOCO', right: 'LATE' },
    giantTitle: 'CHOCOLATE',
    tagline: 'Decadent 70% Dark Cacao',
    sensoryHeadline: 'Bittersweet Indulgence',
    description: 'Decadent single-origin dark cocoa nibs folded into high-fiber crisp okara. Melts intensely with zero guilt.',
    color: '#8D5332',
    accentColor: '#C67C4E',
    bgColor: '#F2E8E0',
    bgGradient: 'radial-gradient(ellipse at center, #30170C 0%, #1D0C05 55%, #0B0301 100%)',
    glowColor: 'rgba(198, 124, 78, 0.32)',
    textColor: '#FFF2EA',
    price: 15000,
    nutritionHighlight: 'Kaya Antioksidan Cacao',
    tasteNotes: ['Dark Cocoa 70%', 'Low Sugar Crunch', 'Serpihan Cokelat Asli'],
  },
  {
    id: 'matcha',
    code: '03',
    name: 'Kyoto Matcha Blend',
    splitText: { left: 'MAT', right: 'CHA' },
    giantTitle: 'MATCHA',
    tagline: 'Ceremonial Japanese Green Tea',
    sensoryHeadline: 'Zen Floral Umami',
    description: 'Stone-ground ceremonial Uji matcha balanced with silky soybean fiber. A tranquil, fragrant, sophisticated bite.',
    color: '#65704D',
    accentColor: '#8C9A6F',
    bgColor: '#F4EFE6',
    bgGradient: 'radial-gradient(ellipse at center, #193824 0%, #0F2216 55%, #050E09 100%)',
    glowColor: 'rgba(111, 191, 139, 0.3)',
    textColor: '#EAFAF0',
    price: 15000,
    nutritionHighlight: 'Tinggi Protein Nabati',
    tasteNotes: ['Matcha Uji Autentik', 'Wangi Herb Alami', 'Clean Aftertaste'],
  },
]

interface OrderItem {
  flavorId: FlavorId
  quantity: number
}

interface StoreState {
  activeFlavor: FlavorId
  orderItems: OrderItem[]
  setActiveFlavor: (id: FlavorId) => void
  updateQuantity: (flavorId: FlavorId, quantity: number) => void
  getTotal: () => number
  getTotalPacks: () => number
  generateWhatsAppMessage: (name: string, location: string) => string
}

export const useStore = create<StoreState>((set, get) => ({
  activeFlavor: 'original',
  orderItems: FLAVORS.map((f) => ({ flavorId: f.id, quantity: 0 })),

  setActiveFlavor: (id) => set({ activeFlavor: id }),

  updateQuantity: (flavorId, quantity) =>
    set((state) => ({
      orderItems: state.orderItems.map((item) =>
        item.flavorId === flavorId ? { ...item, quantity: Math.max(0, quantity) } : item
      ),
    })),

  getTotal: () => {
    const { orderItems } = get()
    return orderItems.reduce((sum, item) => sum + item.quantity * 15000, 0)
  },

  getTotalPacks: () => {
    const { orderItems } = get()
    return orderItems.reduce((sum, item) => sum + item.quantity, 0)
  },

  generateWhatsAppMessage: (name, location) => {
    const { orderItems } = get()
    const items = orderItems
      .filter((item) => item.quantity > 0)
      .map((item) => {
        const flavor = FLAVORS.find((f) => f.id === item.flavorId)!
        return `• ${item.quantity}x ${flavor.name}`
      })
      .join('\n')

    const total = get().getTotal()
    const totalFormatted = total.toLocaleString('id-ID')

    return `Halo Tim OkaraBite,\n\nSaya ingin memesan paket biskuit upcycled:\n${items}\n\nTotal Pembayaran: Rp ${totalFormatted}\nNama Pemesan: ${name}\nAlamat / Lokasi: ${location}\n\nMohon konfirmasi ketersediaan pesanan. Terima kasih.`
  },
}))

'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type Locale = 'en' | 'fr' | 'ar'

type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  direction: 'ltr' | 'rtl'
  t: (key: keyof typeof translations.en) => string
}

const translations = {
  en: {
    shop: 'Shop', categories: 'Categories', approach: 'Our approach', cart: 'Shopping cart', language: 'Language',
    curated: 'Curated', essentials: 'Health essentials', add: 'Add', adding: 'Adding', removeWishlist: 'Remove from wishlist', addWishlist: 'Add to wishlist', addedToCart: 'Added to cart',
    heroEyebrow: 'Carefully chosen care', heroTitle: 'Better care for every day.', heroDescription: 'Clinically considered essentials for skin, body, and family wellbeing — delivered with care from people who know health.',
    shopCollection: 'Shop the collection', ourApproach: 'Our approach', startHere: 'Start here', shopByNeed: 'Shop by need', viewAll: 'View all', theEdit: 'The edit', everydayEssentials: 'Everyday essentials', exploreProducts: 'Explore products',
    collectionRefreshing: 'Our collection is being refreshed. Check back soon.', calmShopping: 'A calmer way to shop health', goodChoices: 'Good choices feel better.', startShopping: 'Start shopping',
    freeDelivery: 'Free delivery on orders over 150 د.ت · Thoughtful care, delivered', fastDelivery: 'Fast, careful delivery', fromDoor: 'From our door to yours', quality: 'Quality you can trust', selected: 'Selected with intention', guidance: 'Guidance when you need it', support: 'Simple, human support', formula: 'Thoughtful formulas, never overwhelming.', trustedBrands: 'Trusted brands, clearly explained.', joinMyParaOnline: 'Join myParaOnline.tn for considered products, helpful guidance, and a little more confidence in your routine.',
  },
  fr: {
    shop: 'Boutique', categories: 'Catégories', approach: 'Notre approche', cart: 'Panier', language: 'Langue',
    curated: 'Sélection', essentials: 'Essentiels santé', add: 'Ajouter', adding: 'Ajout', removeWishlist: 'Retirer des favoris', addWishlist: 'Ajouter aux favoris', addedToCart: 'Ajouté au panier',
    heroEyebrow: 'Des soins choisis avec attention', heroTitle: 'Le bien-être au quotidien.', heroDescription: 'Des essentiels pour la peau, le corps et toute la famille, sélectionnés avec soin par des experts de la santé.',
    shopCollection: 'Découvrir la collection', ourApproach: 'Notre approche', startHere: 'Commencer ici', shopByNeed: 'Acheter par besoin', viewAll: 'Voir tout', theEdit: 'La sélection', everydayEssentials: 'Les essentiels du quotidien', exploreProducts: 'Explorer les produits',
    collectionRefreshing: 'Notre collection est en cours de renouvellement. Revenez bientôt.', calmShopping: 'Une façon plus sereine de prendre soin de sa santé', goodChoices: 'Les bons choix font du bien.', startShopping: 'Commencer mes achats',
    freeDelivery: 'Livraison offerte dès 150 د.ت · Des soins livrés avec attention', fastDelivery: 'Livraison rapide et soignée', fromDoor: 'De notre porte à la vôtre', quality: 'Une qualité de confiance', selected: 'Choisis avec intention', guidance: 'Des conseils quand vous en avez besoin', support: 'Un accompagnement simple et humain', formula: 'Des formules pensées avec soin, jamais excessives.', trustedBrands: 'Des marques fiables, clairement expliquées.', joinMyParaOnline: 'Rejoignez myParaOnline.tn pour des produits choisis, des conseils utiles et plus de confiance dans votre routine.',
  },
  ar: {
    shop: 'المتجر', categories: 'الفئات', approach: 'نهجنا', cart: 'السلة', language: 'اللغة',
    curated: 'مختاراتنا', essentials: 'منتجات صحية أساسية', add: 'أضف', adding: 'جاري الإضافة', removeWishlist: 'إزالة من المفضلة', addWishlist: 'أضف إلى المفضلة', addedToCart: 'أُضيف إلى السلة',
    heroEyebrow: 'عناية مختارة بعناية', heroTitle: 'عناية أفضل لكل يوم.', heroDescription: 'منتجات أساسية للبشرة والجسم والعائلة، مختارة بعناية ومقدمة من أشخاص يفهمون احتياجاتك الصحية.',
    shopCollection: 'اكتشف المجموعة', ourApproach: 'نهجنا', startHere: 'ابدأ من هنا', shopByNeed: 'تسوق حسب الحاجة', viewAll: 'عرض الكل', theEdit: 'مختاراتنا', everydayEssentials: 'أساسيات يومية', exploreProducts: 'استكشف المنتجات',
    collectionRefreshing: 'نقوم بتحديث مجموعتنا حالياً. عُد قريباً.', calmShopping: 'طريقة أكثر هدوءاً للتسوق الصحي', goodChoices: 'الاختيارات الجيدة تمنحك شعوراً أفضل.', startShopping: 'ابدأ التسوق',
    freeDelivery: 'توصيل مجاني للطلبات فوق 150 د.ت · عناية تصل إليك', fastDelivery: 'توصيل سريع وآمن', fromDoor: 'من بابنا إلى بابك', quality: 'جودة يمكنك الوثوق بها', selected: 'مختارة بعناية', guidance: 'نصائح عند الحاجة', support: 'دعم بسيط وإنساني', formula: 'تركيبات مدروسة بعناية، دون مبالغة.', trustedBrands: 'علامات موثوقة، مشروحة بوضوح.', joinMyParaOnline: 'انضم إلى myParaOnline.tn لاكتشاف منتجات مختارة ونصائح مفيدة وثقة أكبر في روتينك.',
  },
} as const

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    const stored = window.localStorage.getItem('myparaonline-locale') as Locale | null
    if (stored && stored in translations) setLocaleState(stored)
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
    window.localStorage.setItem('myparaonline-locale', locale)
  }, [locale])

  const value = useMemo(() => ({
    locale,
    setLocale: (next: Locale) => setLocaleState(next),
    direction: (locale === 'ar' ? 'rtl' : 'ltr') as 'ltr' | 'rtl',
    t: (key: keyof typeof translations.en) => translations[locale][key] ?? translations.en[key],
  }), [locale])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) throw new Error('useLocale must be used inside LocaleProvider')
  return context
}

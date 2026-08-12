export function formatPrice(value: number | string, locale = 'fr-TN') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'TND',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(Number(value) || 0)
}

export interface Discountable {
  price: number
  discount_price?: number | null
}

export function hasDiscount(product: Discountable): boolean {
  return product.discount_price != null && product.discount_price < product.price
}

export function getEffectivePrice(product: Discountable): number {
  return hasDiscount(product) ? (product.discount_price as number) : product.price
}

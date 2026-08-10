export function formatPrice(value: number | string, locale = 'fr-TN') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'TND',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(Number(value) || 0)
}

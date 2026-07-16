/**
 * Format a number as a currency string.
 * @param {number} amount
 * @param {string} currency  ISO-4217 currency code, e.g. 'USD', 'RWF'
 * @param {string} locale    BCP-47 locale, e.g. 'en-US', 'rw-RW'
 */
export function formatCurrency(amount, currency = 'USD', locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'RWF' ? 0 : 2,
    maximumFractionDigits: currency === 'RWF' ? 0 : 2,
  }).format(amount)
}

/**
 * Format a discount percentage label.
 * @param {number} original
 * @param {number} sale
 */
export function discountPercent(original, sale) {
  if (!original || original <= sale) return null
  return `-${Math.round(((original - sale) / original) * 100)}%`
}

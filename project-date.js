const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export function projectTimestamp(value) {
  if (!value || typeof value !== 'string') return NaN
  // The Projects API can return ISO timestamps without a timezone; those are UTC.
  const normalized = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/.test(value)
    ? `${value.replace(' ', 'T')}Z` : value
  return Date.parse(normalized)
}

export function formatProjectDate(value, now = Date.now()) {
  const timestamp = projectTimestamp(value)
  if (!Number.isFinite(timestamp)) return ''
  const elapsed = now - timestamp
  const distance = Math.abs(elapsed)
  if (distance >= 7 * DAY) {
    return new Date(timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  if (distance < MINUTE) return 'Just now'
  const [unit, length] = distance < HOUR ? ['minute', MINUTE] : distance < DAY ? ['hour', HOUR] : ['day', DAY]
  return new Intl.RelativeTimeFormat('en', { numeric: 'always' }).format(-Math.sign(elapsed) * Math.floor(distance / length), unit)
}

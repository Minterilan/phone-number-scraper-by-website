// Country-specific phone number rules
// Format: 'country_code': { min_digits, max_digits, country_name }
const COUNTRY_PHONE_RULES: Record<string, { min: number; max: number; country: string }> = {
  '+1': { min: 10, max: 10, country: 'USA/Canada' },
  '+44': { min: 10, max: 10, country: 'United Kingdom' },
  '+49': { min: 10, max: 11, country: 'Germany' },
  '+90': { min: 10, max: 10, country: 'Turkey' },
  '+91': { min: 10, max: 10, country: 'India' },
  '+33': { min: 9, max: 9, country: 'France' },
  '+39': { min: 9, max: 10, country: 'Italy' },
  '+34': { min: 9, max: 9, country: 'Spain' },
  '+31': { min: 9, max: 9, country: 'Netherlands' },
  '+32': { min: 8, max: 9, country: 'Belgium' },
  '+41': { min: 9, max: 9, country: 'Switzerland' },
  '+43': { min: 10, max: 13, country: 'Austria' },
  '+46': { min: 9, max: 10, country: 'Sweden' },
  '+48': { min: 9, max: 9, country: 'Poland' },
  '+420': { min: 9, max: 9, country: 'Czech Republic' },
  '+55': { min: 10, max: 11, country: 'Brazil' },
  '+52': { min: 10, max: 10, country: 'Mexico' },
  '+81': { min: 10, max: 10, country: 'Japan' },
  '+82': { min: 9, max: 10, country: 'South Korea' },
  '+86': { min: 11, max: 11, country: 'China' },
  '+61': { min: 9, max: 9, country: 'Australia' },
}

// Country code mapping based on TLD
const TLD_TO_COUNTRY_CODE: Record<string, string> = {
  'de': '+49',
  'uk': '+44',
  'co.uk': '+44',
  'ch': '+41',
  'cz': '+420',
  'com': '+1',
  'net': '+1',
  'ca': '+1',
  'in': '+91',
  'tr': '+90',
  'eu': '+49',
  'us': '+1',
  'au': '+61',
  'fr': '+33',
  'it': '+39',
  'es': '+34',
  'nl': '+31',
  'be': '+32',
  'at': '+43',
  'se': '+46',
  'pl': '+48',
  'br': '+55',
  'mx': '+52',
  'jp': '+81',
  'kr': '+82',
  'cn': '+86',
}

export function extractTLD(url: string): string {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`)
    const hostname = urlObj.hostname
    const parts = hostname.split('.')

    if (parts.length >= 2) {
      // Handle co.uk, ltd.uk etc
      if (parts.length >= 3 && ['co', 'ltd', 'com', 'org'].includes(parts[parts.length - 2])) {
        return `${parts[parts.length - 2]}.${parts[parts.length - 1]}`
      }
      return parts[parts.length - 1]
    }
  } catch (error) {
    console.error('Error extracting TLD:', error)
  }
  return 'com'
}

export function getCountryCodeFromURL(url: string): string {
  const tld = extractTLD(url)
  return TLD_TO_COUNTRY_CODE[tld] || '+1' // Default to US
}

export function getCountryCodeFromPhone(phone: string): string | null {
  // Try to match country codes (longest first)
  const codes = Object.keys(COUNTRY_PHONE_RULES).sort((a, b) => b.length - a.length)
  for (const code of codes) {
    if (phone.startsWith(code)) {
      return code
    }
  }
  return null
}

export function validatePhoneNumber(phone: string): boolean {
  if (!phone || phone.trim() === '') return false

  phone = phone.trim()

  // Must start with +
  if (!phone.startsWith('+')) return false

  // Get country code
  const countryCode = getCountryCodeFromPhone(phone)
  if (!countryCode) return false

  // Get rules for this country
  const rules = COUNTRY_PHONE_RULES[countryCode]
  if (!rules) return false

  // Remove country code and count remaining digits
  const phoneWithoutCode = phone.substring(countryCode.length)
  const digitsOnly = phoneWithoutCode.replace(/\D/g, '')

  // Validate digit count
  return digitsOnly.length >= rules.min && digitsOnly.length <= rules.max
}

export function formatPhoneWithCountryCode(phone: string, countryCode: string): string {
  // Remove spaces, dashes, parentheses
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '')

  // If already has +, return as is
  if (cleaned.startsWith('+')) {
    return cleaned
  }

  // Add country code
  return `${countryCode}${cleaned}`
}

export function cleanPhoneNumbers(phones: string[], defaultCountryCode: string): string[] {
  if (!phones || phones.length === 0) return []

  const validPhones: string[] = []
  const seen = new Set<string>()

  for (let phone of phones) {
    phone = phone.trim()
    if (!phone) continue

    // Format with country code if needed
    if (!phone.startsWith('+')) {
      phone = formatPhoneWithCountryCode(phone, defaultCountryCode)
    }

    // Validate
    if (validatePhoneNumber(phone) && !seen.has(phone)) {
      validPhones.push(phone)
      seen.add(phone)
    }
  }

  return validPhones
}

export function validateEmail(email: string): boolean {
  if (!email || email.trim() === '') return false

  email = email.trim().toLowerCase()

  // Filter out image files
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '@2x']
  if (imageExtensions.some(ext => email.includes(ext))) {
    return false
  }

  // Filter out technical/monitoring services
  const blockedDomains = [
    'sentry.io',
    'sentry.wixpress.com',
    'sentry-next.wixpress.com',
    'gravatar.com',
    'example.com',
    'domain.com',
    'yourcompany.com',
    'test.com',
    'placeholder.com'
  ]
  if (blockedDomains.some(domain => email.includes(domain))) {
    return false
  }

  // Basic email format validation
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailPattern.test(email)) {
    return false
  }

  // Email should not be too long
  if (email.length > 100) {
    return false
  }

  // Domain should have at least one dot
  if (email.includes('@')) {
    const domain = email.split('@')[1]
    if (!domain.includes('.')) {
      return false
    }
  }

  return true
}

export function cleanEmails(emails: string[]): string[] {
  if (!emails || emails.length === 0) return []

  const validEmails: string[] = []
  const seen = new Set<string>()

  for (let email of emails) {
    email = email.trim().toLowerCase()
    if (!email) continue

    if (validateEmail(email) && !seen.has(email)) {
      validEmails.push(email)
      seen.add(email)
    }
  }

  return validEmails
}

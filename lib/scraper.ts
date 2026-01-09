import { cleanEmails, cleanPhoneNumbers, getCountryCodeFromURL } from './validator'

export interface ScrapeResult {
  phone: string
  email: string
  error: string
}

export function extractEmails(text: string): string[] {
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  const emails = text.match(emailPattern) || []
  return [...new Set(emails)].slice(0, 5) // Return up to 5 unique emails
}

export function extractPhones(text: string): string[] {
  // Multiple phone patterns to catch different formats
  const patterns = [
    /\+?\d{1,4}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
    /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
    /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/g,
    /\+\d{1,4}\s?\d{1,4}\s?\d{1,4}\s?\d{1,9}/g,
  ]

  const phones: string[] = []

  for (const pattern of patterns) {
    const found = text.match(pattern) || []
    phones.push(...found)
  }

  // Filter phones: at least 7 digits
  const cleanedPhones = phones.filter(phone => {
    const digits = phone.replace(/\D/g, '')
    return digits.length >= 7 && digits.length <= 15
  })

  return [...new Set(cleanedPhones)].slice(0, 5) // Return up to 5 unique phones
}

export async function scrapeWebsite(url: string): Promise<ScrapeResult> {
  const result: ScrapeResult = {
    phone: '',
    email: '',
    error: ''
  }

  try {
    // Normalize URL
    if (!url.startsWith('http')) {
      url = `https://${url}`
    }

    // Fetch website
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const html = await response.text()

    // Extract emails and phones
    const emails = extractEmails(html)
    const phones = extractPhones(html)

    // Get country code from URL
    const countryCode = getCountryCodeFromURL(url)

    // Clean and validate
    const cleanedPhones = cleanPhoneNumbers(phones, countryCode)
    const cleanedEmails = cleanEmails(emails)

    result.phone = cleanedPhones.join('; ')
    result.email = cleanedEmails.join('; ')

  } catch (error: any) {
    if (error.name === 'AbortError') {
      result.error = 'Timeout'
    } else if (error.message) {
      result.error = error.message.substring(0, 50)
    } else {
      result.error = 'Request failed'
    }
  }

  return result
}

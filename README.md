# 🔍 Company Contact Scraper

A modern web application to extract phone numbers and email addresses from company websites automatically.

## ✨ Features

- 📁 **CSV Upload**: Upload a CSV file with company websites
- 🌐 **Automatic Scraping**: Extracts phone numbers and emails from each website
- 🌍 **Country Detection**: Automatically adds country codes based on domain TLD
- ✅ **Smart Validation**: Validates phone numbers by country-specific rules
- 🧹 **Data Cleaning**: Removes invalid emails and phone numbers
- 📊 **Real-time Progress**: See live progress with statistics
- 💾 **CSV Export**: Download results as a clean CSV file

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd company-scraper-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Import your repository in [Vercel](https://vercel.com)

3. Vercel will automatically detect Next.js and configure the build settings

4. Click "Deploy"

That's it! Your app will be live in minutes.

### Alternative: Deploy via Vercel CLI

```bash
npm install -g vercel
vercel
```

## 📋 CSV Format

Your input CSV should have at least a "Websites" column:

```csv
Websites,Score,New Column
example.com,98,A
company.de,95,A
business.co.uk,97,A
```

## 🎯 How It Works

1. **Upload**: User uploads a CSV file with company websites
2. **Parse**: CSV is parsed and websites are extracted
3. **Scrape**: Each website is visited and HTML is analyzed
4. **Extract**: Phone numbers and emails are extracted using regex patterns
5. **Validate**:
   - Phone numbers are validated based on country-specific rules
   - Emails are validated and spam addresses are filtered
6. **Format**: Phone numbers get country codes based on domain TLD
7. **Clean**: Invalid data is removed
8. **Download**: User downloads the enhanced CSV with contact info

## 🌍 Supported Countries

Phone validation supports 20+ countries including:
- 🇺🇸 USA/Canada (+1)
- 🇩🇪 Germany (+49)
- 🇬🇧 United Kingdom (+44)
- 🇹🇷 Turkey (+90)
- 🇮🇳 India (+91)
- And many more...

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **CSV Parsing**: PapaParse
- **HTTP Client**: Axios
- **Deployment**: Vercel

## 📊 Features in Detail

### Phone Number Validation

- Validates digit count per country
- Adds missing country codes
- Removes duplicates and invalid formats
- Supports 20+ countries

### Email Validation

- Filters out image files (@2x.png, etc.)
- Removes technical service emails (sentry.io, etc.)
- Validates email format
- Removes duplicates

### Smart Scraping

- 10-second timeout per website
- 500ms rate limiting between requests
- User-Agent spoofing
- Error handling and logging

## 🔒 Privacy & Security

- All scraping happens server-side
- No data is stored permanently
- CORS protection
- Request timeout limits

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🐛 Known Issues

- Some websites block scrapers (403/403 errors)
- Timeout on very slow websites
- Some phone numbers may be incorrectly extracted if they appear in different contexts (e.g., order numbers)

## 💡 Future Improvements

- [ ] Batch processing with worker threads
- [ ] More country support
- [ ] Better phone number extraction (context-aware)
- [ ] Social media link extraction
- [ ] Address extraction
- [ ] Export to multiple formats (Excel, JSON)
- [ ] Save progress and resume later

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Made with ❤️ using Next.js and deployed on Vercel

'use client'

import { useState } from 'react'
import Papa from 'papaparse'
import axios from 'axios'

interface CompanyRow {
  Websites: string
  Score?: string
  'New Column'?: string
}

interface ProcessedRow extends CompanyRow {
  phone: string
  email: string
  scrape_error: string
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [companies, setCompanies] = useState<CompanyRow[]>([])
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentCompany, setCurrentCompany] = useState('')
  const [results, setResults] = useState<ProcessedRow[]>([])
  const [stats, setStats] = useState({
    total: 0,
    processed: 0,
    withPhone: 0,
    withEmail: 0,
    errors: 0
  })

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (!uploadedFile) return

    setFile(uploadedFile)

    Papa.parse(uploadedFile, {
      header: true,
      complete: (results) => {
        setCompanies(results.data as CompanyRow[])
        setStats(prev => ({ ...prev, total: results.data.length }))
      },
      error: (error) => {
        console.error('CSV Parse Error:', error)
        alert('Failed to parse CSV file')
      }
    })
  }

  const handleProcess = async () => {
    if (companies.length === 0) {
      alert('Please upload a CSV file first')
      return
    }

    setProcessing(true)
    setProgress(0)
    setResults([])

    const processedResults: ProcessedRow[] = []
    let successPhone = 0
    let successEmail = 0
    let errorCount = 0

    for (let i = 0; i < companies.length; i++) {
      const company = companies[i]
      setCurrentCompany(company.Websites)
      setProgress(Math.round(((i + 1) / companies.length) * 100))

      try {
        const response = await axios.post('/api/scrape', {
          website: company.Websites
        }, {
          timeout: 15000
        })

        const result: ProcessedRow = {
          ...company,
          phone: response.data.phone || '',
          email: response.data.email || '',
          scrape_error: response.data.error || ''
        }

        if (result.phone) successPhone++
        if (result.email) successEmail++
        if (result.scrape_error) errorCount++

        processedResults.push(result)
        setResults([...processedResults])

        setStats({
          total: companies.length,
          processed: i + 1,
          withPhone: successPhone,
          withEmail: successEmail,
          errors: errorCount
        })

        // Rate limiting: wait 500ms between requests
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error) {
        console.error(`Error processing ${company.Websites}:`, error)
        const result: ProcessedRow = {
          ...company,
          phone: '',
          email: '',
          scrape_error: 'Request failed'
        }
        errorCount++
        processedResults.push(result)
        setResults([...processedResults])
      }
    }

    setProcessing(false)
    setCurrentCompany('')
  }

  const handleDownload = () => {
    if (results.length === 0) return

    const csv = Papa.unparse(results)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', 'companies_with_contacts.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Company Contact Scraper
          </h1>
          <p className="text-lg text-gray-600">
            Extract phone numbers and email addresses from company websites
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            1. Upload CSV File
          </h2>

          {/* CSV Requirements */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              CSV File Requirements
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <span><strong>Required column:</strong> Must have a column named <code className="bg-white px-2 py-0.5 rounded text-blue-600 font-mono">Websites</code> (with capital W)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <span><strong>Supported formats:</strong> example.com, https://example.com, www.example.com</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <span><strong>Other columns:</strong> Any additional columns (Score, Name, etc.) will be preserved in the output</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold mt-0.5">→</span>
                <span><strong>Example:</strong> Websites,Score,Name<br/>example.com,98,Company A</span>
              </li>
            </ul>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={processing}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Choose CSV File
            </label>
            {file && (
              <div className="mt-4 text-sm text-gray-600">
                <p className="font-medium">{file.name}</p>
                <p>{companies.length} companies loaded</p>
              </div>
            )}
          </div>
        </div>

        {/* Process Section */}
        {companies.length > 0 && !processing && results.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              2. Start Processing
            </h2>
            <p className="text-gray-600 mb-6">
              This will scrape each website and extract contact information.
              Estimated time: ~{Math.round(companies.length * 0.5 / 60)} minutes
            </p>
            <button
              onClick={handleProcess}
              className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-lg font-medium text-lg transition-colors"
            >
              Start Processing {companies.length} Companies
            </button>
          </div>
        )}

        {/* Processing Status */}
        {processing && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Processing...
            </h2>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Progress</span>
                <span className="font-semibold text-gray-900">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-600 text-sm">Processed</p>
                <p className="text-2xl font-bold text-blue-600">{stats.processed}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-600 text-sm">With Phone</p>
                <p className="text-2xl font-bold text-green-600">{stats.withPhone}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-purple-600 text-sm">With Email</p>
                <p className="text-2xl font-bold text-purple-600">{stats.withEmail}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-600 text-sm">Errors</p>
                <p className="text-2xl font-bold text-red-600">{stats.errors}</p>
              </div>
            </div>

            <div className="text-center text-gray-600">
              <p className="text-sm">Currently processing:</p>
              <p className="font-medium text-gray-900 mt-1">{currentCompany}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {results.length > 0 && !processing && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              3. Download Results
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-sm">Total Companies</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-600 text-sm">Phone Numbers</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.withPhone} ({Math.round(stats.withPhone/stats.total*100)}%)
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-purple-600 text-sm">Email Addresses</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.withEmail} ({Math.round(stats.withEmail/stats.total*100)}%)
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-600 text-sm">Errors</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.errors} ({Math.round(stats.errors/stats.total*100)}%)
                </p>
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-lg font-medium text-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download CSV with Contacts
            </button>

            <div className="mt-6">
              <button
                onClick={() => {
                  setResults([])
                  setCompanies([])
                  setFile(null)
                  setStats({
                    total: 0,
                    processed: 0,
                    withPhone: 0,
                    withEmail: 0,
                    errors: 0
                  })
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Process Another File
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

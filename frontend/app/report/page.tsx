 'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function ReportPage() {
  const router = useRouter()
  const [report, setReport] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const generateReport = async () => {
      const storedDataset = sessionStorage.getItem('dataset')
      const storedConfig = sessionStorage.getItem('datasetConfig')
      
      if (!storedDataset || !storedConfig) {
        router.push('/configure')
        return
      }

      try {
        const dataset = JSON.parse(storedDataset)
        const config = JSON.parse(storedConfig)
        
        const response = await axios.post(`${API_URL}/api/explain-attack`, {
          dataset,
          ...config,
        })
        
        setReport(response.data.report)
      } catch (error: any) {
        console.error('Error generating report:', error)
        setError(error.response?.data?.detail || error.message)
      } finally {
        setIsGenerating(false)
      }
    }

    generateReport()
  }, [router])

  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>DDoS Attack Report</title>
            <style>
              body { font-family: 'Inter', Arial, sans-serif; padding: 40px; line-height: 1.6; }
              h1 { color: #000; font-weight: 300; }
              h2 { color: #000; font-weight: 300; margin-top: 30px; }
              pre { background: #f4f4f4; padding: 20px; border-radius: 8px; white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <h1>DDoS Attack Simulation Report</h1>
            <pre>${report}</pre>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleRestart = () => {
    sessionStorage.clear()
    router.push('/configure')
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-black text-xl font-light mb-4">Generating attack explanation report...</div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="p-8 border-2 border-red-200 bg-red-50 max-w-md">
          <h2 className="text-2xl font-light text-black mb-4">Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/analysis')}
            className="btn-smooth px-6 py-3 border-2 border-black text-black 
                     font-light hover:bg-black hover:text-white transition-all duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white page-transition">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-32">
        {/* Header */}
        <div className="mb-16">
          <div className="w-2 h-2 bg-black rounded-full mb-6" />
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-light text-black mb-4">
                Attack Report
              </h1>
              <p className="text-xl text-black/60 font-light">
                AI-generated analysis of the DDoS attack simulation
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleDownloadPDF}
                className="btn-smooth px-6 py-3 border-2 border-black/20 text-black 
                         font-light hover:border-black transition-all duration-300"
              >
                Download PDF
              </button>
              <button
                onClick={handleRestart}
                className="btn-smooth px-6 py-3 border-2 border-black/20 text-black 
                         font-light hover:border-black transition-all duration-300"
              >
                New Simulation
              </button>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="p-12 border-2 border-black/10">
          <div className="prose max-w-none text-black/90 leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {report}
            </ReactMarkdown>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-black/40 text-sm font-light">
          <p>Report generated by AI • DDoS Attack Simulation & SNA Visualizer</p>
        </div>
      </div>
    </div>
  )
}

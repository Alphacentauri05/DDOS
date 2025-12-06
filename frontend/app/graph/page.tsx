'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function GraphPage() {
  const router = useRouter()
  const [graphUrl, setGraphUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const generateGraph = async () => {
      const storedDataset = sessionStorage.getItem('dataset')
      if (!storedDataset) {
        router.push('/configure')
        return
      }

      try {
        const dataset = JSON.parse(storedDataset)
        const response = await axios.post(
          `${API_URL}/api/graph`,
          { dataset },
          { responseType: 'blob' }
        )
        
        const blob = new Blob([response.data], { type: 'text/html' })
        const url = window.URL.createObjectURL(blob)
        setGraphUrl(url)
      } catch (error: any) {
        console.error('Error generating graph:', error)
        setError(error.response?.data?.detail || error.message)
      } finally {
        setIsLoading(false)
      }
    }

    generateGraph()
  }, [router])

  const handleGenerateReport = () => {
    router.push('/report')
  }

  const handleBack = () => {
    router.push('/analysis')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black text-xl font-light">Generating network graph...</div>
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
            onClick={handleBack}
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
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-32">
        {/* Header */}
        <div className="mb-16">
          <div className="w-2 h-2 bg-black rounded-full mb-6" />
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-light text-black mb-4">
                Network Graph
              </h1>
              <p className="text-xl text-black/60 font-light">
                Interactive social network analysis visualization
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleBack}
                className="btn-smooth px-6 py-3 border-2 border-black/20 text-black 
                         font-light hover:border-black transition-all duration-300"
              >
                Back
              </button>
              <button
                onClick={handleGenerateReport}
                className="btn-smooth px-6 py-3 border-2 border-black text-black 
                         font-light hover:bg-black hover:text-white transition-all duration-300"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="p-6 border-2 border-black/10 mb-8 bg-black/5">
          <h3 className="text-lg font-light text-black mb-4">Legend</h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="text-black/70 font-light">Servers</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-black/70 font-light">Bots</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-black/70 font-light">Normal Users</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500"></div>
              <span className="text-black/70 font-light">Attack Connections</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-black/30"></div>
              <span className="text-black/70 font-light">Normal Connections</span>
            </div>
          </div>
        </div>

        {/* Graph Container */}
        <div className="border-2 border-black/10 overflow-hidden">
          {graphUrl ? (
            <iframe
              src={graphUrl}
              className="w-full h-[800px] border-0"
              title="Network Graph"
            />
          ) : (
            <div className="w-full h-[800px] flex items-center justify-center text-black/50 font-light">
              Loading graph...
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 border-2 border-black/10 bg-black/5">
          <p className="text-sm text-black/70 font-light">
            <strong className="font-normal">Tip:</strong> You can drag nodes to rearrange the graph. 
            The thickness of edges represents the number of packets sent. 
            Red edges indicate attack connections, while gray edges indicate normal traffic.
          </p>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function DatasetPage() {
  const router = useRouter()
  const [dataset, setDataset] = useState<any[]>([])
  const [csvData, setCsvData] = useState<string>('')

  useEffect(() => {
    const storedDataset = sessionStorage.getItem('dataset')
    const storedCsv = sessionStorage.getItem('csvData')
    
    if (storedDataset) {
      setDataset(JSON.parse(storedDataset))
    }
    if (storedCsv) {
      setCsvData(storedCsv)
    }
    
    if (!storedDataset) {
      router.push('/configure')
    }
  }, [router])

  const handleDownloadCSV = () => {
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'network_traffic_dataset.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleAnalyze = () => {
    router.push('/analysis')
  }

  if (dataset.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black text-xl font-light">Loading dataset...</div>
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
                Generated Dataset
              </h1>
              <p className="text-xl text-black/60 font-light">
                {dataset.length} network traffic records
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleDownloadCSV}
                className="btn-smooth px-6 py-3 border-2 border-black/20 text-black 
                         font-light hover:border-black transition-all duration-300"
              >
                Download CSV
              </button>
              <button
                onClick={handleAnalyze}
                className="btn-smooth px-6 py-3 border-2 border-black text-black 
                         font-light hover:bg-black hover:text-white transition-all duration-300"
              >
                Analyze Dataset
              </button>
            </div>
          </div>
        </div>

        {/* Dataset Table */}
        <div className="border-2 border-black/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/5">
                <tr>
                  <th className="px-6 py-4 text-left text-black font-light text-sm uppercase tracking-wide">Source Node</th>
                  <th className="px-6 py-4 text-left text-black font-light text-sm uppercase tracking-wide">Destination Node</th>
                  <th className="px-6 py-4 text-left text-black font-light text-sm uppercase tracking-wide">Packets Sent</th>
                  <th className="px-6 py-4 text-left text-black font-light text-sm uppercase tracking-wide">Connection Type</th>
                </tr>
              </thead>
              <tbody>
                {dataset.map((row, index) => (
                  <tr
                    key={index}
                    className="border-t border-black/5 hover:bg-black/5 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-black font-light">{row.source_node}</td>
                    <td className="px-6 py-4 text-black font-light">{row.destination_node}</td>
                    <td className="px-6 py-4">
                      <span className={`font-light ${
                        parseInt(row.packets_sent) > 1000 
                          ? 'text-red-600' 
                          : 'text-black/70'
                      }`}>
                        {row.packets_sent}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-light ${
                        row.connection_type === 'attack'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {row.connection_type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-6 mt-12">
          <div className="p-6 border-2 border-black/10">
            <p className="text-sm text-black/50 font-light mb-2">Total Records</p>
            <p className="text-3xl font-light text-black">{dataset.length}</p>
          </div>
          <div className="p-6 border-2 border-black/10">
            <p className="text-sm text-black/50 font-light mb-2">Attack Connections</p>
            <p className="text-3xl font-light text-red-600">
              {dataset.filter(r => r.connection_type === 'attack').length}
            </p>
          </div>
          <div className="p-6 border-2 border-black/10">
            <p className="text-sm text-black/50 font-light mb-2">Normal Connections</p>
            <p className="text-3xl font-light text-green-600">
              {dataset.filter(r => r.connection_type === 'normal').length}
            </p>
          </div>
          <div className="p-6 border-2 border-black/10">
            <p className="text-sm text-black/50 font-light mb-2">Total Packets</p>
            <p className="text-3xl font-light text-black">
              {dataset.reduce((sum, r) => sum + parseInt(r.packets_sent || 0), 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function AnalysisPage() {
  const router = useRouter()
  const [analysis, setAnalysis] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const analyzeDataset = async () => {
      const storedDataset = sessionStorage.getItem('dataset')
      if (!storedDataset) {
        router.push('/configure')
        return
      }

      try {
        const dataset = JSON.parse(storedDataset)
        const response = await axios.post(`${API_URL}/api/analyze`, { dataset })
        setAnalysis(response.data)
      } catch (error: any) {
        console.error('Error analyzing dataset:', error)
        alert(`Error: ${error.response?.data?.detail || error.message}`)
      } finally {
        setIsLoading(false)
      }
    }

    analyzeDataset()
  }, [router])

  const handleViewGraph = () => {
    router.push('/graph')
  }

  const handleRestart = () => {
    sessionStorage.clear()
    router.push('/configure')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black text-xl font-light">Analyzing dataset...</div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black text-xl font-light">No analysis data available</div>
      </div>
    )
  }

  const topTalkersData = analysis.top_talkers?.slice(0, 10).map((item: any) => ({
    name: item.node,
    packets: item.packets,
  })) || []

  const connectionTypeData = [
    { name: 'Normal', value: analysis.connection_counts?.normal || 0 },
    { name: 'Attack', value: analysis.connection_counts?.attack || 0 },
  ]

  const histogramData = Object.entries(analysis.packets_histogram || {}).map(([name, value]) => ({
    name,
    value,
  }))

  const COLORS = ['#10b981', '#ef4444']

  return (
    <div className="min-h-screen bg-white page-transition">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-32">
        {/* Header */}
        <div className="mb-16">
          <div className="w-2 h-2 bg-black rounded-full mb-6" />
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-light text-black mb-4">
                Traffic Analysis
              </h1>
              <p className="text-xl text-black/60 font-light">
                Statistical analysis of network traffic patterns
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleViewGraph}
                className="btn-smooth px-6 py-3 border-2 border-black text-black 
                         font-light hover:bg-black hover:text-white transition-all duration-300"
              >
                View Graph
              </button>
              <button
                onClick={handleRestart}
                className="btn-smooth px-6 py-3 border-2 border-black/20 text-black 
                         font-light hover:border-black transition-all duration-300"
              >
                Restart
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="p-6 border-2 border-black/10">
            <p className="text-sm text-black/50 font-light mb-2">Victim Server</p>
            <p className="text-2xl font-light text-black">
              {analysis.victim_server?.node || 'N/A'}
            </p>
            <p className="text-sm text-black/60 font-light mt-2">
              {analysis.victim_server?.incoming_packets?.toLocaleString() || 0} packets
            </p>
          </div>
          <div className="p-6 border-2 border-black/10">
            <p className="text-sm text-black/50 font-light mb-2">Bots Attacking</p>
            <p className="text-2xl font-light text-red-600">
              {analysis.bots_attacking || 0}
            </p>
          </div>
          <div className="p-6 border-2 border-black/10">
            <p className="text-sm text-black/50 font-light mb-2">Total Connections</p>
            <p className="text-2xl font-light text-black">
              {analysis.total_connections || 0}
            </p>
          </div>
          <div className="p-6 border-2 border-black/10">
            <p className="text-sm text-black/50 font-light mb-2">Anomalies</p>
            <p className="text-2xl font-light text-yellow-600">
              {analysis.anomaly_detection?.anomaly_count || 0}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 border-2 border-black/10">
            <h3 className="text-2xl font-light text-black mb-6">Top Talkers</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topTalkersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#00000010" />
                <XAxis dataKey="name" stroke="#00000060" fontSize={12} angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#00000060" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #00000020', borderRadius: '4px' }} />
                <Bar dataKey="packets" fill="#000" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-8 border-2 border-black/10">
            <h3 className="text-2xl font-light text-black mb-6">Connection Types</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={connectionTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {connectionTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #00000020', borderRadius: '4px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Packets Histogram */}
        <div className="p-8 border-2 border-black/10 mb-16">
          <h3 className="text-2xl font-light text-black mb-6">Packets Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={histogramData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#00000010" />
              <XAxis dataKey="name" stroke="#00000060" />
              <YAxis stroke="#00000060" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #00000020', borderRadius: '4px' }} />
              <Bar dataKey="value" fill="#000" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Statistics */}
        <div className="p-8 border-2 border-black/10">
          <h3 className="text-2xl font-light text-black mb-6">Packet Statistics</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-black/50 font-light mb-2">Mean</p>
              <p className="text-2xl font-light text-black">
                {analysis.packets_statistics?.mean?.toFixed(2) || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-black/50 font-light mb-2">Median</p>
              <p className="text-2xl font-light text-black">
                {analysis.packets_statistics?.median?.toFixed(2) || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-black/50 font-light mb-2">Std Deviation</p>
              <p className="text-2xl font-light text-black">
                {analysis.packets_statistics?.std?.toFixed(2) || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

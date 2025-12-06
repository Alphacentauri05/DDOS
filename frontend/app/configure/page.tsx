'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function ConfigurePage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState({
    number_of_servers: 3,
    number_of_bots: 10,
    total_nodes: 30,
    attack_enabled: true,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : parseInt(value) || 0,
    }))
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const response = await axios.post(`${API_URL}/api/generate-dataset`, formData)
      
      sessionStorage.setItem('dataset', JSON.stringify(response.data.dataset))
      sessionStorage.setItem('datasetConfig', JSON.stringify(formData))
      sessionStorage.setItem('csvData', response.data.csv_data)
      
      router.push('/dataset')
    } catch (error: any) {
      console.error('Error generating dataset:', error)
      alert(`Error: ${error.response?.data?.detail || error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const normalUsers = formData.total_nodes - formData.number_of_servers - formData.number_of_bots

  return (
    <div className="min-h-screen bg-white page-transition">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-32">
        {/* Header */}
        <div className="mb-16">
          <div className="w-2 h-2 bg-black rounded-full mb-6" />
          <h1 className="text-5xl md:text-6xl font-light text-black mb-4">
            Dataset Configuration
          </h1>
          <p className="text-xl text-black/60 font-light">
            Configure your network simulation parameters
          </p>
        </div>

        {/* Configuration Form */}
        <div className="space-y-8">
          {/* Number of Servers */}
          <div>
            <label className="block text-black font-light mb-3 text-lg">
              Number of Servers
            </label>
            <input
              type="number"
              name="number_of_servers"
              value={formData.number_of_servers}
              onChange={handleInputChange}
              min="1"
              max="20"
              className="w-full px-6 py-4 border-2 border-black/20 text-black bg-white 
                       focus:outline-none focus:border-black transition-all duration-300 
                       font-light text-lg"
            />
            <p className="text-sm text-black/50 font-light mt-2">
              Servers that will receive traffic
            </p>
          </div>

          {/* Number of Bots */}
          <div>
            <label className="block text-black font-light mb-3 text-lg">
              Number of Bots
            </label>
            <input
              type="number"
              name="number_of_bots"
              value={formData.number_of_bots}
              onChange={handleInputChange}
              min="0"
              max="50"
              className="w-full px-6 py-4 border-2 border-black/20 text-black bg-white 
                       focus:outline-none focus:border-black transition-all duration-300 
                       font-light text-lg"
            />
            <p className="text-sm text-black/50 font-light mt-2">
              Malicious nodes that will attack if enabled
            </p>
          </div>

          {/* Total Nodes */}
          <div>
            <label className="block text-black font-light mb-3 text-lg">
              Total Nodes
            </label>
            <input
              type="number"
              name="total_nodes"
              value={formData.total_nodes}
              onChange={handleInputChange}
              min={formData.number_of_servers + formData.number_of_bots}
              max="100"
              className="w-full px-6 py-4 border-2 border-black/20 text-black bg-white 
                       focus:outline-none focus:border-black transition-all duration-300 
                       font-light text-lg"
            />
            <p className="text-sm text-black/50 font-light mt-2">
              Total nodes in the network (servers + bots + normal users)
            </p>
          </div>

          {/* Normal Users Display */}
          <div className="p-6 border-2 border-black/10 bg-black/5">
            <p className="text-black font-light">
              <span className="font-normal">Normal Users:</span>{' '}
              <span className="text-black/70">{normalUsers}</span>
            </p>
          </div>

          {/* Attack Toggle */}
          <div className="flex items-center justify-between p-6 border-2 border-black/10 bg-black/5">
            <div>
              <label className="block text-black font-light mb-2 text-lg">
                Enable DDoS Attack?
              </label>
              <p className="text-sm text-black/60 font-light">
                When enabled, bots will target a single server
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="attack_enabled"
                checked={formData.attack_enabled}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-black/20 peer-focus:outline-none peer-focus:ring-4 
                            peer-focus:ring-black/20 rounded-full peer peer-checked:after:translate-x-full 
                            peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 
                            after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full 
                            after:h-6 after:w-6 after:transition-all peer-checked:bg-black"></div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-8">
            <button
              onClick={() => router.push('/')}
              className="btn-smooth flex-1 px-8 py-4 border-2 border-black/20 text-black 
                       font-light text-lg hover:border-black transition-all duration-300"
            >
              Back
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || normalUsers < 0}
              className="btn-smooth flex-1 px-8 py-4 border-2 border-black text-black 
                       font-light text-lg hover:bg-black hover:text-white 
                       disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isGenerating ? 'Generating...' : 'Generate Dataset'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

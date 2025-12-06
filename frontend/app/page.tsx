 'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
// import AnimatedNetwork from '@/components/AnimatedNetwork'

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleStart = () => {
    setIsLoading(true)
    router.push('/configure')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-32">
          <div className="grid md:grid-cols-2 gap-16 items-center w-full">
            {/* Left: Text Content */}
            <div className="max-w-2xl">
              {/* Main Headline */}
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-black mb-8 leading-tight fade-in">
                DDoS Attack Simulation
                <br />
                <span className="font-normal">SNA Visualizer</span>
              </h1>
            
              {/* Description */}
              <p className="text-xl md:text-2xl text-black/70 font-light mb-12 leading-relaxed fade-in" style={{ animationDelay: '0.2s' }}>
                A digital tool for understanding network security through interactive simulation, 
                AI-powered analysis, and elegant visualizations.
              </p>

              {/* CTA Button */}
              <button
                onClick={handleStart}
                disabled={isLoading}
                className="btn-smooth inline-flex items-center gap-3 px-8 py-4 border-2 border-black text-black font-light text-lg 
                         hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed fade-in"
                style={{ animationDelay: '0.4s' }}
              >
                <span>{isLoading ? 'Loading...' : 'Start Simulation'}</span>
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>

            {/* Right: Hero Image (network visualization) */}
            <div className="hidden md:flex items-center justify-center fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="relative w-full flex items-center justify-center">
                <Image
                  src="/hero-graph.png"
                  alt="Network visualization"
                  width={820}
                  height={680}
                  priority
                  className="w-[520px] md:w-[640px] lg:w-[820px] object-contain -translate-y-6 drop-shadow-2xl rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left: Visual/Content */}
            <div className="space-y-8">
              <div className="w-2 h-2 bg-black rounded-full" />
              <p className="text-lg text-black/70 font-light leading-relaxed">
                A <strong className="font-normal text-black">Distributed Denial of Service (DDoS)</strong> attack 
                is a malicious attempt to disrupt the normal traffic of a targeted server, service, or network 
                by overwhelming it with a flood of internet traffic from multiple sources.
              </p>
              <p className="text-lg text-black/70 font-light leading-relaxed">
                This simulation tool doesn't compromise on accuracy. We build visualizations exactly as they 
                were designed, with no shortcuts or simplifications.
              </p>
            </div>

            {/* Right: Features List */}
            <div className="space-y-6">
              <div className="stagger-item">
                <h3 className="text-2xl font-light text-black mb-4">What you'll explore</h3>
              </div>
              <ul className="space-y-4">
                <li className="stagger-item flex items-start gap-4">
                  <span className="text-black/40 mt-1">01</span>
                  <div>
                    <h4 className="font-light text-black mb-1">AI-Powered Dataset Generation</h4>
                    <p className="text-sm text-black/60 font-light">Synthetic network traffic datasets using advanced LLM models</p>
                  </div>
                </li>
                <li className="stagger-item flex items-start gap-4">
                  <span className="text-black/40 mt-1">02</span>
                  <div>
                    <h4 className="font-light text-black mb-1">Network Graph Visualization</h4>
                    <p className="text-sm text-black/60 font-light">Interactive SNA graphs showing attack patterns and topology</p>
                  </div>
                </li>
                <li className="stagger-item flex items-start gap-4">
                  <span className="text-black/40 mt-1">03</span>
                  <div>
                    <h4 className="font-light text-black mb-1">Statistical Analysis</h4>
                    <p className="text-sm text-black/60 font-light">Comprehensive traffic statistics and anomaly detection</p>
                  </div>
                </li>
                <li className="stagger-item flex items-start gap-4">
                  <span className="text-black/40 mt-1">04</span>
                  <div>
                    <h4 className="font-light text-black mb-1">AI-Generated Reports</h4>
                    <p className="text-sm text-black/60 font-light">Detailed explanations of attack mechanisms and patterns</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <h2 className="text-5xl md:text-6xl font-light mb-4">Our capabilities</h2>
            <p className="text-xl text-white/60 font-light">From data generation to visualization — we build tools for understanding network security.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="hover-lift p-8 border border-white/10 hover:border-white/30 transition-all duration-300">
              <div className="text-4xl mb-6">📊</div>
              <h3 className="text-2xl font-light mb-3">Data Analysis</h3>
              <p className="text-white/60 font-light leading-relaxed">
                Comprehensive traffic statistics and anomaly detection with real-time insights.
              </p>
            </div>
            <div className="hover-lift p-8 border border-white/10 hover:border-white/30 transition-all duration-300">
              <div className="text-4xl mb-6">🕸️</div>
              <h3 className="text-2xl font-light mb-3">Network Graphs</h3>
              <p className="text-white/60 font-light leading-relaxed">
                Interactive visualizations of network topology with smooth animations.
              </p>
            </div>
            <div className="hover-lift p-8 border border-white/10 hover:border-white/30 transition-all duration-300">
              <div className="text-4xl mb-6">📝</div>
              <h3 className="text-2xl font-light mb-3">AI Reports</h3>
              <p className="text-white/60 font-light leading-relaxed">
                Detailed explanations generated by advanced AI models for clear understanding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-5xl md:text-6xl font-light text-black mb-8">
            Have an idea?
          </h2>
          <p className="text-xl text-black/60 font-light mb-12 max-w-2xl mx-auto">
            Start exploring how DDoS attacks work through interactive simulation and analysis.
          </p>
          <button
            onClick={handleStart}
            className="btn-smooth inline-flex items-center gap-3 px-8 py-4 border-2 border-black text-black font-light text-lg 
                     hover:bg-black hover:text-white"
          >
            <span>Start Simulation</span>
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  )
}

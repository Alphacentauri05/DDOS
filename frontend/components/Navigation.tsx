'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Configure', path: '/configure' },
    { name: 'Dataset', path: '/dataset' },
    { name: 'Analysis', path: '/analysis' },
    { name: 'Graph', path: '/graph' },
    { name: 'Report', path: '/report' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 smooth bg-white ${isScrolled ? 'shadow-sm' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => router.push('/')}
            className="text-lg md:text-3xl font-semibold tracking-tight text-black/95 btn-smooth hover-lift"
            aria-label="Go home"
          >
            Ddos Insight
          </button>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-10">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`relative text-sm font-normal tracking-wide transition-colors duration-200 ${
                  pathname === item.path ? 'text-black' : 'text-black/60 hover:text-black'
                }`}
              >
                {item.name}
                {pathname === item.path && (
                  <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-black" />
                )}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-black">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}


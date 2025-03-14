'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

type TimingFunction = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut'

export default function TimingDemo() {
  const [selectedTiming, setSelectedTiming] = useState<TimingFunction>('linear')
  const [isAnimating, setIsAnimating] = useState(false)

  const handleAnimate = () => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 1500)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4">
        {(['linear', 'easeIn', 'easeOut', 'easeInOut'] as TimingFunction[]).map(timing => (
          <label
            key={timing}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              name="timing"
              value={timing}
              checked={selectedTiming === timing}
              onChange={(e) => setSelectedTiming(e.target.value as TimingFunction)}
              className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
            />
            <span className="capitalize">
              {timing.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}
            </span>
          </label>
        ))}
      </div>

      <div className="h-[300px] bg-gray-100 rounded-lg relative">
        <motion.div
          animate={{ x: isAnimating ? 'calc(100% - 128px)' : 0 }}
          initial={{ x: 0 }}
          transition={{
            duration: 1.5,
            ease: selectedTiming.toLowerCase()
          }}
          className="w-32 h-32 bg-blue-500 rounded-lg flex items-center justify-center text-white font-semibold absolute top-1/2 -translate-y-1/2"
        >
          Timing Box
        </motion.div>
      </div>

      <button
        onClick={handleAnimate}
        disabled={isAnimating}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAnimating ? 'Animating...' : 'Start Animation'}
      </button>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Current Timing Function:</h4>
        <code className="text-sm">
          transition-timing-function: {selectedTiming.toLowerCase().replace(/([A-Z])/g, '-$1')};
        </code>
      </div>
    </div>
  )
} 
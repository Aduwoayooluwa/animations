'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

type PerformanceMetric = {
  fps: number
  timestamp: number
}

export default function PerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [animationCount, setAnimationCount] = useState(10)
  const [useTransform, setUseTransform] = useState(true)
  const frameRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)

  // FPS monitoring
  useEffect(() => {
    if (!isMonitoring) {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      return
    }

    const measureFPS = (timestamp: number) => {
      if (lastTimeRef.current) {
        const delta = timestamp - lastTimeRef.current
        const fps = Math.round(1000 / delta)

        setMetrics(prev => [
          ...prev.slice(-50),
          { fps, timestamp }
        ])
      }

      lastTimeRef.current = timestamp
      frameRef.current = requestAnimationFrame(measureFPS)
    }

    frameRef.current = requestAnimationFrame(measureFPS)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [isMonitoring])

  const averageFPS = metrics.length > 0
    ? Math.round(metrics.reduce((sum, m) => sum + m.fps, 0) / metrics.length)
    : 0

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Frame Rate Monitor</h3>
          <p className="text-gray-600 mb-4">
            Monitor the frames per second (FPS) while animations are running.
            A stable 60 FPS indicates smooth performance.
          </p>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-2xl font-bold">{averageFPS}</span>
                <span className="text-gray-500 ml-2">FPS</span>
              </div>
              <button
                onClick={() => setIsMonitoring(!isMonitoring)}
                className={`px-4 py-2 rounded text-white ${
                  isMonitoring ? 'bg-red-500' : 'bg-green-500'
                }`}
              >
                {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
              </button>
            </div>
            <div className="h-32 relative border border-gray-200 rounded">
              {metrics.map((metric, i) => (
                <div
                  key={metric.timestamp}
                  className="absolute bottom-0 bg-blue-500 w-1"
                  style={{
                    height: `${(metric.fps / 60) * 100}%`,
                    left: `${(i / 50) * 100}%`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Performance Comparison</h3>
          <p className="text-gray-600 mb-4">
            Compare the performance impact of different animation techniques and quantities.
          </p>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Animated Elements
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={animationCount}
                  onChange={(e) => setAnimationCount(parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-gray-500">{animationCount} elements</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="useTransform"
                  checked={useTransform}
                  onChange={(e) => setUseTransform(e.target.checked)}
                />
                <label htmlFor="useTransform" className="text-sm text-gray-700">
                  Use transform instead of top/left
                </label>
              </div>
            </div>

            <div className="h-64 relative bg-gray-50 rounded overflow-hidden">
              {Array.from({ length: animationCount }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 bg-blue-500 rounded-full"
                  animate={useTransform ? {
                    x: [0, 100, 0],
                    y: [0, 100, 0]
                  } : {
                    left: ['0px', '100px', '0px'],
                    top: ['0px', '100px', '0px']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                  style={{
                    left: useTransform ? `${(i % 10) * 10}%` : undefined,
                    top: useTransform ? `${Math.floor(i / 10) * 10}%` : undefined
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Performance Tips</h3>
          <div className="bg-blue-50 p-6 rounded-lg">
            <ul className="space-y-4 text-gray-700">
              <li className="flex gap-3">
                <span className="text-blue-500">✓</span>
                <div>
                  <strong>Use transform and opacity</strong>
                  <p className="text-sm text-gray-600">
                    These properties are optimized by browsers and can be hardware accelerated.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-500">✓</span>
                <div>
                  <strong>Promote to new layer</strong>
                  <p className="text-sm text-gray-600">
                    Use will-change or transform3d to create a new compositor layer for heavy animations.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-500">✓</span>
                <div>
                  <strong>Debounce scroll handlers</strong>
                  <p className="text-sm text-gray-600">
                    Limit the frequency of scroll-based animations to maintain smooth performance.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-500">✓</span>
                <div>
                  <strong>Reduce paint area</strong>
                  <p className="text-sm text-gray-600">
                    Minimize the size of animated elements and the area that needs to be repainted.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
} 
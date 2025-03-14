'use client'

import { useState, useRef, useEffect } from 'react'

type AnimationProperty = {
  name: string
  description: string
  values: string[]
}

export default function CSSAnimations() {
  const [selectedProperties, setSelectedProperties] = useState<Record<string, string>>({
    animation: 'fade-in',
    duration: '1s',
    timing: 'ease',
    iteration: 'infinite',
    direction: 'alternate'
  })
  const [showTimeline, setShowTimeline] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)
  const progressRef = useRef<number>(0)
  const animationRef = useRef<number | null>(null)
  const duration = parseFloat(selectedProperties.duration) || 1

  const properties: Record<string, AnimationProperty> = {
    animation: {
      name: 'Animation Type',
      description: 'Pre-defined animation sequences',
      values: ['fade-in', 'slide-in', 'rotate', 'pulse', 'bounce', 'none']
    },
    duration: {
      name: 'Duration',
      description: 'Time taken for one animation cycle',
      values: ['0.5s', '1s', '2s', '3s', '5s']
    },
    timing: {
      name: 'Timing Function',
      description: 'Controls the acceleration of the animation',
      values: ['ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out']
    },
    iteration: {
      name: 'Iteration Count',
      description: 'Number of times the animation repeats',
      values: ['1', '2', '3', 'infinite']
    },
    direction: {
      name: 'Direction',
      description: 'Defines whether the animation should alternate',
      values: ['normal', 'reverse', 'alternate', 'alternate-reverse']
    }
  }

  const handlePropertyChange = (property: string, value: string) => {
    setSelectedProperties(prev => ({ ...prev, [property]: value }))
  }

  const getAnimationClass = () => {
    if (selectedProperties.animation === 'none') return ''
    return selectedProperties.animation
  }

  const getAnimationStyle = () => {
    if (selectedProperties.animation === 'none') return {}
    
    return {
      animationName: selectedProperties.animation,
      animationDuration: selectedProperties.duration,
      animationTimingFunction: selectedProperties.timing,
      animationIterationCount: selectedProperties.iteration,
      animationDirection: selectedProperties.direction,
      animationPlayState: showTimeline ? 'paused' : 'running'
    }
  }

  const getCodeSnippet = () => {
    if (selectedProperties.animation === 'none') return '.element {\n  /* No animation applied */\n}'
    
    return `.element {
  animation: ${selectedProperties.animation} ${selectedProperties.duration} ${selectedProperties.timing} ${selectedProperties.iteration} ${selectedProperties.direction};
}

@keyframes ${selectedProperties.animation} {
  ${getKeyframesCode(selectedProperties.animation)}
}`
  }

  const getKeyframesCode = (animation: string) => {
    switch (animation) {
      case 'fade-in':
        return `0% { opacity: 0; }
  100% { opacity: 1; }`
      case 'slide-in':
        return `0% { transform: translateX(-100%); }
  100% { transform: translateX(0); }`
      case 'rotate':
        return `0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }`
      case 'pulse':
        return `0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }`
      case 'bounce':
        return `0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-30px); }`
      default:
        return ''
    }
  }

  // For tracking animation progress when timeline is shown
  useEffect(() => {
    if (showTimeline) {
      // Start animation tracking
      const startTime = performance.now()
      const animationDuration = duration * 1000 // convert to ms
      
      const updateProgress = (timestamp: number) => {
        const elapsed = timestamp - startTime
        
        // For infinite animations, loop the progress
        if (selectedProperties.iteration === 'infinite') {
          progressRef.current = (elapsed % animationDuration) / animationDuration
        } else {
          // For finite animations, cap at 100%
          progressRef.current = Math.min(elapsed / animationDuration, 1)
        }
        
        setAnimationProgress(progressRef.current)
        
        // Continue animation loop
        animationRef.current = requestAnimationFrame(updateProgress)
      }
      
      animationRef.current = requestAnimationFrame(updateProgress)
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }
  }, [showTimeline, duration, selectedProperties.iteration])

  // Returns keyframe positions for the current animation
  const getKeyframePositions = () => {
    switch (selectedProperties.animation) {
      case 'fade-in':
        return [0, 100]
      case 'slide-in':
        return [0, 100]
      case 'rotate':
        return [0, 100]
      case 'pulse':
        return [0, 50, 100]
      case 'bounce':
        return [0, 50, 100]
      default:
        return [0, 100]
    }
  }

  // Helper function to get property value at specific keyframe
  const getPropertyValueAtKeyframe = (property: string, keyframe: number) => {
    const animation = selectedProperties.animation
    
    if (animation === 'fade-in') {
      if (property === 'opacity') {
        return keyframe === 0 ? '0' : '1'
      }
    } else if (animation === 'slide-in') {
      if (property === 'transform') {
        return keyframe === 0 ? 'translateX(-100%)' : 'translateX(0)'
      }
    } else if (animation === 'rotate') {
      if (property === 'transform') {
        return keyframe === 0 ? 'rotate(0deg)' : 'rotate(360deg)'
      }
    } else if (animation === 'pulse') {
      if (property === 'transform') {
        if (keyframe === 0 || keyframe === 100) return 'scale(1)'
        if (keyframe === 50) return 'scale(1.2)'
      }
    } else if (animation === 'bounce') {
      if (property === 'transform') {
        if (keyframe === 0 || keyframe === 100) return 'translateY(0)'
        if (keyframe === 50) return 'translateY(-30px)'
      }
    }
    
    return '-'
  }

  // Determine which changing properties to display in timeline
  const getTimelineProperties = () => {
    const animation = selectedProperties.animation
    
    if (animation === 'fade-in') return ['opacity']
    if (animation === 'slide-in') return ['transform']
    if (animation === 'rotate') return ['transform']
    if (animation === 'pulse') return ['transform']
    if (animation === 'bounce') return ['transform']
    
    return []
  }

  // Set the animation element to a specific point in the animation
  const setAnimationPoint = (progressPoint: number) => {
    progressRef.current = progressPoint
    setAnimationProgress(progressPoint)
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Interactive Properties</h3>
            {Object.entries(properties).map(([key, property]) => (
              <div key={key} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {property.name}
                  <span className="ml-2 text-xs text-gray-500">{property.description}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {property.values.map(value => (
                    <button
                      key={value}
                      onClick={() => handlePropertyChange(key, value)}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        selectedProperties[key] === value
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {value === 'none' ? 'None' : value}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-white">Generated CSS</h3>
            <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
              {getCodeSnippet()}
            </pre>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm h-[300px] flex items-center justify-center">
            <div
              className={`w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold ${getAnimationClass()}`}
              style={getAnimationStyle()}
            >
              Animate Me
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Animation Timeline</h3>
              <button 
                onClick={() => setShowTimeline(!showTimeline)}
                className={`px-3 py-1.5 text-sm rounded ${
                  showTimeline 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {showTimeline ? 'Hide Timeline' : 'Show Timeline'}
              </button>
            </div>
            
            {showTimeline && selectedProperties.animation !== 'none' && (
              <div className="space-y-4">
                {/* Animation progress bar */}
                <div className="relative h-8 bg-gray-100 rounded overflow-hidden mb-2">
                  <div 
                    className="absolute h-full bg-blue-500 transition-all duration-200"
                    style={{ width: `${animationProgress * 100}%` }}
                  />
                  
                  {/* Keyframe markers */}
                  {getKeyframePositions().map(keyframe => (
                    <div 
                      key={keyframe}
                      className="absolute h-full w-1 bg-gray-700 z-10 cursor-pointer"
                      style={{ left: `${keyframe}%` }}
                      onClick={() => setAnimationPoint(keyframe / 100)}
                      title={`${keyframe}%`}
                    >
                      <div className="absolute -top-5 -translate-x-1/2 text-xs">
                        {keyframe}%
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Property table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">Property</th>
                        {getKeyframePositions().map(keyframe => (
                          <th key={keyframe} className="text-left py-2 px-4">
                            {keyframe}%
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {getTimelineProperties().map(property => (
                        <tr key={property} className="border-b">
                          <td className="py-2 px-4 font-mono">{property}</td>
                          {getKeyframePositions().map(keyframe => (
                            <td key={keyframe} className="py-2 px-4 font-mono">
                              {getPropertyValueAtKeyframe(property, keyframe)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded text-sm">
                    <strong className="block mb-1">Duration:</strong>
                    {selectedProperties.duration} ({Math.round(duration * 1000)}ms)
                  </div>
                  <div className="bg-blue-50 p-3 rounded text-sm">
                    <strong className="block mb-1">Timing:</strong>
                    {selectedProperties.timing}
                    <div className="h-2 w-full bg-white rounded-full mt-1 relative overflow-hidden">
                      <div 
                        className={`absolute h-full bg-blue-400 transition-all duration-200 ${
                          selectedProperties.timing === 'linear' ? 'linear-progress' :
                          selectedProperties.timing === 'ease-in' ? 'ease-in-progress' :
                          selectedProperties.timing === 'ease-out' ? 'ease-out-progress' :
                          selectedProperties.timing === 'ease-in-out' ? 'ease-in-out-progress' :
                          'ease-progress'
                        }`}
                        style={{ width: `${animationProgress * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes slide-in {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
        
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }
        
        .linear-progress { transition-timing-function: linear; }
        .ease-progress { transition-timing-function: ease; }
        .ease-in-progress { transition-timing-function: ease-in; }
        .ease-out-progress { transition-timing-function: ease-out; }
        .ease-in-out-progress { transition-timing-function: ease-in-out; }
      `}</style>
    </div>
  )
} 
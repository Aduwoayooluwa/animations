'use client'

import { useState, useRef } from 'react'
import { motion, easeIn, easeOut, easeInOut } from 'framer-motion'

type AnimationTechnique = 'css' | 'keyframes' | 'js' | 'spring' | 'orchestrated'

interface AnimationSettings {
  duration: string
  delay: string
  easing: string
}

export default function AnimationComparison() {
  const [activeAnimations, setActiveAnimations] = useState<AnimationTechnique[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [settings, setSettings] = useState<AnimationSettings>({
    duration: '1s',
    delay: '0s',
    easing: 'ease'
  })
  const jsAnimationRef = useRef<HTMLDivElement>(null)
  const [showInfo, setShowInfo] = useState<AnimationTechnique | null>(null)

  const toggleAnimation = (technique: AnimationTechnique) => {
    setActiveAnimations(prev => 
      prev.includes(technique) 
        ? prev.filter(t => t !== technique) 
        : [...prev, technique]
    )
  }

  const playAllAnimations = () => {
    setIsAnimating(true)
    
    // For JavaScript animation
    if (activeAnimations.includes('js') && jsAnimationRef.current) {
      const duration = parseFloat(settings.duration) * 1000 || 1000 // convert to ms
      const delay = parseFloat(settings.delay) * 1000 || 0
      const element = jsAnimationRef.current
      let startTime: number | null = null
      
      // Reset position
      element.style.transform = 'translateX(0px)'
      
      setTimeout(() => {
        requestAnimationFrame(function animate(time) {
          if (startTime === null) startTime = time
          const elapsedTime = time - startTime
          
          if (elapsedTime < duration) {
            // Simple easing function (ease-in-out approximation)
            let progress = elapsedTime / duration
            
            // Apply easing based on settings
            if (settings.easing === 'ease-in') {
              progress = progress * progress
            } else if (settings.easing === 'ease-out') {
              progress = 1 - Math.pow(1 - progress, 2)
            } else if (settings.easing === 'ease-in-out' || settings.easing === 'ease') {
              progress = progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2
            }
            
            // Move 150px to the right
            const translateX = progress * 150
            element.style.transform = `translateX(${translateX}px)`
            
            requestAnimationFrame(animate)
          } else {
            element.style.transform = `translateX(150px)`
          }
        })
      }, delay)
    }
    
    // Reset after animation completes
    const maxDuration = parseFloat(settings.duration) + parseFloat(settings.delay) + 0.5 // add buffer
    setTimeout(() => {
      setIsAnimating(false)
    }, maxDuration * 1000)
  }

  const resetAnimations = () => {
    setIsAnimating(false)
  }

  const updateSetting = (key: keyof AnimationSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  // Map CSS easing values to Framer Motion compatible formats
  const getFramerEasing = (cssEasing: string) => {
    switch (cssEasing) {
      case 'ease-in':
        return easeIn
      case 'ease-out':
        return easeOut
      case 'ease-in-out':
        return easeInOut
      case 'linear':
        return "linear"
      case 'ease':
      default:
        return [0.42, 0, 0.58, 1] // CSS "ease" cubic-bezier
    }
  }

  const getAnimationInfo = (technique: AnimationTechnique) => {
    switch (technique) {
      case 'css':
        return {
          title: 'CSS Transitions',
          description: 'CSS transitions provide a way to control animation speed when changing CSS properties. They are simple to use for basic animations and have good performance.',
          pros: ['Simple syntax', 'Good performance', 'Hardware acceleration'],
          cons: ['Limited to start and end states', 'Cannot control midway through animation', 'Limited animation types'],
          code: `.box {
  transition: transform ${settings.duration} ${settings.easing} ${settings.delay};
}

.box.animate {
  transform: translateX(150px);
}`
        }
      case 'keyframes':
        return {
          title: 'CSS Keyframes',
          description: 'CSS @keyframes provide more control over animations by defining intermediate steps. This allows for more complex animations.',
          pros: ['Control over intermediate steps', 'Can animate multiple properties', 'Declarative approach'],
          cons: ['More verbose syntax', 'Less control than JavaScript', 'Can be harder to debug'],
          code: `@keyframes moveRight {
  0% { transform: translateX(0); }
  100% { transform: translateX(150px); }
}

.box {
  animation: moveRight ${settings.duration} ${settings.easing} ${settings.delay} forwards;
}`
        }
      case 'js':
        return {
          title: 'JavaScript Animation',
          description: 'JavaScript animations use requestAnimationFrame for precise control over each frame. This offers the most flexibility but requires more code.',
          pros: ['Complete control over animation', 'Can respond to events midway', 'Can create complex custom easings'],
          cons: ['More complex to implement', 'Can impact performance if not optimized', 'More code to write and maintain'],
          code: `const element = document.querySelector('.box');
const duration = ${parseFloat(settings.duration) * 1000};
const delay = ${parseFloat(settings.delay) * 1000};
let startTime = null;

setTimeout(() => {
  requestAnimationFrame(function animate(time) {
    if (startTime === null) startTime = time;
    const elapsed = time - startTime;
    
    if (elapsed < duration) {
      let progress = elapsed / duration;
      // Apply easing
      element.style.transform = 
        \`translateX(\${progress * 150}px)\`;
      requestAnimationFrame(animate);
    }
  });
}, delay);`
        }
      case 'spring':
        return {
          title: 'Spring Physics',
          description: 'Spring-based animations create natural motion by simulating physical springs. This creates more realistic movement.',
          pros: ['Natural-feeling motion', 'Based on physics principles', 'Responds to interruptions naturally'],
          cons: ['Less predictable timing', 'More complex to fine-tune', 'May not fit all design needs'],
          code: `// Using Framer Motion
<motion.div
  animate={{ x: 150 }}
  transition={{ 
    type: "spring",
    stiffness: 100,
    damping: 10
  }}
/>

// The 'duration' is determined by physics
// rather than explicitly set`
        }
      case 'orchestrated':
        return {
          title: 'Orchestrated Animations',
          description: 'Orchestrated animations sequence multiple elements with precise timing. This creates coordinated multi-part animations.',
          pros: ['Controls complex sequences', 'Coordinates multiple elements', 'Can create sophisticated interactions'],
          cons: ['Most complex setup', 'Potentially higher performance cost', 'Steeper learning curve'],
          code: `// Using a library like GSAP
const timeline = gsap.timeline({ 
  delay: ${settings.delay} 
});

timeline.to(".box1", { 
  x: 150, 
  duration: ${settings.duration},
  ease: "${settings.easing}"
});

timeline.to(".box2", { 
  x: 150, 
  duration: ${settings.duration},
  ease: "${settings.easing}"
}, "-=0.5"); // Starts 0.5s before previous ends`
        }
      default:
        return {
          title: '',
          description: '',
          pros: [],
          cons: [],
          code: ''
        }
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        {(['css', 'keyframes', 'js', 'spring', 'orchestrated'] as AnimationTechnique[]).map(technique => (
          <div key={technique} className="inline-flex flex-col items-center">
            <button
              onClick={() => toggleAnimation(technique)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeAnimations.includes(technique)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {technique === 'css' && 'CSS Transition'}
              {technique === 'keyframes' && 'CSS Keyframes'}
              {technique === 'js' && 'JavaScript'}
              {technique === 'spring' && 'Spring Physics'}
              {technique === 'orchestrated' && 'Orchestrated'}
            </button>
            <button 
              onClick={() => setShowInfo(showInfo === technique ? null : technique)}
              className="mt-1 text-xs text-blue-500 hover:text-blue-700"
            >
              {showInfo === technique ? 'Hide info' : 'Learn more'}
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        <div className="space-y-4 sm:col-span-1">
          <h3 className="font-medium">Animation Settings</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration
            </label>
            <select
              value={settings.duration}
              onChange={(e) => updateSetting('duration', e.target.value)}
              className="w-full p-2 border rounded"
              disabled={isAnimating}
            >
              <option value="0.5s">0.5s</option>
              <option value="1s">1s</option>
              <option value="2s">2s</option>
              <option value="3s">3s</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delay
            </label>
            <select
              value={settings.delay}
              onChange={(e) => updateSetting('delay', e.target.value)}
              className="w-full p-2 border rounded"
              disabled={isAnimating}
            >
              <option value="0s">0s</option>
              <option value="0.5s">0.5s</option>
              <option value="1s">1s</option>
              <option value="2s">2s</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Easing
            </label>
            <select
              value={settings.easing}
              onChange={(e) => updateSetting('easing', e.target.value)}
              className="w-full p-2 border rounded"
              disabled={isAnimating}
            >
              <option value="linear">Linear</option>
              <option value="ease">Ease</option>
              <option value="ease-in">Ease In</option>
              <option value="ease-out">Ease Out</option>
              <option value="ease-in-out">Ease In Out</option>
            </select>
          </div>
          <div className="pt-4">
            <button
              onClick={playAllAnimations}
              disabled={activeAnimations.length === 0 || isAnimating}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isAnimating ? 'Animating...' : 'Play Animation'}
            </button>
            {isAnimating && (
              <button
                onClick={resetAnimations}
                className="w-full mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg space-y-8 sm:col-span-2">
          {activeAnimations.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Select one or more animation techniques to compare
            </div>
          ) : (
            activeAnimations.map(technique => (
              <div key={technique} className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">
                    {technique === 'css' && 'CSS Transition'}
                    {technique === 'keyframes' && 'CSS Keyframes'}
                    {technique === 'js' && 'JavaScript Animation'}
                    {technique === 'spring' && 'Spring Physics Animation'}
                    {technique === 'orchestrated' && 'Orchestrated Animation'}
                  </h3>
                  <div className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    {technique}
                  </div>
                </div>
                
                <div className="h-20 bg-white rounded-lg flex items-center relative overflow-hidden">
                  {technique === 'css' && (
                    <div 
                      className={`w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold ml-4 transition-transform ${
                        isAnimating ? 'translate-x-[150px]' : ''
                      }`}
                      style={{ 
                        transitionDuration: settings.duration,
                        transitionDelay: settings.delay,
                        transitionTimingFunction: settings.easing
                      }}
                    >
                      CSS
                    </div>
                  )}
                  
                  {technique === 'keyframes' && (
                    <div 
                      className={`w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold ml-4 ${
                        isAnimating ? 'animate-move-right' : ''
                      }`}
                      style={{ 
                        animationDuration: settings.duration,
                        animationDelay: settings.delay,
                        animationTimingFunction: settings.easing,
                        animationFillMode: 'forwards'
                      }}
                    >
                      KF
                    </div>
                  )}
                  
                  {technique === 'js' && (
                    <div 
                      ref={jsAnimationRef}
                      className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold ml-4"
                    >
                      JS
                    </div>
                  )}
                  
                  {technique === 'spring' && (
                    <motion.div
                      className="w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold ml-4"
                      animate={{ x: isAnimating ? 150 : 0 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 100,
                        damping: 10,
                        delay: parseFloat(settings.delay) || 0
                      }}
                    >
                      SP
                    </motion.div>
                  )}
                  
                  {technique === 'orchestrated' && (
                    <div className="flex items-center gap-2 ml-4">
                      <motion.div
                        className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold"
                        animate={{ x: isAnimating ? 150 : 0 }}
                        transition={{ 
                          duration: parseFloat(settings.duration) || 1,
                          ease: getFramerEasing(settings.easing),
                          delay: parseFloat(settings.delay) || 0
                        }}
                      >
                        1
                      </motion.div>
                      <motion.div
                        className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold"
                        animate={{ x: isAnimating ? 150 : 0 }}
                        transition={{ 
                          duration: parseFloat(settings.duration) || 1,
                          ease: getFramerEasing(settings.easing),
                          delay: (parseFloat(settings.delay) || 0) + 0.3 // staggered
                        }}
                      >
                        2
                      </motion.div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showInfo && (
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold">{getAnimationInfo(showInfo).title}</h3>
            <button 
              onClick={() => setShowInfo(null)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
          
          <p className="text-gray-700 mb-4">{getAnimationInfo(showInfo).description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="font-medium mb-2 text-green-700">Advantages</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                {getAnimationInfo(showInfo).pros.map(pro => (
                  <li key={pro}>{pro}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-red-700">Limitations</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                {getAnimationInfo(showInfo).cons.map(con => (
                  <li key={con}>{con}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Code Example</h4>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
              {getAnimationInfo(showInfo).code}
            </pre>
          </div>
        </div>
      )}

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Learning Notes</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          <li>Compare how different animation techniques handle the same movement</li>
          <li>Notice how spring physics creates more natural motion than linear transitions</li>
          <li>Observe how different easing functions affect the feel of the animation</li>
          <li>Consider the appropriate technique based on your specific needs</li>
        </ul>
      </div>

      <style jsx global>{`
        @keyframes move-right {
          0% { transform: translateX(0); }
          100% { transform: translateX(150px); }
        }
        
        .animate-move-right {
          animation-name: move-right;
        }
      `}</style>
    </div>
  )
} 
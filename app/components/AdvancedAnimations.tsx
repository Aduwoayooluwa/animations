'use client'

import { motion, Transition, TargetAndTransition } from 'framer-motion'
import { useState } from 'react'

type AnimationType = 'scale' | 'rotate' | 'fade' | 'bounce' | 'flip'

type AnimationConfig = {
  animate: TargetAndTransition;
  transition: Transition;
}

export default function AdvancedAnimations() {
  const [activeAnimations, setActiveAnimations] = useState<AnimationType[]>([])

  const animations: Record<AnimationType, AnimationConfig> = {
    scale: {
      animate: { scale: [1, 1.5, 0.5, 1] },
      transition: { 
        duration: 2,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    },
    rotate: {
      animate: { rotate: [0, 180, -180, 0] },
      transition: { 
        duration: 2,
        repeat: Infinity,
        repeatType: "loop" as const,
        ease: "linear"
      }
    },
    fade: {
      animate: { opacity: [1, 0.2, 1], scale: [1, 0.9, 1] },
      transition: { 
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut"
      }
    },
    bounce: {
      animate: { y: [0, -50, 0], scale: [1, 0.9, 1] },
      transition: { 
        duration: 0.8,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeOut"
      }
    },
    flip: {
      animate: { rotateY: [0, 360] },
      transition: { 
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop" as const,
        ease: "easeInOut"
      }
    }
  }

  const toggleAnimation = (type: AnimationType) => {
    setActiveAnimations(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const formatName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap gap-4">
        {(Object.keys(animations) as AnimationType[]).map(type => (
          <label
            key={type}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <input
              type="checkbox"
              checked={activeAnimations.includes(type)}
              onChange={() => toggleAnimation(type)}
              className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="capitalize">{formatName(type)}</span>
          </label>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {(Object.keys(animations) as AnimationType[]).map(type => (
          <div key={type} className="bg-gray-100 rounded-lg p-6 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4">{formatName(type)} Animation</h3>
            <div className="h-32 w-32 flex items-center justify-center perspective-500">
              <motion.div
                initial={false}
                animate={activeAnimations.includes(type) ? animations[type].animate : {}}
                transition={animations[type].transition}
                className="w-20 h-20 bg-blue-500 rounded-lg flex items-center justify-center text-white font-semibold"
                style={{ 
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'visible'
                }}
              >
                {formatName(type)}
              </motion.div>
            </div>
            <p className="mt-4 text-sm text-gray-600 text-center">
              {getAnimationDescription(type)}
            </p>
            <button
              onClick={() => toggleAnimation(type)}
              className={`mt-4 px-4 py-2 rounded transition-colors ${
                activeAnimations.includes(type)
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {activeAnimations.includes(type) ? 'Stop' : 'Start'} Animation
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function getAnimationDescription(type: AnimationType): string {
  switch (type) {
    case 'scale':
      return 'Continuously scales up and down in a smooth sequence'
    case 'rotate':
      return 'Performs a continuous rotation animation'
    case 'fade':
      return 'Smoothly fades in and out with a subtle scale effect'
    case 'bounce':
      return 'Creates a continuous bouncing effect'
    case 'flip':
      return 'Performs a continuous 360-degree flip on the Y axis'
  }
} 
'use client'

import { motion } from 'framer-motion'
import * as Checkbox from '@radix-ui/react-checkbox'
import { useState } from 'react'

type TransformProperty = 'translate' | 'scale' | 'rotate' | 'skew'

export default function TransformDemo() {
  const [activeTransforms, setActiveTransforms] = useState<TransformProperty[]>([])

  const getTransformStyle = () => {
    const transforms = {
      translate: { x: 50, y: 20 },
      scale: { scale: 1.2 },
      rotate: { rotate: 45 },
      skew: { skewX: 15, skewY: 10 }
    }

    return Object.entries(transforms)
      .filter(([key]) => activeTransforms.includes(key as TransformProperty))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .reduce((acc, [_, value]) => ({ ...acc, ...value }), {})
  }

  const toggleTransform = (transform: TransformProperty) => {
    setActiveTransforms(prev =>
      prev.includes(transform)
        ? prev.filter(t => t !== transform)
        : [...prev, transform]
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4">
        {(['translate', 'scale', 'rotate', 'skew'] as const).map(transform => (
          <label
            key={transform}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Checkbox.Root
              className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center bg-white"
              checked={activeTransforms.includes(transform)}
              onCheckedChange={() => toggleTransform(transform)}
            >
              <Checkbox.Indicator className="text-blue-500">
                ✓
              </Checkbox.Indicator>
            </Checkbox.Root>
            <span className="capitalize">{transform}</span>
          </label>
        ))}
      </div>

      <div className="h-[300px] bg-gray-100 rounded-lg relative flex items-center justify-center">
        <motion.div
          animate={getTransformStyle()}
          transition={{ duration: 0.5 }}
          className="w-32 h-32 bg-blue-500 rounded-lg flex items-center justify-center text-white font-semibold"
        >
          Transform Me
        </motion.div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Active Transforms:</h4>
        <code className="text-sm">
          transform:{' '}
          {activeTransforms.length > 0
            ? activeTransforms
                .map(t => {
                  switch (t) {
                    case 'translate':
                      return 'translate(50px, 20px)'
                    case 'scale':
                      return 'scale(1.2)'
                    case 'rotate':
                      return 'rotate(45deg)'
                    case 'skew':
                      return 'skew(15deg, 10deg)'
                  }
                })
                .join(' ')
            : 'none'}
        </code>
      </div>
    </div>
  )
} 
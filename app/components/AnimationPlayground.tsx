'use client'

import { motion, Reorder } from 'framer-motion'
import { useState } from 'react'

type KeyframeStep = {
  id: string
  time: number
  properties: {
    x: number
    y: number
    scale: number
    rotate: number
    opacity: number
  }
}

export default function AnimationPlayground() {
  const [keyframes, setKeyframes] = useState<KeyframeStep[]>([
    {
      id: '1',
      time: 0,
      properties: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 }
    }
  ])
  const [selectedStep, setSelectedStep] = useState<string>(keyframes[0].id)
  const [isPlaying, setIsPlaying] = useState(false)

  const addKeyframe = () => {
    const lastKeyframe = keyframes[keyframes.length - 1]
    const newKeyframe: KeyframeStep = {
      id: Date.now().toString(),
      time: lastKeyframe.time + 1,
      properties: { ...lastKeyframe.properties }
    }
    setKeyframes([...keyframes, newKeyframe])
  }

  const updateKeyframe = (id: string, property: keyof KeyframeStep['properties'], value: number) => {
    setKeyframes(frames =>
      frames.map(frame =>
        frame.id === id
          ? {
              ...frame,
              properties: { ...frame.properties, [property]: value }
            }
          : frame
      )
    )
  }

  const getAnimationValues = (property: keyof KeyframeStep['properties']) => {
    return keyframes.map(frame => frame.properties[property])
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Timeline Editor</h3>
          <div className="space-x-2">
            <button
              onClick={addKeyframe}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Add Keyframe
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2 rounded transition-colors ${
                isPlaying
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isPlaying ? 'Stop' : 'Play'}
            </button>
          </div>
        </div>

        <div className="relative h-[200px] bg-gray-100 rounded-lg mb-6">
          <motion.div
            animate={isPlaying ? {
              x: getAnimationValues('x'),
              y: getAnimationValues('y'),
              scale: getAnimationValues('scale'),
              rotate: getAnimationValues('rotate'),
              opacity: getAnimationValues('opacity')
            } : keyframes.find(k => k.id === selectedStep)?.properties}
            transition={isPlaying ? {
              duration: keyframes.length,
              times: keyframes.map(k => k.time / keyframes.length),
              repeat: Infinity
            } : { duration: 0.3 }}
            className="absolute w-20 h-20 bg-blue-500 rounded-lg"
            style={{ originX: 0.5, originY: 0.5 }}
          />
        </div>

        <div className="space-y-4">
          <Reorder.Group axis="y" values={keyframes} onReorder={setKeyframes} className="space-y-2">
            {keyframes.map((frame) => (
              <Reorder.Item
                key={frame.id}
                value={frame}
                className={`p-4 rounded-lg cursor-move ${
                  selectedStep === frame.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                }`}
                onClick={() => setSelectedStep(frame.id)}
              >
                <div className="flex flex-wrap gap-4">
                  {(Object.keys(frame.properties) as Array<keyof KeyframeStep['properties']>).map(
                    (property) => (
                      <div key={property} className="flex-1 min-w-[120px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                          {property}
                        </label>
                        <input
                          type="range"
                          min={property === 'opacity' ? 0 : property === 'scale' ? 0.5 : -200}
                          max={property === 'opacity' ? 1 : property === 'scale' ? 3 : 200}
                          step={property === 'opacity' ? 0.1 : property === 'scale' ? 0.1 : 1}
                          value={frame.properties[property]}
                          onChange={(e) =>
                            updateKeyframe(frame.id, property, parseFloat(e.target.value))
                          }
                          className="w-full"
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          {frame.properties[property]}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">How to Use</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Add keyframes to create animation steps</li>
          <li>Drag keyframes to reorder them</li>
          <li>Adjust properties using the sliders</li>
          <li>Click Play to preview the animation</li>
          <li>Click on a keyframe to preview that specific state</li>
        </ul>
      </div>
    </div>
  )
} 
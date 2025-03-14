'use client'

import { motion } from 'framer-motion'
import * as Checkbox from '@radix-ui/react-checkbox'
import { useState } from 'react'

type TransformProperty = 'translate' | 'scale' | 'rotate' | 'skew'

export default function TransformDemo() {
  const [activeTransforms, setActiveTransforms] = useState<TransformProperty[]>([])
  const [tutorialMode, setTutorialMode] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const tutorialSteps = [
    {
      title: "Translation",
      property: "translate" as TransformProperty,
      description: "Translation moves elements horizontally (X-axis) and vertically (Y-axis). This is like sliding an object across a surface without changing its appearance.",
      hint: "Notice how the element shifts 50px to the right and 20px down from its original position."
    },
    {
      title: "Scaling",
      property: "scale" as TransformProperty,
      description: "Scaling changes the size of an element. A value greater than 1 makes it larger, while a value less than 1 makes it smaller.",
      hint: "The element is now 1.2 times its original size. Scaling is uniform in both width and height."
    },
    {
      title: "Rotation",
      property: "rotate" as TransformProperty,
      description: "Rotation turns an element around its center point by a specified angle in degrees.",
      hint: "The element rotates 45 degrees clockwise. Negative values would rotate it counter-clockwise."
    },
    {
      title: "Skew",
      property: "skew" as TransformProperty,
      description: "Skew tilts an element, creating a parallelogram shape. It can be applied to X-axis, Y-axis, or both.",
      hint: "The element is now skewed 15 degrees horizontally and 10 degrees vertically."
    },
    {
      title: "Combining Transforms",
      property: null,
      description: "Multiple transforms can be combined to create complex effects. The order of application matters when transforms are combined.",
      hint: "Try selecting multiple transforms to see how they interact. Note that the order is: translate → rotate → scale → skew."
    }
  ]

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

  const startTutorial = () => {
    setTutorialMode(true)
    setCurrentStep(0)
    setActiveTransforms([tutorialSteps[0].property!])
  }

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      const nextStepIndex = currentStep + 1
      setCurrentStep(nextStepIndex)
      
      // If not the final "combination" step, set only the current property
      if (tutorialSteps[nextStepIndex].property) {
        setActiveTransforms([tutorialSteps[nextStepIndex].property!])
      } else {
        // Final step - show all transforms
        setActiveTransforms(['translate', 'scale', 'rotate', 'skew'])
      }
    } else {
      // End of tutorial
      setTutorialMode(false)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      const prevStepIndex = currentStep - 1
      setCurrentStep(prevStepIndex)
      setActiveTransforms([tutorialSteps[prevStepIndex].property!])
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-4">
          {(['translate', 'scale', 'rotate', 'skew'] as const).map(transform => (
            <label
              key={transform}
              className={`flex items-center gap-2 cursor-pointer ${
                tutorialMode && tutorialSteps[currentStep].property === transform
                  ? 'ring-2 ring-blue-400 bg-blue-50 px-2 py-1 rounded'
                  : ''
              }`}
            >
              <Checkbox.Root
                className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center bg-white"
                checked={activeTransforms.includes(transform)}
                onCheckedChange={() => toggleTransform(transform)}
                disabled={tutorialMode && currentStep < tutorialSteps.length - 1}
              >
                <Checkbox.Indicator className="text-blue-500">
                  ✓
                </Checkbox.Indicator>
              </Checkbox.Root>
              <span className="capitalize">{transform}</span>
            </label>
          ))}
        </div>
        
        <button
          onClick={tutorialMode ? () => setTutorialMode(false) : startTutorial}
          className={`px-3 py-1.5 text-sm rounded ${
            tutorialMode 
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {tutorialMode ? 'Exit Tutorial' : 'Start Tutorial'}
        </button>
      </div>

      {tutorialMode && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">
              {currentStep + 1}. {tutorialSteps[currentStep].title}
            </h3>
            <div className="text-sm text-gray-500">
              Step {currentStep + 1} of {tutorialSteps.length}
            </div>
          </div>
          <p className="text-gray-700 mb-3">{tutorialSteps[currentStep].description}</p>
          <p className="text-blue-600 italic text-sm">{tutorialSteps[currentStep].hint}</p>
          
          <div className="flex justify-between mt-4">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={nextStep}
              className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {currentStep < tutorialSteps.length - 1 ? 'Next' : 'Finish Tutorial'}
            </button>
          </div>
        </div>
      )}

      <div className="h-[300px] bg-gray-100 rounded-lg relative flex items-center justify-center">
        <motion.div
          animate={getTransformStyle()}
          transition={{ duration: 0.5 }}
          className={`w-32 h-32 bg-blue-500 rounded-lg flex items-center justify-center text-white font-semibold
            ${tutorialMode ? 'ring-4 ring-yellow-400' : ''}`}
        >
          Transform Me
        </motion.div>
        {tutorialMode && currentStep === tutorialSteps.length - 1 && (
          <div className="absolute bottom-4 right-4 bg-yellow-100 p-2 rounded text-sm text-yellow-800">
            Try selecting different combinations!
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Active Transforms:</h4>
        <code className="text-sm block mb-2">
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
        
        {tutorialMode && (
          <div className="mt-3 text-sm text-gray-600 border-t border-gray-200 pt-3">
            <strong>Pro tip:</strong> In CSS, multiple transforms are combined in a single transform property.
            The order matters because each transform is applied to the result of the previous one.
          </div>
        )}
      </div>
    </div>
  )
} 
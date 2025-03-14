'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

type CSSProperty = {
  name: string
  values: string[]
  description: string
  defaultValue: string
}

export default function CSSAnimations() {
  const [selectedProperties, setSelectedProperties] = useState<Record<string, string>>({
    backgroundColor: '#3B82F6',
    borderRadius: '0.5rem',
    transform: 'none',
    boxShadow: 'none'
  })

  const properties: Record<string, CSSProperty> = {
    backgroundColor: {
      name: 'Background Color',
      values: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B'],
      description: 'Change the background color of the element',
      defaultValue: '#3B82F6'
    },
    borderRadius: {
      name: 'Border Radius',
      values: ['0.5rem', '50%', '0', '2rem'],
      description: 'Modify the corner roundness',
      defaultValue: '0.5rem'
    },
    transform: {
      name: 'Transform',
      values: ['none', 'rotate(45deg)', 'scale(1.5)', 'skew(10deg, 10deg)'],
      description: 'Apply geometric transformations',
      defaultValue: 'none'
    },
    boxShadow: {
      name: 'Box Shadow',
      values: ['none', '0 4px 6px rgba(0,0,0,0.1)', '0 8px 16px rgba(0,0,0,0.2)', 'inset 0 2px 4px rgba(0,0,0,0.1)'],
      description: 'Add shadow effects',
      defaultValue: 'none'
    }
  }

  const handlePropertyChange = (property: string, value: string) => {
    setSelectedProperties(prev => ({
      ...prev,
      [property]: value
    }))
  }

  const getCodeSnippet = () => {
    const styles = Object.entries(selectedProperties)
      .filter(([_, value]) => value !== 'none')
      .map(([key, value]) => `  ${key}: ${value};`)
      .join('\n')

    return `.animated-element {
${styles}
  transition: all 0.3s ease-in-out;
}`
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

        <div className="bg-gray-50 p-8 rounded-lg flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-8">Live Preview</h3>
          <div className="relative w-full h-64 flex items-center justify-center bg-white rounded-lg shadow-sm">
            <motion.div
              animate={selectedProperties}
              transition={{ duration: 0.3 }}
              className="w-32 h-32 flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: '#3B82F6' }}
            >
              Hover me!
            </motion.div>
          </div>
          <p className="mt-4 text-sm text-gray-600 text-center">
            Try different combinations of properties to see how they work together!
          </p>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Learning Tips</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Start with simple transitions on a single property</li>
          <li>Combine multiple properties to create more complex animations</li>
          <li>Use the generated CSS code in your own projects</li>
          <li>Experiment with different timing functions and durations</li>
          <li>Remember that subtle animations often work best for user interfaces</li>
        </ul>
      </div>
    </div>
  )
} 
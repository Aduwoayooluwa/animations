'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

type Challenge = {
  id: string
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  task: string
  hints: string[]
  solution: string
  completed: boolean
}

const challenges: Challenge[] = [
  {
    id: '1',
    title: 'Smooth Button Hover',
    description: 'Create a button that smoothly scales up on hover',
    difficulty: 'Beginner',
    task: 'Add hover animation to make the button scale to 1.1x its size smoothly',
    hints: [
      'Use the scale transform property',
      'Consider using transition duration for smoothness',
      'Think about the ease timing function'
    ],
    solution: `hover={{ scale: 1.1 }}
transition={{ duration: 0.2, ease: "easeInOut" }}`,
    completed: false
  },
  {
    id: '2',
    title: 'Loading Spinner',
    description: 'Create an infinite rotating loading spinner',
    difficulty: 'Beginner',
    task: 'Make the circle rotate 360 degrees continuously',
    hints: [
      'Use the rotate transform property',
      'Consider using repeat: Infinity',
      'Think about the animation duration'
    ],
    solution: `animate={{ rotate: 360 }}
transition={{ duration: 2, repeat: Infinity, ease: "linear" }}`,
    completed: false
  },
  {
    id: '3',
    title: 'Staggered List Items',
    description: 'Create a list where items appear one after another',
    difficulty: 'Intermediate',
    task: 'Animate list items to fade in with a stagger effect',
    hints: [
      'Use opacity and y properties',
      'Consider using staggerChildren',
      'Think about the delay between items'
    ],
    solution: `variants={{
  container: { transition: { staggerChildren: 0.1 } },
  item: { opacity: 1, y: 0 }
}}`,
    completed: false
  }
]

export default function AnimationChallenges() {
  const [activeChallengeId, setActiveChallengeId] = useState<string>(challenges[0].id)
  const [showSolution, setShowSolution] = useState(false)
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([])

  const activeChallenge = challenges.find(c => c.id === activeChallengeId)!

  const markCompleted = (id: string) => {
    if (!completedChallenges.includes(id)) {
      setCompletedChallenges([...completedChallenges, id])
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1 space-y-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Challenges</h3>
          <div className="space-y-2">
            {challenges.map((challenge) => (
              <button
                key={challenge.id}
                onClick={() => {
                  setActiveChallengeId(challenge.id)
                  setShowSolution(false)
                }}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  activeChallengeId === challenge.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{challenge.title}</span>
                  {completedChallenges.includes(challenge.id) && (
                    <span className="text-green-500">✓</span>
                  )}
                </div>
                <span className="text-sm text-gray-500">{challenge.difficulty}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Progress</h3>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{
                  width: `${(completedChallenges.length / challenges.length) * 100}%`
                }}
              />
            </div>
            <span className="text-sm text-gray-600">
              {completedChallenges.length}/{challenges.length}
            </span>
          </div>
        </div>
      </div>

      <div className="md:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold">{activeChallenge.title}</h2>
              <p className="text-gray-600">{activeChallenge.description}</p>
            </div>
            <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
              {activeChallenge.difficulty}
            </span>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Your Task</h3>
            <p className="text-gray-700">{activeChallenge.task}</p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Hints</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {activeChallenge.hints.map((hint, index) => (
                  <li key={index}>{hint}</li>
                ))}
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
              >
                {showSolution ? 'Hide Solution' : 'Show Solution'}
              </button>
              <button
                onClick={() => markCompleted(activeChallenge.id)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Mark as Completed
              </button>
            </div>

            {showSolution && (
              <div className="bg-gray-900 p-4 rounded-lg">
                <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                  {activeChallenge.solution}
                </pre>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-4">Preview Area</h3>
          <div className="h-[200px] bg-gray-50 rounded-lg flex items-center justify-center">
            {activeChallengeId === '1' && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg"
              >
                Hover Me
              </motion.button>
            )}
            {activeChallengeId === '2' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
              />
            )}
            {activeChallengeId === '3' && (
              <motion.div
                variants={{
                  container: { transition: { staggerChildren: 0.1 } },
                  item: { opacity: 1, y: 0 }
                }}
                initial="hidden"
                animate="visible"
                className="space-y-2"
              >
                {[1, 2, 3].map((item) => (
                  <motion.div
                    key={item}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    className="w-32 h-8 bg-blue-500 rounded"
                  />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 
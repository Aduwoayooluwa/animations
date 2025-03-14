'use client'

import * as Tabs from '@radix-ui/react-tabs'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import TransformDemo from './components/TransformDemo'
import TimingDemo from './components/TimingDemo'
import AdvancedAnimations from './components/AdvancedAnimations'
import CSSAnimations from './components/CSSAnimations'
import AnimationPlayground from './components/AnimationPlayground'
import AnimationChallenges from './components/AnimationChallenges'
import JavaScriptAnimations from './components/JavaScriptAnimations'
import ReactAnimations from './components/ReactAnimations'
import PerformanceMetrics from './components/PerformanceMetrics'
import AnimationComparison from './components/AnimationComparison'

function ContactSupportButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Contact Support"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 50, x: -50 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 50, x: -50 }}
              transition={{ type: "spring", damping: 25 }}
              className="absolute bottom-16 left-0 bg-white rounded-lg shadow-xl p-6 w-80 z-10"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Contact Support</h3>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <p className="text-gray-600 mb-4">
                Found a bug or have a suggestion? Reach out on social media:
              </p>
              
              <a 
                href="https://x.com/codingpastor" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors mb-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="black">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="font-medium">@codingpastor</span>
                <span className="ml-auto text-blue-600">Follow</span>
              </a>
              
              <div className="text-xs text-gray-500 mt-6">
                <p>Thank you for using the Animation Playground!</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-8 text-center">
          Animation Playground
        </h1>

        <div className="mb-6 sm:mb-8 text-center max-w-2xl mx-auto px-4 sm:px-0">
          <p className="text-sm sm:text-base text-gray-600">
            Welcome to the Animation Playground! This interactive learning platform helps you understand
            web animations through hands-on examples. Start with the basics and progress to more advanced concepts.
          </p>
        </div>
        
        <Tabs.Root defaultValue="basics" className="flex flex-col gap-4 sm:gap-8">
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="overflow-x-auto pb-2 sm:pb-0">
              <Tabs.List className="flex gap-2 sm:gap-4 justify-start sm:justify-center border-b border-gray-200 min-w-max">
                {[
                  'Basics',
                  'Advanced',
                  'CSS',
                  'JavaScript',
                  'React',
                  'Compare',
                  'Performance',
                  'Playground',
                  'Challenges'
                ].map((tab) => (
                  <Tabs.Trigger
                    key={tab.toLowerCase()}
                    value={tab.toLowerCase()}
                    className="px-3 py-2 sm:px-4 text-sm sm:text-base text-gray-600 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 transition-colors whitespace-nowrap"
                  >
                    {tab}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
            </div>
          </div>

          <Tabs.Content value="basics" className="space-y-8 sm:space-y-12">
            <div className="bg-blue-50 p-4 sm:p-6 rounded-lg mb-6 sm:mb-8">
              <h3 className="text-lg font-semibold mb-3 sm:mb-4">Getting Started with Animations</h3>
              <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
                Animations can make your web applications more engaging and intuitive. They help guide users
                through state changes and provide visual feedback. Start by exploring these basic concepts:
              </p>
              <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-700">
                <li>Transform properties let you modify elements geometrically</li>
                <li>Timing functions control how animations progress over time</li>
                <li>Combine different properties to create unique effects</li>
              </ul>
            </div>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Transform Properties</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Experiment with different transform properties to see how they affect elements.
                Toggle the checkboxes to combine multiple transforms.
              </p>
              <TransformDemo />
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Timing Functions</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Explore how different timing functions affect the feel of animations.
                Click the button to start the animation and observe the differences.
              </p>
              <TimingDemo />
            </section>
          </Tabs.Content>

          <Tabs.Content value="advanced" className="space-y-8 sm:space-y-12">
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Advanced Animations</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Explore more complex animations combining multiple properties.
                Toggle the checkboxes to see different animation effects in action.
              </p>
              <AdvancedAnimations />
            </section>
          </Tabs.Content>

          <Tabs.Content value="css" className="space-y-8 sm:space-y-12">
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">CSS Animations</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Learn how to create animations using pure CSS. Experiment with different properties
                and see the generated code that you can use in your projects.
              </p>
              <CSSAnimations />
            </section>
          </Tabs.Content>

          <Tabs.Content value="javascript" className="space-y-8 sm:space-y-12">
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">JavaScript Animations</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Learn how to create animations using pure JavaScript, from requestAnimationFrame
                to professional animation libraries like GSAP.
              </p>
              <JavaScriptAnimations />
            </section>
          </Tabs.Content>

          <Tabs.Content value="react" className="space-y-8 sm:space-y-12">
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">React Animation Libraries</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Explore different approaches to animations in React applications using
                popular libraries like Framer Motion, React Spring, and React Transition Group.
              </p>
              <ReactAnimations />
            </section>
          </Tabs.Content>

          <Tabs.Content value="compare" className="space-y-8 sm:space-y-12">
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Animation Comparison</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Compare different animation techniques side-by-side to understand their differences, advantages, and use cases.
                This interactive tool helps you see how the same animation can be implemented using various approaches.
              </p>
              <AnimationComparison />
            </section>
          </Tabs.Content>

          <Tabs.Content value="performance" className="space-y-8 sm:space-y-12">
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Performance Metrics</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Monitor animation performance and learn best practices for creating
                smooth, efficient animations that run at 60 frames per second.
              </p>
              <PerformanceMetrics />
            </section>
          </Tabs.Content>

          <Tabs.Content value="playground" className="space-y-8 sm:space-y-12">
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Animation Playground</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Experiment with animations by creating keyframes and adjusting properties in real-time.
                Use this interactive playground to visualize and understand how different animation properties work together.
              </p>
              <AnimationPlayground />
            </section>
          </Tabs.Content>

          <Tabs.Content value="challenges" className="space-y-8 sm:space-y-12">
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Animation Challenges</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Test your animation skills with these interactive challenges.
                Each challenge focuses on different animation concepts and provides hints and solutions to help you learn.
              </p>
              <AnimationChallenges />
            </section>
          </Tabs.Content>
        </Tabs.Root>

        <footer className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200">
          <div className="text-center text-gray-600">
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Pro Tips for Animation Development</h3>
            <ul className="space-y-2 text-sm sm:text-base">
              <li>🎯 Start with a clear purpose for each animation</li>
              <li>⚡️ Keep animations subtle and performant</li>
              <li>🌈 Consider accessibility - some users prefer reduced motion</li>
              <li>📱 Test animations across different devices and browsers</li>
            </ul>
          </div>
        </footer>
      </motion.div>
      
      <ContactSupportButton />
    </main>
  )
}

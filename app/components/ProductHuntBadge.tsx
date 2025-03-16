'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function ProductHuntBadge() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  // Show badge after a short delay when page loads
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed bottom-4 right-4 z-50 flex flex-col items-end"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20 
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg p-2 mb-2 text-xs text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              scale: isHovered ? 1 : 0.8,
              y: isHovered ? -10 : 0
            }}
            transition={{ duration: 0.2 }}
          >
            We&apos;re on Product Hunt today! 🚀
          </motion.div>
          
          <motion.a 
            href="https://www.producthunt.com/posts/animation-playground?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-animation&#0045;playground" 
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <motion.div 
              className="absolute -inset-1 rounded-lg bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 opacity-75 blur-sm"
              animate={{ 
                opacity: [0.5, 0.8, 0.5],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            />
            <div className="relative bg-white rounded-lg p-1">
              <Image 
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=942466&theme=light&t=1742079715663" 
                alt="Animation Playground on Product Hunt" 
                width={250}
                height={54}
                unoptimized
              />
            </div>
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 
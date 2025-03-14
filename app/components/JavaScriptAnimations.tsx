'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function JavaScriptAnimations() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const [isRAFRunning, setIsRAFRunning] = useState(false)
  const [isGSAPRunning, setIsGSAPRunning] = useState(false)
  const rafIdRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  // requestAnimationFrame example
  useEffect(() => {
    if (!boxRef.current) return

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const progress = (timestamp - startTimeRef.current) / 2000 
      
      if (boxRef.current) {
        boxRef.current.style.transform = `translateX(${Math.sin(progress * Math.PI * 2) * 100}px)`
      }

      if (progress < 1 && isRAFRunning) {
        rafIdRef.current = requestAnimationFrame(animate)
      } else {
        setIsRAFRunning(false)
        startTimeRef.current = null
      }
    }

    if (isRAFRunning) {
      rafIdRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [isRAFRunning])

  // GSAP example
  const startGSAPAnimation = () => {
    if (!boxRef.current) return
    setIsGSAPRunning(true)
    
    gsap.to(boxRef.current, {
      rotation: 360,
      scale: 1.5,
      duration: 1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
      onComplete: () => setIsGSAPRunning(false)
    })
  }

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let particles: Array<{
      x: number
      y: number
      radius: number
      color: string
      vx: number
      vy: number
    }> = []

    const createParticles = () => {
      particles = []
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 4 + 2,
          color: `hsl(${Math.random() * 360}, 50%, 50%)`,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2
        })
      }
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    createParticles()
    animate()
  }, [])

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">requestAnimationFrame</h3>
          <p className="text-gray-600 mb-4">
            The requestAnimationFrame API is the foundation of smooth JavaScript animations.
            It synchronizes with the browser&apos;s refresh rate for optimal performance.
          </p>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="h-32 relative flex items-center">
              <div
                ref={boxRef}
                className="w-16 h-16 bg-blue-500 rounded-lg"
              />
            </div>
            <button
              onClick={() => setIsRAFRunning(true)}
              disabled={isRAFRunning}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Start Animation
            </button>
          </div>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg mt-4 text-sm">
{`const animate = (timestamp) => {
  const progress = (timestamp - startTime) / duration
  element.style.transform = \`translateX(\${Math.sin(progress * Math.PI * 2) * 100}px)\`
  if (progress < 1) requestAnimationFrame(animate)
}
requestAnimationFrame(animate)`}
          </pre>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">GSAP Animation</h3>
          <p className="text-gray-600 mb-4">
            GSAP (GreenSock Animation Platform) is a professional-grade animation library
            that makes complex animations simple and performant.
          </p>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="h-32 relative flex items-center justify-center">
              <div
                ref={boxRef}
                className="w-16 h-16 bg-green-500 rounded-lg"
              />
            </div>
            <button
              onClick={startGSAPAnimation}
              disabled={isGSAPRunning}
              className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300"
            >
              Start GSAP Animation
            </button>
          </div>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg mt-4 text-sm">
{`gsap.to(element, {
  rotation: 360,
  scale: 1.5,
  duration: 1,
  yoyo: true,
  repeat: 1,
  ease: "power2.inOut"
})`}
          </pre>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Canvas Animation</h3>
          <p className="text-gray-600 mb-4">
            Canvas provides a low-level API for drawing graphics and creating complex animations.
            Perfect for particle effects, games, and data visualizations.
          </p>
          <canvas
            ref={canvasRef}
            width={600}
            height={300}
            className="w-full h-[300px] bg-white rounded-lg shadow-sm"
          />
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg mt-4 text-sm">
{`const animate = () => {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.fillRect(0, 0, width, height)
  
  particles.forEach(particle => {
    particle.x += particle.vx
    particle.y += particle.vy
    
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
    ctx.fill()
  })
  
  requestAnimationFrame(animate)
}`}
          </pre>
        </div>
      </section>
    </div>
  )
} 
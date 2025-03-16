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
  const containerRef = useRef<HTMLDivElement>(null)

  // Responsive animation calculation
  const getAnimationDistance = () => {
    if (!containerRef.current) return 50;
    // Use a percentage of the container width, with a max value
    const containerWidth = containerRef.current.clientWidth;
    return Math.min(containerWidth * 0.25, 100);
  }

  // requestAnimationFrame example
  useEffect(() => {
    if (!boxRef.current) return

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const progress = (timestamp - startTimeRef.current) / 2000 
      
      if (boxRef.current) {
        const distance = getAnimationDistance();
        boxRef.current.style.transform = `translateX(${Math.sin(progress * Math.PI * 2) * distance}px)`
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

  // Canvas animation with resize handling
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

    // Handle canvas resize
    const resizeCanvas = () => {
      if (!canvas || !canvas.parentElement) return;
      
      const parentWidth = canvas.parentElement.clientWidth;
      canvas.width = parentWidth;
      canvas.height = 300;
      
      // Recreate particles when canvas is resized
      createParticles();
    }

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

    // Initial setup
    resizeCanvas();
    createParticles();
    animate();

    // Add resize listener
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    }
  }, [])

  return (
    <div className="space-y-8 md:space-y-12 px-4 md:px-6">
      <section className="space-y-4 md:space-y-6">
        <div>
          <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">requestAnimationFrame</h3>
          <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">
            The requestAnimationFrame API is the foundation of smooth JavaScript animations.
            It synchronizes with the browser&apos;s refresh rate for optimal performance.
          </p>
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
            <div 
              ref={containerRef}
              className="h-24 md:h-32 relative flex items-center overflow-hidden"
            >
              <div
                ref={boxRef}
                className="w-12 h-12 md:w-16 md:h-16 bg-blue-500 rounded-lg"
              />
            </div>
            <button
              onClick={() => setIsRAFRunning(true)}
              disabled={isRAFRunning}
              className="px-3 py-1 md:px-4 md:py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 text-sm md:text-base mt-2"
            >
              Start Animation
            </button>
          </div>
          <pre className="bg-gray-900 text-green-400 p-3 md:p-4 rounded-lg mt-3 md:mt-4 text-xs md:text-sm overflow-x-auto">
{`const animate = (timestamp) => {
  const progress = (timestamp - startTime) / duration
  element.style.transform = \`translateX(\${Math.sin(progress * Math.PI * 2) * distance}px)\`
  if (progress < 1) requestAnimationFrame(animate)
}
requestAnimationFrame(animate)`}
          </pre>
        </div>
      </section>

      <section className="space-y-4 md:space-y-6">
        <div>
          <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">GSAP Animation</h3>
          <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">
            GSAP (GreenSock Animation Platform) is a professional-grade animation library
            that makes complex animations simple and performant.
          </p>
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
            <div className="h-24 md:h-32 relative flex items-center justify-center">
              <div
                ref={boxRef}
                className="w-12 h-12 md:w-16 md:h-16 bg-green-500 rounded-lg"
              />
            </div>
            <button
              onClick={startGSAPAnimation}
              disabled={isGSAPRunning}
              className="px-3 py-1 md:px-4 md:py-2 bg-green-500 text-white rounded disabled:bg-gray-300 text-sm md:text-base mt-2"
            >
              Start GSAP Animation
            </button>
          </div>
          <pre className="bg-gray-900 text-green-400 p-3 md:p-4 rounded-lg mt-3 md:mt-4 text-xs md:text-sm overflow-x-auto">
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

      <section className="space-y-4 md:space-y-6">
        <div>
          <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">Canvas Animation</h3>
          <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">
            Canvas provides a low-level API for drawing graphics and creating complex animations.
            Perfect for particle effects, games, and data visualizations.
          </p>
          <div className="w-full">
            <canvas
              ref={canvasRef}
              className="w-full h-[200px] md:h-[300px] bg-white rounded-lg shadow-sm"
            />
          </div>
          <pre className="bg-gray-900 text-green-400 p-3 md:p-4 rounded-lg mt-3 md:mt-4 text-xs md:text-sm overflow-x-auto">
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
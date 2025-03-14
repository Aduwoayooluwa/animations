"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  Reorder,
  useScroll,
  useSpring as useFramerSpring,
} from "framer-motion";
import { useSpring, animated } from "@react-spring/web";

interface InfoTooltipProps {
  title: string;
  content: string;
}

// Info tooltip component for contextual learning
function InfoTooltip({ title, content }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="text-blue-500 hover:text-blue-600 ml-2"
      >
        ℹ️
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-10 w-64 p-4 mt-2 bg-white rounded-lg shadow-lg border border-gray-200"
          >
            <h4 className="font-semibold mb-2">{title}</h4>
            <p className="text-sm text-gray-600">{content}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Slow motion controller
function SlowMotionControl({
  onChange,
}: {
  onChange: (speed: number) => void;
}) {
  const [timeScale, setTimeScale] = useState(1);

  useEffect(() => {
    onChange(timeScale);
  }, [timeScale, onChange]);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
      <span className="text-xs sm:text-sm font-medium whitespace-nowrap">Speed:</span>
      <input
        type="range"
        min="0.1"
        max="1"
        step="0.1"
        value={timeScale}
        onChange={(e) => setTimeScale(parseFloat(e.target.value))}
        className="w-full sm:w-32"
      />
      <span className="text-xs sm:text-sm whitespace-nowrap">{timeScale}x</span>
    </div>
  );
}

// Animation comparison component
function ComparisonView() {
  const [isVisible, setIsVisible] = useState(true);

  const springStyle = useSpring({
    scale: isVisible ? 1 : 0,
    config: { tension: 300, friction: 20 },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h4 className="font-medium">Framer Motion</h4>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: isVisible ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-32 h-32 bg-blue-500 rounded-lg mx-auto"
        />
        <pre className="text-sm bg-gray-900 text-green-400 p-4 rounded overflow-x-auto">
          {`<motion.div
  animate={{ scale: isVisible ? 1 : 0 }}
  transition={{
    type: "spring",
    stiffness: 300,
    damping: 20
  }}
/>`}
        </pre>
      </div>
      <div className="space-y-4">
        <h4 className="font-medium">React Spring</h4>
        <animated.div
          style={{
            ...springStyle,
            width: "8rem",
            height: "8rem",
            backgroundColor: "#10B981",
            borderRadius: "0.5rem",
            margin: "0 auto",
          }}
        />
        <pre className="text-sm bg-gray-900 text-green-400 p-4 rounded overflow-x-auto">
          {`useSpring({
  scale: isVisible ? 1 : 0,
  config: {
    tension: 300,
    friction: 20
  }
})`}
        </pre>
      </div>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="col-span-1 lg:col-span-2 px-4 py-2 bg-gray-900 text-white rounded"
      >
        Toggle Animation
      </button>
    </div>
  );
}

// Scroll-based animation component
function ScrollAnimation() {
  const { scrollYProgress } = useScroll();
  const scaleX = useFramerSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-1 bg-blue-500 origin-left"
    />
  );
}

// Accessibility controls
function AccessibilityControls() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  return (
    <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={prefersReducedMotion}
          onChange={(e) => setPrefersReducedMotion(e.target.checked)}
        />
        <span className="text-sm">Simulate prefers-reduced-motion</span>
      </label>
      <InfoTooltip
        title="Accessibility"
        content="Users can enable reduced motion in their OS settings. Your animations should respect this preference."
      />
    </div>
  );
}

function FPSStats() {
  const [fps, setFps] = useState(0);
  const [avgFps, setAvgFps] = useState(0);
  const [minFps, setMinFps] = useState(Infinity);
  const [maxFps, setMaxFps] = useState(0);
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const fpsHistoryRef = useRef<number[]>([]);

  useEffect(() => {
    let animationFrameId: number;

    const measureFPS = (timestamp: number) => {
      frameRef.current++;
      const elapsed = timestamp - lastTimeRef.current;

      if (elapsed >= 1000) {
        const currentFps = Math.round((frameRef.current * 1000) / elapsed);
        setFps(currentFps);

        fpsHistoryRef.current.push(currentFps);
        if (fpsHistoryRef.current.length > 60) {
          fpsHistoryRef.current.shift();
        }

        const avg = Math.round(
          fpsHistoryRef.current.reduce((a, b) => a + b, 0) /
            fpsHistoryRef.current.length
        );
        setAvgFps(avg);

        setMinFps(Math.min(currentFps, minFps));
        setMaxFps(Math.max(currentFps, maxFps));

        frameRef.current = 0;
        lastTimeRef.current = timestamp;
      }

      animationFrameId = requestAnimationFrame(measureFPS);
    };

    animationFrameId = requestAnimationFrame(measureFPS);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [minFps, maxFps]);

  return (
    <div className="space-y-2 font-mono text-xs sm:text-sm">
      <div className="flex flex-wrap gap-2 sm:gap-4">
        <div>
          Current:{" "}
          <span
            className={
              fps < 50
                ? "text-red-500"
                : fps < 55
                ? "text-yellow-500"
                : "text-green-500"
            }
          >
            {fps} FPS
          </span>
        </div>
        <div>
          Average:{" "}
          <span
            className={
              avgFps < 50
                ? "text-red-500"
                : avgFps < 55
                ? "text-yellow-500"
                : "text-green-500"
            }
          >
            {avgFps} FPS
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-4">
        <div>
          Min:{" "}
          <span className="text-red-500">
            {minFps === Infinity ? "--" : minFps} FPS
          </span>
        </div>
        <div>
          Max: <span className="text-green-500">{maxFps} FPS</span>
        </div>
      </div>
    </div>
  );
}

// CSS Playground component
function CSSPlayground() {
  const [cssCode, setCssCode] = useState(`
        .animated-element {
        width: 100px;
        height: 100px;
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
        animation: bounce 2s infinite;
        }

        @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-50px); }
        }`);
  const [error, setError] = useState("");

  const applyCSS = (css: string) => {
    try {
      const style = document.createElement("style");
      style.textContent = css;
      document.head.appendChild(style);
      setError("");
      return () => {
        document.head.removeChild(style);
      };
    } catch {
      setError("Invalid CSS");
      return () => {};
    }
  };

  useEffect(() => {
    const cleanup = applyCSS(cssCode);
    return cleanup;
  }, [cssCode]);

  const presets = {
    bounce: `
.animated-element {
  width: 100px;
  height: 100px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-50px); }
}`,
    rotate: `
.animated-element {
  width: 100px;
  height: 100px;
  background: linear-gradient(45deg, #845EC2, #D65DB1);
  animation: rotate 3s infinite linear;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`,
    pulse: `
.animated-element {
  width: 100px;
  height: 100px;
  background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}`,
    shake: `
.animated-element {
  width: 100px;
  height: 100px;
  background: linear-gradient(45deg, #FF9671, #FFC75F);
  animation: shake 0.5s infinite;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}`,
    morph: `
.animated-element {
  width: 100px;
  height: 100px;
  background: linear-gradient(45deg, #00C9A7, #845EC2);
  animation: morph 3s infinite;
}

@keyframes morph {
  0% { border-radius: 0%; }
  50% { border-radius: 50%; }
  100% { border-radius: 0%; }
}`,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(presets).map(([name, code]) => (
          <button
            key={name}
            onClick={() => setCssCode(code)}
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 capitalize"
          >
            {name}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">CSS Editor</h4>
            <button
              onClick={() => {
                try {
                  navigator.clipboard.writeText(cssCode);
                } catch {
                  // Fallback
                  const textarea = document.createElement("textarea");
                  textarea.value = cssCode;
                  document.body.appendChild(textarea);
                  textarea.select();
                  document.execCommand("copy");
                  document.body.removeChild(textarea);
                }
              }}
              className="px-2 py-1 sm:px-3 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Copy CSS
            </button>
          </div>
          <textarea
            value={cssCode}
            onChange={(e) => setCssCode(e.target.value)}
            className="w-full h-[300px] sm:h-[400px] font-mono text-sm p-4 bg-gray-900 text-green-400 rounded-lg"
            spellCheck="false"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <div className="space-y-2">
          <h4 className="font-medium">Preview</h4>
          <div className="h-[200px] sm:h-[400px] bg-gray-50 rounded-lg p-4 flex items-center justify-center">
            <div className="animated-element" />
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-medium mb-2">Tips:</h5>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Edit the CSS code to modify the animation</li>
              <li>Use keyframes to define animation steps</li>
              <li>Try combining multiple animations</li>
              <li>Experiment with different timing functions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Animation Breakdown Component
function AnimationBreakdown() {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState<'slow' | 'normal' | 'frame-by-frame'>('normal');
  const animationRef = useRef<number | null>(null);
  
  const speeds = {
    'slow': 0.25,
    'normal': 1,
    'frame-by-frame': 0
  };
  
  useEffect(() => {
    if (isPlaying && selectedSpeed !== 'frame-by-frame') {
      const startTime = Date.now();
      const duration = 2000; // 2 seconds for a full animation cycle
      
      const animate = () => {
        const elapsed = (Date.now() - startTime) * speeds[selectedSpeed];
        const newProgress = Math.min((elapsed % duration) / duration, 1);
        setProgress(newProgress);
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
      return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      };
    }
  }, [isPlaying, selectedSpeed]);
  
  const playAnimation = () => {
    setIsPlaying(true);
  };
  
  const pauseAnimation = () => {
    setIsPlaying(false);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };
  
  const advanceFrame = () => {
    setProgress(prev => Math.min(prev + 0.05, 1));
  };
  
  const resetFrame = () => {
    setProgress(0);
  };
  
  // Calculate animation values based on progress
  const translateY = -50 * Math.sin(progress * Math.PI); // Simulates a bounce
  const opacity = 0.5 + 0.5 * Math.sin(progress * Math.PI * 2); // Fades in and out
  const scale = 1 + 0.3 * Math.sin(progress * Math.PI); // Grows and shrinks
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
          <div className="relative h-[200px] w-full flex items-center justify-center">
            <motion.div
              className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"
              animate={{ 
                y: translateY,
                scale: scale,
                opacity: opacity 
              }}
            />
            
            {/* Visual indicators */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Progress: {Math.round(progress * 100)}%</span>
                <span>Scale: {scale.toFixed(2)}</span>
              </div>
              <div className="h-1 bg-gray-200 rounded overflow-hidden">
                <div 
                  className="h-full bg-blue-500" 
                  style={{width: `${progress * 100}%`}}
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            <button
              onClick={isPlaying ? pauseAnimation : playAnimation}
              className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            
            <button
              onClick={resetFrame}
              className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Reset
            </button>
            
            {selectedSpeed === 'frame-by-frame' && (
              <button
                onClick={advanceFrame}
                className="px-3 py-1.5 text-sm bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Next Frame
              </button>
            )}
          </div>
          
          <div className="flex gap-3 mt-4">
            {(Object.keys(speeds) as Array<keyof typeof speeds>).map(speed => (
              <label key={speed} className="inline-flex items-center">
                <input
                  type="radio"
                  checked={selectedSpeed === speed}
                  onChange={() => {
                    setSelectedSpeed(speed);
                    // If switching to frame-by-frame, pause animation
                    if (speed === 'frame-by-frame') {
                      pauseAnimation();
                    }
                  }}
                  className="mr-1.5"
                />
                <span className="text-sm text-gray-700">{speed.replace('-', ' ')}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium mb-2">Translation</h4>
          <p className="text-gray-600">
            The element moves up and down in a sine wave pattern.
            <span className="block mt-1 font-mono">y: {translateY.toFixed(0)}px</span>
          </p>
        </div>
        
        <div className="p-4 bg-purple-50 rounded-lg">
          <h4 className="font-medium mb-2">Scaling</h4>
          <p className="text-gray-600">
            The element grows and shrinks based on the progress.
            <span className="block mt-1 font-mono">scale: {scale.toFixed(2)}</span>
          </p>
        </div>
        
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-medium mb-2">Opacity</h4>
          <p className="text-gray-600">
            The element fades in and out in a cyclical pattern.
            <span className="block mt-1 font-mono">opacity: {opacity.toFixed(2)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ReactAnimations() {
  const [isVisible, setIsVisible] = useState(true);
  const [items, setItems] = useState(["Item 1", "Item 2", "Item 3"]);
  const [count, setCount] = useState(3);
  const [rotationSpeed, setRotationSpeed] = useState(2);
  const [scaleAmount, setScaleAmount] = useState(1.2);
  const [activeTab, setActiveTab] = useState("basic");
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Motion values for drag gesture demo
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-100, 100], [-30, 30]);
  const scale = useTransform(y, [-100, 100], [0.5, 3]);

  // React Spring animation
  const springProps = useSpring({
    scale: isVisible ? 1 : 0,
    opacity: isVisible ? 1 : 0,
    config: { tension: 300, friction: 10 },
  });

  const addItem = () => {
    setCount((c) => c + 1);
    setItems((prev) => [...prev, `Item ${count + 1}`]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-12">
      {/* Navigation tabs */}
      <div className="flex flex-wrap gap-2 sm:gap-4 border-b border-gray-200 overflow-x-auto pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => setActiveTab("basic")}
          className={`px-3 py-2 sm:px-4 text-sm sm:text-base whitespace-nowrap ${
            activeTab === "basic" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"
          }`}
        >
          Basic Animations
        </button>
        <button
          onClick={() => setActiveTab("advanced")}
          className={`px-3 py-2 sm:px-4 text-sm sm:text-base whitespace-nowrap ${
            activeTab === "advanced" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"
          }`}
        >
          Advanced Features
        </button>
        <button
          onClick={() => setActiveTab("playground")}
          className={`px-3 py-2 sm:px-4 text-sm sm:text-base whitespace-nowrap ${
            activeTab === "playground" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"
          }`}
        >
          CSS Playground
        </button>
        <button
          onClick={() => setActiveTab("breakdown")}
          className={`px-3 py-2 sm:px-4 text-sm sm:text-base whitespace-nowrap ${
            activeTab === "breakdown" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"
          }`}
        >
          Animation Breakdown
        </button>
        <button
          onClick={() => setActiveTab("accessibility")}
          className={`px-3 py-2 sm:px-4 text-sm sm:text-base whitespace-nowrap ${
            activeTab === "accessibility" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"
          }`}
        >
          Accessibility
        </button>
      </div>

      {/* Performance Metrics section */}
      <section className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Performance Metrics</h3>
          <p className="text-gray-600 mb-4">
            Monitor real-time animation performance with FPS (Frames Per Second)
            tracking.
          </p>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm space-y-4">
            <FPSStats />
            <div className="text-sm text-gray-500">
              <ul className="list-disc list-inside space-y-1">
                <li>Green: 55+ FPS (Smooth)</li>
                <li>Yellow: 50-54 FPS (Minor stutters)</li>
                <li>Red: Below 50 FPS (Noticeable lag)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {activeTab === "basic" && (
        <>
          <section className="space-y-6">
            <div>
              <div className="flex items-center">
                <h3 className="text-xl font-semibold mb-4">Framer Motion</h3>
                <InfoTooltip
                  title="Why Framer Motion?"
                  content="Framer Motion excels at declarative animations with a simple API. It's great for prototyping and production, with built-in gesture support and exit animations."
                />
              </div>
              <p className="text-gray-600 mb-4">
                Framer Motion provides a simple yet powerful API for React
                animations with gesture support and advanced transitions.
              </p>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="text-sm text-gray-600">
                      Rotation Speed: {rotationSpeed}s
                      <input
                        type="range"
                        min="0.5"
                        max="5"
                        step="0.5"
                        value={rotationSpeed}
                        onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                        className="w-full sm:w-32 ml-0 sm:ml-4"
                      />
                    </label>
                    <label className="text-sm text-gray-600">
                      Scale: {scaleAmount}x
                      <input
                        type="range"
                        min="1"
                        max="2"
                        step="0.1"
                        value={scaleAmount}
                        onChange={(e) => setScaleAmount(parseFloat(e.target.value))}
                        className="w-full sm:w-32 ml-0 sm:ml-4"
                      />
                    </label>
                  </div>
                  <motion.div
                    animate={{
                      scale: [1, scaleAmount, 1],
                      rotate: [0, 180, 0],
                      borderRadius: ["0%", "50%", "0%"],
                    }}
                    transition={{
                      duration: rotationSpeed * (1 / playbackSpeed),
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatDelay: 0.5,
                    }}
                    className="w-24 h-24 sm:w-32 sm:h-32 bg-blue-500 mx-auto cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  />
                </div>
                <pre className="text-sm bg-gray-900 text-green-400 p-4 rounded-lg mt-4 overflow-x-auto">
                  {`<motion.div
  animate={{
    scale: [1, ${scaleAmount}, 1],
    rotate: [0, 180, 0]
  }}
  transition={{
    duration: ${rotationSpeed} * (${playbackSpeed} / 1),
    ease: "easeInOut",
    repeat: Infinity
  }}
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
/>`}
                </pre>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Drag and Gesture</h3>
              <p className="text-gray-600 mb-4">
                Create interactive animations that respond to user gestures like
                dragging.
              </p>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                <div className="h-[200px] sm:h-[300px] relative bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
                  <motion.div
                    drag
                    dragElastic={0.2}
                    dragConstraints={{
                      top: -100,
                      left: -100,
                      right: 100,
                      bottom: 100,
                    }}
                    style={{ x, y, rotate, scale }}
                    className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg cursor-grab active:cursor-grabbing"
                    whileDrag={{ boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Drag the box around to see interactive transformations
                </p>
                <pre className="text-sm bg-gray-900 text-green-400 p-4 rounded-lg mt-4 overflow-x-auto">
                  {`<motion.div
  drag
  dragElastic={0.2}
  dragConstraints={{ top: -100, left: -100, right: 100, bottom: 100 }}
  style={{
    x, y,
    rotate: useTransform(x, [-100, 100], [-30, 30]),
    scale: useTransform(y, [-100, 100], [0.5, 3])
  }}
/>`}
                </pre>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">React Spring</h3>
              <p className="text-gray-600 mb-4">
                React Spring uses a spring-physics based animation system to
                create natural-looking motion with minimal configuration.
              </p>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex flex-col items-center gap-4">
                  <animated.div
                    style={{
                      ...springProps,
                      width: 100,
                      height: 100,
                      background: "#10B981",
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                  />
                  <button
                    onClick={() => setIsVisible(!isVisible)}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                  >
                    Toggle Visibility
                  </button>
                </div>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg mt-4 text-sm">
                  {`const springProps = useSpring({
  scale: isVisible ? 1 : 0,
  opacity: isVisible ? 1 : 0,
  config: { tension: 300, friction: 10 }
})`}
                </pre>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Sortable List</h3>
              <p className="text-gray-600 mb-4">
                Create interactive, draggable lists with smooth animations.
              </p>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                <div className="space-y-4">
                  <button
                    onClick={addItem}
                    className="w-full sm:w-auto px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                  >
                    Add Item
                  </button>
                  <Reorder.Group
                    axis="y"
                    values={items}
                    onReorder={setItems}
                    className="space-y-2 max-h-[300px] overflow-y-auto"
                  >
                    {items.map((item) => (
                      <Reorder.Item
                        key={item}
                        value={item}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="flex items-center justify-between p-3 bg-purple-100 rounded-lg cursor-move"
                      >
                        <span className="text-sm sm:text-base">{item}</span>
                        <button
                          onClick={() => removeItem(items.indexOf(item))}
                          className="text-purple-500 hover:text-purple-700 px-2 py-1"
                        >
                          ×
                        </button>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                </div>
                <pre className="text-sm bg-gray-900 text-green-400 p-4 rounded-lg mt-4 overflow-x-auto">
                  {`<Reorder.Group axis="y" values={items} onReorder={setItems}>
  {items.map(item => (
    <Reorder.Item
      key={item}
      value={item}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    />
  ))}
</Reorder.Group>`}
                </pre>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">AnimatePresence</h3>
              <p className="text-gray-600 mb-4">
                AnimatePresence enables exit animations when components are
                removed from the React tree.
              </p>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-32 relative">
                  <AnimatePresence mode="wait">
                    {isVisible && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <motion.div
                          className="w-24 h-24 bg-indigo-500 rounded-lg"
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          whileTap={{ scale: 0.9 }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <button
                  onClick={() => setIsVisible(!isVisible)}
                  className="px-4 py-2 bg-indigo-500 text-white rounded"
                >
                  Toggle Element
                </button>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg mt-4 text-sm">
                  {`<AnimatePresence mode="wait">
  {isVisible && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.1, rotate: 10 }}
      whileTap={{ scale: 0.9 }}
    />
  )}
</AnimatePresence>`}
                </pre>
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === "advanced" && (
        <>
          <section className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Library Comparison</h3>
              <ComparisonView />
            </div>
          </section>

          <section className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Scroll-Based Animation
              </h3>
              <ScrollAnimation />
              <div className="h-[1000px] bg-gradient-to-b from-gray-100 to-white p-4">
                <p className="text-gray-600">
                  Scroll to see the progress bar animation
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === "playground" && (
        <section className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">
              CSS Animation Playground
            </h3>
            <p className="text-gray-600 mb-4">
              Experiment with CSS animations in real-time. Try the presets or
              create your own animations!
            </p>
            <CSSPlayground />
          </div>
        </section>
      )}

      {activeTab === "breakdown" && (
        <section className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Animation Breakdown
            </h3>
            <p className="text-gray-600 mb-4">
              Understand animations by breaking them down into individual steps. 
              Use slow motion or step through frame-by-frame to see exactly how
              properties change over time.
            </p>
            <AnimationBreakdown />
          </div>
        </section>
      )}

      {activeTab === "accessibility" && (
        <section className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Accessibility Considerations
            </h3>
            <AccessibilityControls />
            <div className="mt-4 space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Best Practices</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                  <li>Respect prefers-reduced-motion</li>
                  <li>Avoid rapid flashing animations</li>
                  <li>Provide alternative ways to access content</li>
                  <li>Use appropriate ARIA attributes</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Slow Motion Control */}
      <div className="fixed bottom-4 right-4 z-50 max-w-[90vw] sm:max-w-none">
        <SlowMotionControl onChange={setPlaybackSpeed} />
      </div>
    </div>
  );
}

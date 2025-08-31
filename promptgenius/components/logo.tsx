"use client"

import { motion } from "framer-motion"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  animated?: boolean
}

export default function Logo({ size = "md", animated = true }: LogoProps) {
  const sizes = {
    sm: { width: 32, height: 32, text: "text-lg" },
    md: { width: 40, height: 40, text: "text-xl" },
    lg: { width: 56, height: 56, text: "text-2xl" }
  }

  const currentSize = sizes[size]

  return (
    <div className="flex items-center gap-3">
      <motion.svg
        width={currentSize.width}
        height={currentSize.height}
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative"
        initial={{ rotate: 0 }}
        animate={animated ? { rotate: 360 } : {}}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {/* Outer hexagon */}
        <motion.path
          d="M30 5 L50 17.5 L50 42.5 L30 55 L10 42.5 L10 17.5 Z"
          stroke="#8b5cf6"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        
        {/* Inner triangle */}
        <motion.path
          d="M30 20 L40 35 L20 35 Z"
          fill="#8b5cf6"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "backOut" }}
        />
        
        {/* Center dot */}
        <motion.circle
          cx="30"
          cy="30"
          r="3"
          fill="#000000"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.5, 1] }}
          transition={{ duration: 0.6, delay: 1, ease: "backOut" }}
        />
        
        {/* Orbiting dots - smaller and subtler */}
        {[0, 120, 240].map((rotation, i) => (
          <motion.circle
            key={i}
            cx="30"
            cy="10"
            r="1.5"
            fill="#a78bfa"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.6, 0],
              rotate: [rotation, rotation + 360]
            }}
            transition={{
              duration: 3,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ transformOrigin: "30px 30px" }}
          />
        ))}
      </motion.svg>
      
      <motion.span 
        className={`font-bold ${currentSize.text} tracking-tight`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <span className="text-gray-900">Prompt</span>
        <span className="text-purple-600">Genius</span>
      </motion.span>
    </div>
  )
}
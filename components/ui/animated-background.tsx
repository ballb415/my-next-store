"use client"

import React from "react"

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none select-none">
      {/* Base Light Sky Tint */}
      <div className="absolute inset-0 bg-[#f4f9ff]" />

      {/* Floating Liquid Mesh Layer 1 - Azure Sky Top Left */}
      <div className="absolute -top-[20%] -left-[15%] w-[65vw] h-[65vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-tr from-sky-400/30 via-blue-300/25 to-cyan-300/15 blur-[120px] animate-mesh-1" />

      {/* Floating Liquid Mesh Layer 2 - Sapphire Deep Right */}
      <div className="absolute top-[30%] -right-[20%] w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full bg-gradient-to-bl from-blue-500/25 via-sky-400/25 to-indigo-300/20 blur-[140px] animate-mesh-2" />

      {/* Floating Liquid Mesh Layer 3 - Ocean Blue Bottom Center */}
      <div 
        className="absolute -bottom-[25%] left-[15%] w-[55vw] h-[55vw] max-w-[750px] max-h-[750px] rounded-full bg-gradient-to-r from-sky-500/25 via-blue-400/20 to-teal-300/15 blur-[130px] animate-mesh-1" 
        style={{ animationDelay: '-9s' }} 
      />

      {/* Ultra Subtle Grid Dot Pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04]" 
        style={{
          backgroundImage: `radial-gradient(#0284c7 1.2px, transparent 1.2px)`,
          backgroundSize: '28px 28px'
        }}
      />
    </div>
  )
}

"use client";

import React, { useState } from "react";
import { UploadedModelMetadata } from "@/types/custom-print";
import {
  Box,
  RotateCcw,
  ZoomIn,
  Move,
  Layers,
  Sparkles,
  Maximize2,
  Eye,
  Info,
} from "lucide-react";

interface CustomModelPreviewProps {
  modelFile: UploadedModelMetadata | null;
  className?: string;
}

/**
 * CustomModelPreview
 * Architecture-ready viewport component prepared for WebGL / Three.js 3D viewer integration.
 * In this phase, displays a clean Figma-aligned studio viewport placeholder with
 * model metadata, simulated orbit/zoom controls, and adapter architecture notes.
 */
export function CustomModelPreview({ modelFile, className = "" }: CustomModelPreviewProps) {
  const [activeAngle, setActiveAngle] = useState<"iso" | "front" | "top" | "side">("iso");
  const [wireframeMode, setWireframeMode] = useState(false);

  return (
    <div
      className={`relative flex flex-col rounded-2xl border border-[var(--border)] bg-gradient-to-b from-stone-900 to-stone-950 text-white overflow-hidden shadow-md select-none ${className}`}
      aria-label="3D Model Preview Viewport"
    >
      {/* Top Bar: Viewport Status & Format Badge */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-800 bg-stone-900/80 backdrop-blur-xs text-xs z-10">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-stone-200">
            {modelFile ? "Model Viewport" : "Viewport Standby"}
          </span>
          {modelFile && (
            <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 font-mono text-[10px] uppercase border border-stone-700">
              {modelFile.extension.replace(".", "")}
            </span>
          )}
        </div>

        {/* View Angle Shortcuts */}
        {modelFile && (
          <div className="flex items-center gap-1 bg-stone-800/80 rounded-lg p-0.5 border border-stone-700 text-[11px]">
            <button
              type="button"
              onClick={() => setActiveAngle("iso")}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeAngle === "iso" ? "bg-[var(--primary)] text-white font-bold" : "text-stone-400 hover:text-white"
              }`}
            >
              Isometric
            </button>
            <button
              type="button"
              onClick={() => setActiveAngle("front")}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeAngle === "front" ? "bg-[var(--primary)] text-white font-bold" : "text-stone-400 hover:text-white"
              }`}
            >
              Front
            </button>
            <button
              type="button"
              onClick={() => setActiveAngle("top")}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeAngle === "top" ? "bg-[var(--primary)] text-white font-bold" : "text-stone-400 hover:text-white"
              }`}
            >
              Top
            </button>
          </div>
        )}
      </div>

      {/* Main Viewport Stage */}
      <div className="relative min-h-[280px] sm:min-h-[340px] flex items-center justify-center p-6 overflow-hidden">
        {/* Subtle 3D Studio Grid Background */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at center, rgba(37, 99, 235, 0.15) 0%, transparent 70%),
              linear-gradient(to right, #333 1px, transparent 1px),
              linear-gradient(to bottom, #333 1px, transparent 1px)
            `,
            backgroundSize: "100% 100%, 32px 32px, 32px 32px",
          }}
        />

        {modelFile ? (
          /* When a model is selected */
          <div className="relative z-10 flex flex-col items-center text-center max-w-sm px-4">
            {/* Visual 3D Hologram / Placeholder Frame */}
            <div className="relative mb-5 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-tr from-stone-800 via-stone-700 to-stone-800 border border-stone-600 shadow-2xl">
              <Box className="h-12 w-12 text-stone-200" strokeWidth={1.5} />
              <div className="absolute -inset-1 rounded-2xl border border-[var(--primary)]/30 animate-pulse pointer-events-none" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-700/50 text-blue-300 text-xs font-semibold mb-2">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span>Interactive 3D Preview Coming Soon</span>
            </div>

            <h3 className="text-sm font-bold text-stone-100 truncate max-w-full">
              {modelFile.name}
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              {modelFile.formattedSize} • Geometry parsed & stored locally
            </p>

            <p className="text-[11px] text-stone-400 mt-3 leading-relaxed bg-stone-900/80 p-2.5 rounded-xl border border-stone-800">
              In upcoming releases, our WebGL 3D engine will render full orbit, zoom, pan, and real-time mesh wall-thickness checks for {modelFile.extension.toUpperCase()} models right here.
            </p>
          </div>
        ) : (
          /* Empty / Standby State */
          <div className="relative z-10 flex flex-col items-center text-center max-w-xs px-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-800/80 border border-stone-700 text-stone-400 mb-4">
              <Box className="h-8 w-8 text-stone-400" strokeWidth={1.5} />
            </div>
            <h4 className="text-sm font-bold text-stone-200">
              Interactive 3D Preview Coming Soon
            </h4>
            <p className="text-xs text-stone-400 mt-1 leading-relaxed">
              Upload a 3D model (.stl, .obj, .3mf, .glb, .gltf) to prepare geometry inspection and printing specifications.
            </p>
          </div>
        )}

        {/* Viewport Floating Controls Toolbar (Future 3D Controls Preview) */}
        {modelFile && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-stone-400 bg-stone-900/90 backdrop-blur-xs px-3 py-2 rounded-xl border border-stone-800">
            <div className="flex items-center gap-2 text-[11px]">
              <span className="flex items-center gap-1">
                <RotateCcw className="h-3 w-3 text-stone-400" /> Orbit
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ZoomIn className="h-3 w-3 text-stone-400" /> Zoom
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Move className="h-3 w-3 text-stone-400" /> Pan
              </span>
            </div>

            <button
              type="button"
              onClick={() => setWireframeMode(!wireframeMode)}
              className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded cursor-pointer transition-colors ${
                wireframeMode ? "bg-blue-600 text-white font-bold" : "hover:text-stone-200"
              }`}
              title="Toggle Mesh Inspection mode"
            >
              <Layers className="h-3 w-3" />
              <span>{wireframeMode ? "Mesh: Wireframe" : "Mesh: Solid"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

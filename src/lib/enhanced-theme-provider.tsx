/**
 * ============================================================================
 * ENHANCED THEME PROVIDER - Advanced Theme System with Color Themes
 * ============================================================================
 * 
 * Enhanced provider that manages both mode (light/dark/system) and color themes
 * 
 * Features:
 * - Light/Dark/System mode support
 * - Multiple color themes (neutral, blue, green, purple, orange, etc.)
 * - Persistent storage for both preferences
 * - Smooth transitions between themes
 * - Accessibility-compliant color schemes
 */

"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

// Available theme modes
export type ThemeMode = "light" | "dark" | "system"

// Available color themes
export type ColorTheme = "neutral" | "blue" | "green" | "purple" | "orange" | "red" | "yellow" | "teal"

// Color theme definitions with metadata
export const COLOR_THEMES = {
  neutral: {
    name: "Neutral",
    description: "Classic neutral gray theme",
    preview: "#71717a",
  },
  blue: {
    name: "Blue",
    description: "Professional blue theme",
    preview: "#3b82f6",
  },
  green: {
    name: "Green",
    description: "Nature-inspired green theme",
    preview: "#10b981",
  },
  purple: {
    name: "Purple",
    description: "Creative purple theme",
    preview: "#8b5cf6",
  },
  orange: {
    name: "Orange",
    description: "Energetic orange theme",
    preview: "#f97316",
  },
  red: {
    name: "Red",
    description: "Bold red theme",
    preview: "#ef4444",
  },
  yellow: {
    name: "Yellow",
    description: "Bright yellow theme",
    preview: "#eab308",
  },
  teal: {
    name: "Teal",
    description: "Calm teal theme",
    preview: "#14b8a6",
  },
} as const

// Props for EnhancedThemeProvider
type EnhancedThemeProviderProps = {
  children: React.ReactNode
  defaultMode?: ThemeMode
  defaultColorTheme?: ColorTheme
  storageKey?: string
  colorStorageKey?: string
}

// State and methods for the context
type EnhancedThemeProviderState = {
  mode: ThemeMode
  colorTheme: ColorTheme
  setMode: (mode: ThemeMode) => void
  setColorTheme: (colorTheme: ColorTheme) => void
  setTheme: (mode: ThemeMode, colorTheme?: ColorTheme) => void
}

// Initial state
const initialState: EnhancedThemeProviderState = {
  mode: "system",
  colorTheme: "neutral",
  setMode: () => null,
  setColorTheme: () => null,
  setTheme: () => null,
}

// Create context
const EnhancedThemeProviderContext = createContext<EnhancedThemeProviderState>(initialState)

/**
 * Enhanced Theme Provider Component
 */
export function EnhancedThemeProvider({
  children,
  defaultMode = "system",
  defaultColorTheme = "neutral",
  storageKey = "ui-theme-mode",
  colorStorageKey = "ui-theme-color",
}: EnhancedThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(defaultMode)
  const [colorTheme, setColorTheme] = useState<ColorTheme>(defaultColorTheme)
  const [mounted, setMounted] = useState(false)

  /**
   * Load saved preferences from localStorage
   */
  useEffect(() => {
    setMounted(true)
    const storedMode = localStorage?.getItem(storageKey) as ThemeMode
    const storedColorTheme = localStorage?.getItem(colorStorageKey) as ColorTheme
    
    if (storedMode && ["light", "dark", "system"].includes(storedMode)) {
      setMode(storedMode)
    }
    
    if (storedColorTheme && Object.keys(COLOR_THEMES).includes(storedColorTheme)) {
      setColorTheme(storedColorTheme)
    }
  }, [storageKey, colorStorageKey])

  /**
   * Apply theme to DOM
   */
  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement

    // Remove existing theme classes
    root.classList.remove("light", "dark", "force-light", "force-dark")
    Object.keys(COLOR_THEMES).forEach(theme => {
      root.classList.remove(`theme-${theme}`)
    })
    root.removeAttribute("data-theme")
    root.removeAttribute("data-color-theme")

    // Apply color theme
    root.classList.add(`theme-${colorTheme}`)
    root.setAttribute("data-color-theme", colorTheme)

    if (mode === "system") {
      // Handle system preference
      const applySystemTheme = () => {
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        
        root.classList.remove("light", "dark")
        if (systemPrefersDark) {
          root.classList.add("dark")
        } else {
          root.classList.add("light")
        }
      }

      applySystemTheme()
      root.setAttribute("data-theme", "system")

      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      mediaQuery.addEventListener("change", applySystemTheme)
      
      return () => {
        mediaQuery.removeEventListener("change", applySystemTheme)
      }
    }

    // Apply forced mode
    root.setAttribute("data-theme", mode)
    root.classList.add(mode)
    
    if (mode === "light") {
      root.classList.add("force-light")
    } else if (mode === "dark") {
      root.classList.add("force-dark")
    }
  }, [mode, colorTheme, mounted])

  // Context value
  const value = {
    mode,
    colorTheme,
    setMode: (newMode: ThemeMode) => {
      localStorage?.setItem(storageKey, newMode)
      setMode(newMode)
    },
    setColorTheme: (newColorTheme: ColorTheme) => {
      localStorage?.setItem(colorStorageKey, newColorTheme)
      setColorTheme(newColorTheme)
    },
    setTheme: (newMode: ThemeMode, newColorTheme?: ColorTheme) => {
      localStorage?.setItem(storageKey, newMode)
      setMode(newMode)
      
      if (newColorTheme) {
        localStorage?.setItem(colorStorageKey, newColorTheme)
        setColorTheme(newColorTheme)
      }
    },
  }

  return (
    <EnhancedThemeProviderContext.Provider value={value}>
      {children}
    </EnhancedThemeProviderContext.Provider>
  )
}

/**
 * Hook to use the enhanced theme context
 */
export const useEnhancedTheme = () => {
  const context = useContext(EnhancedThemeProviderContext)

  if (context === undefined) {
    throw new Error("useEnhancedTheme must be used within an EnhancedThemeProvider")
  }

  return context
}

// Backward compatibility hook
export const useTheme = () => {
  const { mode, setMode } = useEnhancedTheme()
  
  return {
    theme: mode,
    setTheme: setMode,
  }
}

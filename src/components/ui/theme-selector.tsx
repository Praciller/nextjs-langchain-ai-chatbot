"use client"

import * as React from "react"
import { Moon, Sun, Monitor, Palette, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { 
  useEnhancedTheme, 
  COLOR_THEMES, 
  type ThemeMode, 
  type ColorTheme 
} from "@/lib/enhanced-theme-provider"

export function ThemeSelector() {
  const { mode, colorTheme, setMode, setColorTheme } = useEnhancedTheme()

  const modes = [
    {
      value: "light" as ThemeMode,
      label: "Light",
      icon: Sun,
    },
    {
      value: "dark" as ThemeMode,
      label: "Dark",
      icon: Moon,
    },
    {
      value: "system" as ThemeMode,
      label: "System",
      icon: Monitor,
    },
  ]

  const currentMode = modes.find(m => m.value === mode) || modes[2]
  const CurrentModeIcon = currentMode.icon

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <div className="relative">
            <CurrentModeIcon className="h-[1.2rem] w-[1.2rem]" />
            <div 
              className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background"
              style={{ backgroundColor: COLOR_THEMES[colorTheme].preview }}
            />
          </div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <h4 className="font-medium">Theme Settings</h4>
          </div>

          {/* Mode Selection */}
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-muted-foreground">Mode</h5>
            <div className="grid grid-cols-3 gap-2">
              {modes.map((modeOption) => {
                const Icon = modeOption.icon
                return (
                  <Button
                    key={modeOption.value}
                    variant={mode === modeOption.value ? "default" : "outline"}
                    size="sm"
                    className="justify-start"
                    onClick={() => setMode(modeOption.value)}
                  >
                    <Icon className="mr-2 h-3 w-3" />
                    {modeOption.label}
                  </Button>
                )
              })}
            </div>
          </div>

          <Separator />

          {/* Color Theme Selection */}
          <div className="space-y-3">
            <h5 className="text-sm font-medium text-muted-foreground">Color Theme</h5>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(COLOR_THEMES).map(([key, theme]) => (
                <button
                  key={key}
                  className={cn(
                    "group relative flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all hover:bg-muted/50",
                    colorTheme === key 
                      ? "border-primary bg-muted/30" 
                      : "border-muted hover:border-muted-foreground/20"
                  )}
                  onClick={() => setColorTheme(key as ColorTheme)}
                >
                  {/* Color Preview Circle */}
                  <div 
                    className="h-6 w-6 rounded-full border-2 border-background shadow-sm"
                    style={{ backgroundColor: theme.preview }}
                  />
                  
                  {/* Theme Name */}
                  <span className="text-xs font-medium">{theme.name}</span>
                  
                  {/* Selected Indicator */}
                  {colorTheme === key && (
                    <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Current Theme Info */}
          <div className="rounded-lg bg-muted/30 p-3">
            <div className="flex items-center gap-2 text-sm">
              <div 
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLOR_THEMES[colorTheme].preview }}
              />
              <span className="font-medium">{COLOR_THEMES[colorTheme].name}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{currentMode.label} mode</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {COLOR_THEMES[colorTheme].description}
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Compact version for mobile or smaller spaces
export function CompactThemeSelector() {
  const { mode, colorTheme, setMode, setColorTheme } = useEnhancedTheme()

  const modes = [
    { value: "light" as ThemeMode, icon: Sun },
    { value: "dark" as ThemeMode, icon: Moon },
    { value: "system" as ThemeMode, icon: Monitor },
  ]

  const currentMode = modes.find(m => m.value === mode) || modes[2]
  const CurrentModeIcon = currentMode.icon

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <div className="relative">
            <CurrentModeIcon className="h-4 w-4" />
            <div 
              className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-background"
              style={{ backgroundColor: COLOR_THEMES[colorTheme].preview }}
            />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="space-y-3">
          {/* Mode Toggle */}
          <div className="flex gap-1">
            {modes.map((modeOption) => {
              const Icon = modeOption.icon
              return (
                <Button
                  key={modeOption.value}
                  variant={mode === modeOption.value ? "default" : "ghost"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setMode(modeOption.value)}
                >
                  <Icon className="h-3 w-3" />
                </Button>
              )
            })}
          </div>

          <Separator />

          {/* Color Selection */}
          <div className="grid grid-cols-4 gap-1">
            {Object.entries(COLOR_THEMES).map(([key, theme]) => (
              <button
                key={key}
                className={cn(
                  "relative h-8 w-8 rounded-md border-2 transition-all hover:scale-110",
                  colorTheme === key 
                    ? "border-foreground shadow-md" 
                    : "border-muted-foreground/20 hover:border-muted-foreground/40"
                )}
                style={{ backgroundColor: theme.preview }}
                onClick={() => setColorTheme(key as ColorTheme)}
                title={theme.name}
              >
                {colorTheme === key && (
                  <Check className="absolute inset-0 m-auto h-3 w-3 text-white drop-shadow-sm" />
                )}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

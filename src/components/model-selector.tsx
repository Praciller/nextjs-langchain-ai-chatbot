import { cn } from "@/lib/utils"

export function ModelSelector({ selectedModel, className }: { selectedModel: string; className?: string }) {
  return <span className={cn("text-sm font-medium", className)}>{selectedModel}</span>
}

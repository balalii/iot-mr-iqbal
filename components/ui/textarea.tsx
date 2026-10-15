import * as React from "react"
import { cn } from "cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full border-[3px] border-ink bg-paper px-3.5 py-2.5 text-base font-medium transition-[box-shadow,background-color] outline-none placeholder:font-normal placeholder:text-muted-foreground focus-visible:bg-white focus-visible:shadow-brutal-sm focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

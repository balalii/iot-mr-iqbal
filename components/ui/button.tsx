import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

// Tombol label mono kapital, garis tinta, siku. Hover: terangkat dengan bayangan keras.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border-[3px] border-ink font-mono text-[0.8rem] font-extrabold tracking-[0.12em] whitespace-nowrap uppercase outline-none select-none transition-[transform,box-shadow,background-color,color] duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-x-[3px] hover:-translate-y-[3px] active:translate-x-0 active:translate-y-0 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue disabled:pointer-events-none disabled:opacity-45 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-blue text-white hover:shadow-brutal active:shadow-none",
        // CTA: bayangan keras tebal sejak diam, makin dalam saat diangkat.
        red: "bg-red text-ink shadow-brutal-lg hover:shadow-[12px_12px_0_0_var(--ink)] active:shadow-brutal-sm",
        white: "bg-white text-ink shadow-brutal-lg hover:shadow-[12px_12px_0_0_var(--ink)] active:shadow-brutal-sm",
        cta: "bg-blue text-white shadow-brutal-lg hover:shadow-[12px_12px_0_0_var(--ink)] active:shadow-brutal-sm",
        sun: "bg-sun text-ink hover:shadow-brutal active:shadow-none",
        ink: "bg-ink text-white hover:shadow-brutal active:shadow-none",
        outline: "bg-paper text-ink hover:bg-sun hover:shadow-brutal active:shadow-none",
        secondary: "bg-ink text-white hover:shadow-brutal active:shadow-none",
        ghost:
          "border-transparent bg-transparent hover:translate-x-0 hover:translate-y-0 hover:border-ink hover:bg-paper",
        destructive: "bg-destructive text-white hover:shadow-brutal active:shadow-none",
        link: "border-transparent bg-transparent text-blue underline-offset-4 hover:translate-x-0 hover:translate-y-0 hover:underline",
      },
      size: {
        default: "h-11 gap-2.5 px-5",
        xs: "h-7 gap-1 px-2 text-[0.68rem] [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-2 px-3 text-[0.72rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-14 gap-3 px-7 text-[1rem] tracking-[0.1em]",
        icon: "size-11",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9",
        "icon-lg": "size-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { VariantProps } from "class-variance-authority"
import { buttonVariants } from "./button-variants"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  whileTap?: any  // Optional: Add typing if needed
}

const Button = React.forwardRef<HTMLButtonElement | HTMLDivElement, ButtonProps>(
  ({ className, variant, size, asChild = false, whileTap, ...rest }, ref) => {
    const Comp = asChild ? motion.div : motion.button

    return (
      <Comp
        ref={ref as React.Ref<HTMLDivElement | HTMLButtonElement>} // Cast ref to the appropriate type
        className={cn(buttonVariants({ variant, size, className }))}
        whileTap={whileTap}
        {...rest}
      />
    )
  }
)

Button.displayName = "Button"

export { Button }

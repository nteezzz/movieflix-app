"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast text-left group-[.toaster]:bg-zinc-800 group-[.toaster]:text-white group-[.toaster]:border-red-800 group-[.toaster]:shadow-lg",
          description: "text-left group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-red-800 group-[.toast]:text-red-800",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

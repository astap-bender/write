import * as React from 'react'
import { Drawer as DrawerPrimitive } from 'vaul'
import { cn } from '@/lib/utils'

const Drawer = DrawerPrimitive.Root
const DrawerTrigger = DrawerPrimitive.Trigger
const DrawerPortal = DrawerPrimitive.Portal
const DrawerClose = DrawerPrimitive.Close
const DrawerOverlay = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay ref={ref} className={cn('fixed inset-0 z-50 bg-black/50', className)} {...props} />
))
DrawerOverlay.displayName = 'DrawerOverlay'

const DrawerContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(({ className, ...props }, ref) => (
  <DrawerPortal>
    <DrawerPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
    <DrawerPrimitive.Content ref={ref} className={cn('fixed inset-x-0 bottom-0 z-50 mt-24 rounded-t-[10px] border bg-background p-6 shadow-lg outline-none', className)} {...props} />
  </DrawerPortal>
))
DrawerContent.displayName = 'DrawerContent'

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('grid gap-1.5 p-0 text-center sm:text-left', className)} {...props} />
)
const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mt-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
)
const DrawerTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn('text-lg font-semibold', className)} {...props} />
))
DrawerTitle.displayName = 'DrawerTitle'
const DrawerDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
))
DrawerDescription.displayName = 'DrawerDescription'

export {
  Drawer,
  DrawerTrigger,
  DrawerPortal,
  DrawerClose,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}



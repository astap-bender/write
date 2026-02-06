import * as React from 'react'
import * as MenubarPrimitive from '@radix-ui/react-menubar'
import { cn } from '@/lib/utils'

const MenubarMenu = MenubarPrimitive.Menu
const MenubarGroup = MenubarPrimitive.Group
const MenubarPortal = MenubarPrimitive.Portal
const MenubarSub = MenubarPrimitive.Sub
const MenubarRadioGroup = MenubarPrimitive.RadioGroup

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root ref={ref} className={cn('flex h-10 items-center space-x-2 rounded-md border bg-background p-1', className)} {...props} />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger ref={ref} className={cn('flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground', className)} {...props} />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(({ className, align = 'start', alignOffset = -4, sideOffset = 8, ...props }, ref) => (
  <MenubarPrimitive.Content
    ref={ref}
    align={align}
    alignOffset={alignOffset}
    sideOffset={sideOffset}
    className={cn('z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md', className)}
    {...props}
  />
))
MenubarContent.displayName = MenubarPrimitive.Content.displayName

const itemClasses = 'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground'

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Item ref={ref} className={cn(itemClasses, className)} {...props} />
))
MenubarItem.displayName = MenubarPrimitive.Item.displayName

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem ref={ref} className={cn(itemClasses, className)} {...props}>
    {children}
  </MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator ref={ref} className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

export {
  Menubar,
  MenubarMenu,
  MenubarGroup,
  MenubarPortal,
  MenubarSub,
  MenubarRadioGroup,
  MenubarContent,
  MenubarItem,
  MenubarTrigger,
  MenubarCheckboxItem,
  MenubarSeparator,
}



import * as React from 'react'
import {
  PanelGroup as ResizablePanelGroupPrimitive,
  Panel as ResizablePanelPrimitive,
  PanelResizeHandle as ResizableHandlePrimitive,
} from 'react-resizable-panels'
import { cn } from '@/lib/utils'

const ResizablePanelGroup = ({ className, ...props }: React.ComponentProps<typeof ResizablePanelGroupPrimitive>) => (
  <ResizablePanelGroupPrimitive className={cn('flex w-full', className)} {...props} />
)

const ResizablePanel = ResizablePanelPrimitive

const ResizableHandle = ({ className, ...props }: React.ComponentProps<typeof ResizableHandlePrimitive>) => (
  <ResizableHandlePrimitive className={cn('relative w-px bg-border after:absolute after:left-1/2 after:top-1/2 after:h-6 after:w-0.5 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-muted', className)} {...props} />
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }



import * as React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { cn } from '@/lib/utils'

type CarouselOptions = Parameters<typeof useEmblaCarousel>[0]
type CarouselProps = React.HTMLAttributes<HTMLDivElement> & { options?: CarouselOptions }

const CarouselContext = React.createContext<ReturnType<typeof useEmblaCarousel> | null>(null)

function Carousel({ className, options, children, ...props }: CarouselProps) {
  const embla = useEmblaCarousel(options)
  return (
    <div className={cn('relative', className)} {...props}>
      <CarouselContext.Provider value={embla}>{children}</CarouselContext.Provider>
    </div>
  )
}

function CarouselContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const [ref] = React.useContext(CarouselContext) ?? []
  return (
    <div className={cn('overflow-hidden', className)} ref={ref}>
      <div className="-ml-4 flex" {...props} />
    </div>
  )
}

function CarouselItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('min-w-0 flex-[0_0_100%] pl-4', className)} {...props} />
}

function CarouselPrev({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const [_, api] = React.useContext(CarouselContext) ?? []
  return (
    <button className={cn('absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border bg-background p-2 shadow', className)} onClick={() => api?.scrollPrev()} {...props}>
      {children ?? <span aria-hidden>‹</span>}
    </button>
  )
}

function CarouselNext({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const [_, api] = React.useContext(CarouselContext) ?? []
  return (
    <button className={cn('absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border bg-background p-2 shadow', className)} onClick={() => api?.scrollNext()} {...props}>
      {children ?? <span aria-hidden>›</span>}
    </button>
  )
}

export { Carousel, CarouselContent, CarouselItem, CarouselPrev, CarouselNext }



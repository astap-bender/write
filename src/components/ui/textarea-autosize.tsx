import * as React from 'react'
import { Textarea } from './textarea'

export function TextareaAutosize(props: React.ComponentProps<typeof Textarea>) {
  const ref = React.useRef<HTMLTextAreaElement | null>(null)

  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  })

  return <Textarea ref={ref} onInput={(e) => ((e.target as HTMLTextAreaElement).style.height = 'auto')} {...props} />
}



import * as React from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

export function DatePicker(props: React.ComponentProps<typeof DayPicker>) {
  return <DayPicker className="p-2 [--rdp-cell-size:36px] [--rdp-accent-color:hsl(var(--primary))]" {...props} />
}



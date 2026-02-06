// Optional helper component for lists of checkboxes
import { Checkbox } from './checkbox'

export interface CheckboxOption {
  label: string
  value: string
  disabled?: boolean
}

export function CheckboxGroup({ options, values, onChange }: { options: CheckboxOption[]; values: string[]; onChange: (values: string[]) => void }) {
  return (
    <div className="grid gap-2">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2">
          <Checkbox checked={values.includes(opt.value)} onCheckedChange={(checked) => onChange(checked ? [...values, opt.value] : values.filter((v) => v !== opt.value))} disabled={opt.disabled} />
          <span className="text-sm">{opt.label}</span>
        </label>
      ))}
    </div>
  )
}



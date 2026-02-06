import type { ComponentPropsWithoutRef } from 'react'
import { OTPInput, SlotProps, OTPInputProps } from 'input-otp'
import { cn } from '@/lib/utils'

function InputOTP({ className, ...props }: OTPInputProps) {
  return <OTPInput containerClassName={cn('flex gap-2', className)} {...props} />
}

type InputOTPSlotProps = SlotProps & ComponentPropsWithoutRef<'div'>

function InputOTPSlot({ className, hasFakeCaret, isActive, char, ...props }: InputOTPSlotProps) {
  return (
    <div
      data-active={isActive}
      className={cn('relative flex h-9 w-8 items-center justify-center rounded-md border text-sm shadow-sm data-[active=true]:z-10 data-[active=true]:ring-2 data-[active=true]:ring-ring', className)}
      {...props}
    >
      {char}
      {hasFakeCaret ? <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-foreground" /> : null}
    </div>
  )
}

export { InputOTP, InputOTPSlot }



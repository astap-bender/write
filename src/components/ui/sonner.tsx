import { Toaster as SonnerToaster, toast } from 'sonner'

function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      closeButton
      theme="system"
      richColors
      toastOptions={{ classNames: { toast: 'border bg-background text-foreground' } }}
    />
  )
}

export { Toaster, toast }



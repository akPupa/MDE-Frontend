import { AlertCircle } from 'lucide-react'

interface ErrorAlertProps {
  message: string
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
  if (!message) return null

  return (
    <div className="flex items-center gap-3 p-[16px_20px] rounded-[10px] bg-[#FEE2E2] border-none mb-8 animate-[shake_0.4s_cubic-bezier(0.36,0.07,0.19,0.97)_both]" role="alert">
      <div className="text-[#DC2626] shrink-0">
        <AlertCircle size={24} />
      </div>
      <div className="text-[#991B1B] text-[13px] leading-[1.5] font-semibold">
        {message}
      </div>
    </div>
  )
}


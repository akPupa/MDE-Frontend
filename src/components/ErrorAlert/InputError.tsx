import { AlertCircle } from 'lucide-react'
import { useFormikContext } from 'formik'

interface InputErrorProps {
  message?: string
  name?: string
}

export default function InputError({ message, name }: InputErrorProps) {
  const formik = useFormikContext<any>()
  
  // Use explicit message if provided, otherwise look up in formik context if name is provided
  const error = message || (name && formik?.touched[name] ? (formik.errors[name] as string) : null)

  if (!error) return null

  return (
    <div className="flex items-center gap-1.5 mt-1.5 text-[12px] font-medium text-red-500 animate-[fadeIn_0.2s_ease-out]">
      <AlertCircle size={14} />
      <span>{error}</span>
    </div>
  )
}


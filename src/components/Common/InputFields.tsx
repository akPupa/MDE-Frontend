import { Eye, EyeOff, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { useFormikContext } from 'formik'
import InputError from '../ErrorAlert/InputError'

interface InputFieldsProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: LucideIcon
  name: string
  containerClassName?: string
  labelClassName?: string
  error?: string
}

export default function InputFields({
  label,
  icon: Icon,
  name,
  type = 'text',
  className = '',
  containerClassName = '',
  labelClassName = '',
  error: manualError,
  placeholder,
  ...props
}: InputFieldsProps) {
  const [showPassword, setShowPassword] = useState(false)
  const formik = useFormikContext<any>()

  // Handle Formik integration if it exists
  const fieldProps = formik ? formik.getFieldProps(name) : {}
  const isTouched = formik ? formik.touched[name] : false
  const formikError = formik ? (formik.errors[name] as string) : undefined
  
  const displayError = manualError || (isTouched ? formikError : undefined)
  const isInvalid = !!displayError

  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  // Checkbox specific styling and behavior
  if (type === 'checkbox') {
    return (
      <div className={`flex items-center gap-2 ${containerClassName}`}>
        <input
          {...fieldProps}
          {...props}
          id={name}
          name={name}
          type="checkbox"
          checked={formik ? formik.values[name] : props.checked}
          className={`appearance-none w-[18px] h-[18px] border-2 border-gray-300 rounded-[4px] relative cursor-pointer transition-all bg-white checked:bg-primary-deep checked:border-primary-deep after:content-[''] after:absolute after:top-[2px] after:left-[5px] after:w-[5px] after:h-[9px] after:border-solid after:border-white after:border-r-2 after:border-b-2 after:rotate-45 ${className}`}
        />
        {label && (
          <label htmlFor={name} className={`cursor-pointer text-[14px] font-medium text-gray-700 transition-colors hover:text-gray-900 ${labelClassName}`}>
            {label}
          </label>
        )}
      </div>
    )
  }

  return (
    <div className={`flex flex-col gap-2 ${containerClassName}`}>
      {label && (
        <label htmlFor={name} className={`text-[11px] font-bold text-gray-700 tracking-[0.5px] uppercase ${labelClassName}`}>
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <span className="absolute left-[14px] flex items-center text-gray-400 pointer-events-none">
            <Icon size={18} strokeWidth={2.2} />
          </span>
        )}
        <input
          {...fieldProps}
          {...props}
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          className={`w-full px-[14px] py-[13px] border rounded-md text-[15px] outline-none transition-all font-medium ${
            Icon ? 'pl-11' : ''
          } ${isPassword ? 'pr-11' : ''} ${
            isInvalid 
              ? 'border-red-500 bg-red-50/30 focus:ring-red-500/10' 
              : 'border-transparent bg-gray-100 focus:bg-white focus:ring-primary/10 focus:border-primary'
          } ${className}`}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute right-[14px] bg-transparent border-none text-gray-500 cursor-pointer flex items-center transition-colors hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
          </button>
        )}
      </div>
      {/* Either show manual error or let InputError handle Formik error */}
      {manualError ? (
        <InputError message={manualError} />
      ) : (
        <InputError name={name} />
      )}
    </div>
  )
}

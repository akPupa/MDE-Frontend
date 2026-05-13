import React, { useState, useContext } from 'react'
import { Eye, EyeOff, type LucideIcon } from 'lucide-react'
import { FormikContext } from 'formik'

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    icon?: LucideIcon
    name: string
    containerClassName?: string
    labelClassName?: string
    error?: string
}

export default function TextInput({
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
}: TextInputProps) {
    const [showPassword, setShowPassword] = useState(false)

    // Using useContext directly suppresses the "Formik context is undefined" warning
    const formik = useContext(FormikContext)

    // Safe access to Formik properties
    const fieldProps = formik ? formik.getFieldProps(name) : {}
    const isTouched = formik ? formik.touched[name] : false
    const formikError = formik ? (formik.errors[name] as string) : undefined

    const displayError = manualError || (isTouched ? formikError : undefined)
    const isInvalid = !!displayError

    const isPassword = type === 'password'
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

    return (
        <div className={`flex flex-col gap-2 ${containerClassName}`}>
            {label && (
                <label
                    htmlFor={name}
                    className={`text-[11px] font-bold text-gray-700 tracking-[0.5px] uppercase ${labelClassName}`}
                >
                    {label}
                </label>
            )}

            <div className="relative flex items-center">
                {Icon && (
                    <span className="absolute left-[14px] text-gray-400 pointer-events-none">
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
                    className={`w-full px-3 py-2 border rounded-md text-[15px] outline-none transition-all duration-200 font-medium
                        ${Icon ? 'pl-11' : ''}
                        ${isPassword ? 'pr-11' : ''}
                        ${isInvalid
                            ? 'border-red-500 bg-red-50/30 focus:ring-red-500/10'
                            : 'border-transparent bg-gray-100 focus:ring-primary/10 focus:border-primary'
                        }
                        ${className}
                    `}
                />

                {isPassword && (
                    <button
                        type="button"
                        tabIndex={-1}
                        className="absolute right-[14px] text-gray-500 hover:text-gray-700 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <EyeOff size={18} strokeWidth={2} />
                        ) : (
                            <Eye size={18} strokeWidth={2} />
                        )}
                    </button>
                )}
            </div>

            {displayError && (
                <p className="text-xs text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
                    {displayError}
                </p>
            )}
        </div>
    )
}
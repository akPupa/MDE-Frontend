import { Mail, Lock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useFormik, FormikProvider } from 'formik'
import * as Yup from 'yup'
import InputFields from '../Common/InputFields'

interface LoginFormProps {
  onSubmit: (email: string, rememberMe: boolean) => void
  isLoading: boolean
}

export default function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Please enter a valid email id')
      .max(50, 'Email id must be 50 characters or less')
      .required('Email id is required'),

  })

  const formik = useFormik({
    initialValues: {
      email: '',
      rememberMe: false,
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values.email, values.rememberMe)
    },
  })

  return (
    <FormikProvider value={formik}>
      <form className="flex flex-col gap-5" onSubmit={formik.handleSubmit}>
        {/* Email Field */}
        <InputFields
          name="email"
          label="EMAIL ADDRESS"
          type="email"
          icon={Mail}
          placeholder="dr.smith@medicalcenter.com"
          autoComplete="email"
          maxLength={50}
        />

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-4">
          {isLoading ? (
            <button
              type="button"
              className="w-full px-6 py-[14px] rounded-full bg-gray-100 text-gray-500 text-[16px] font-bold flex items-center justify-center gap-3 border-none cursor-not-allowed"
              disabled
            >
              <div className="w-5 h-5 border-[2.5px] border-gray-300 border-t-gray-500 rounded-full animate-spin" />
              Sending OTP...
            </button>
          ) : (
            <button
              type="submit"
              className="w-full px-6 py-[14px] border-none rounded-full bg-primary-deep text-white text-[16px] font-bold flex items-center justify-center gap-2 shadow-sm transition-all hover:brightness-95 active:scale-[0.98]"
            >
              Login with OTP
              <ArrowRight size={20} strokeWidth={2.5} className="ml-1" />
            </button>
          )}
        </div>
      </form>
    </FormikProvider>
  )
}


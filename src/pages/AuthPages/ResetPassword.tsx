import { ChevronLeft, ShieldCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik, FormikProvider } from 'formik'
import * as Yup from 'yup'
import AuthLayout from '../../components/AuthLayout/AuthLayout'
import InputFields from '../../components/Common/InputFields'

export default function ResetPassword() {
  const navigate = useNavigate()

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords do not match')
      .required('Please confirm your password'),
  })

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: (_values) => {
      navigate('/password-updated')
    },
  })

  return (
    <AuthLayout>
      <FormikProvider value={formik}>
        <div className="w-full max-w-[480px] bg-white rounded-xl p-[40px_48px] shadow-[0_12px_32px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.02)] flex flex-col items-center text-center border border-black/5 mb-6 max-sm:p-[32px_24px]">
          <h1 className="text-[28px] font-bold text-gray-900 mb-3 tracking-tight">Reset Password</h1>
          <p className="text-[15px] text-gray-600 leading-relaxed mb-8 max-w-[330px]">
            Please enter your new password to regain access to your provider account.
          </p>

          <form className="w-full flex flex-col gap-5 text-left" onSubmit={formik.handleSubmit}>
            {/* New Password */}
            <InputFields
              name="password"
              label="NEW PASSWORD"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
            />

            {/* Confirm Password */}
            <InputFields
              name="confirmPassword"
              label="CONFIRM PASSWORD"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
            />


            <button 
              type="submit" 
              className="w-full px-6 py-[14px] border-none rounded-full bg-primary text-white text-base font-semibold flex items-center justify-center gap-2 shadow-sm transition-all hover:brightness-110 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:brightness-100"
            >
              UPDATE PASSWORD
            </button>
          </form>

          <Link to="/" className="flex items-center justify-center gap-1.5 text-primary font-semibold text-sm no-underline transition-opacity mt-6 hover:opacity-80">
              <ChevronLeft size={16} strokeWidth={2.5} />
            Back to Secure Login
          </Link>
        </div>
      </FormikProvider>
      
      <div className="w-12 h-12 rounded-md bg-gray-200 text-gray-400 flex items-center justify-center">
        <ShieldCheck size={24} strokeWidth={1.5} />
      </div>
    </AuthLayout>
  )
}

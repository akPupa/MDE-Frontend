import { MailCheck, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import AuthLayout from '../../components/AuthLayout/AuthLayout'

export default function CheckEmail() {
  return (
    <AuthLayout>
      <div className="w-full max-w-[480px] bg-white rounded-xl p-12 shadow-[0_12px_32px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.02)] flex flex-col items-center text-center border border-black/5 mb-6 max-sm:p-8 pb-8">
        <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center mb-6">
          <MailCheck size={28} stroke="#fff" strokeWidth={2} />
        </div>

        <h1 className="text-[28px] font-bold text-gray-900 mb-3 tracking-tight">Check Your Email</h1>
        <p className="text-[15px] text-gray-600 leading-relaxed mb-8 max-w-[330px]">
          We've sent a password reset link to your email address. Please follow the instructions there to set a new password.
        </p>

        {/* Instead of a button, linking to the reset page for presentation purposes */}
        <Link to="/" className="w-full px-6 py-[14px] border-none rounded-full bg-primary text-white text-base font-semibold flex items-center justify-center gap-2 shadow-sm transition-all hover:brightness-110 hover:-translate-y-0.5 mt-2 mb-6">
          Return to Login
        </Link>
        
        <div className="mt-4 pt-6 border-t border-gray-100 w-full">
          <p className="text-sm text-gray-500">
            Didn't receive the email? <button className="bg-transparent border-none text-primary font-semibold text-sm cursor-pointer p-0 hover:underline">Resend link</button>
          </p>
        </div>
        
        <div className="mt-12 flex items-center justify-center gap-1.5 text-[10px] font-bold text-gray-400 tracking-[0.5px] uppercase">
          <ShieldCheck size={12} stroke="currentColor" strokeWidth={2} />
          ENTERPRISE SECURE SHELL
        </div>
      </div>
    </AuthLayout>
  )
}


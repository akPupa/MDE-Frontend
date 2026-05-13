import { Check, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import AuthLayout from '../../components/AuthLayout/AuthLayout'

export default function PasswordUpdated() {
  return (
    <AuthLayout>
      <div className="w-full max-w-[480px] bg-white rounded-xl p-12 shadow-[0_12px_32px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.02)] flex flex-col items-center text-center border border-black/5 mb-6 max-sm:p-8 pb-6">
        <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center mb-6">
          <Check size={32} stroke="#fff" strokeWidth={3} />
        </div>

        <h1 className="text-[28px] font-bold text-gray-900 mb-3 tracking-tight leading-[1.2]">Password Updated<br />Successfully</h1>
        <p className="text-[15px] text-gray-600 leading-relaxed mb-8 max-w-[330px]">
          Your password has been reset. You can now log in with your new credentials.
        </p>

        <Link to="/" className="w-full px-6 py-[14px] border-none rounded-full bg-primary text-white text-base font-semibold flex items-center justify-center gap-2 shadow-sm transition-all hover:brightness-110 hover:-translate-y-0.5 mt-2 mb-2">
          Return to Login
        </Link>
        
        <div className="mt-4 w-full">
          <p className="text-[11px] text-gray-400 font-semibold tracking-[0.8px] uppercase">
            NEED HELP? <a href="#" className="text-primary no-underline font-bold ml-1 transition-opacity hover:opacity-80">CONTACT SUPPORT</a>
          </p>
        </div>
      </div>
      
      {/* Decorative shield icon at bottom mimicking UI frame */}
      <div className="w-12 h-12 rounded-md bg-gray-300 text-gray-400 flex items-center justify-center -mt-6 opacity-80">
        <ShieldCheck size={24} stroke="currentColor" strokeWidth={1.5} />
      </div>
    </AuthLayout>
  )
}


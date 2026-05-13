import { ShieldCheck, ChevronLeft, RefreshCcw } from 'lucide-react'
import { useState, useRef, useEffect, type KeyboardEvent, type ClipboardEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/AuthLayout/AuthLayout'
import { showToast, dismissToasts } from '@utils/toast'
import { useAuthStore } from '@stores/authStore'
import { requestOtp, verifyOtp } from '@api/auth'

const OTP_LENGTH = 6

export default function VerifyOtp() {
  const navigate = useNavigate()
  const { setAuth, tempEmail } = useAuthStore()
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) {
      setCanResend(true)
      return
    }
    const interval = setInterval(() => {
      setResendTimer((t) => t - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [resendTimer])

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus()
  }

  const handleChange = (index: number, value: string) => {
    // Only allow single digit
    const digit = value.replace(/\D/g, '').slice(-1)
    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)

    // Auto-advance to next
    if (digit && index < OTP_LENGTH - 1) {
      focusInput(index + 1)
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const newOtp = [...otp]
      if (otp[index]) {
        newOtp[index] = ''
        setOtp(newOtp)
      } else if (index > 0) {
        newOtp[index - 1] = ''
        setOtp(newOtp)
        focusInput(index - 1)
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusInput(index - 1)
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      focusInput(index + 1)
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    const newOtp = [...otp]
    pasted.split('').forEach((char, i) => {
      if (i < OTP_LENGTH) newOtp[i] = char
    })
    setOtp(newOtp)
    // Focus last filled or last box
    const lastIndex = Math.min(pasted.length, OTP_LENGTH - 1)
    focusInput(lastIndex)
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) return;

    dismissToasts();

    const code = otp.join("");
    const email = tempEmail
    if (code.length < OTP_LENGTH) {
      showToast("Please enter all 6 digits", "error");
      return;
    }

    if (!email) {
      showToast("Email missing. Please login again.", "error");
      return;
    }

    setIsLoading(true);

    try {
      const res = await verifyOtp({ email, code });

      // ✅ destructure backend response
      const { token, user } = res;

      // ✅ store in zustand (recommended way)
      setAuth(token, user);

      showToast("OTP verified successfully!", "success");
      navigate("/");

    } catch (err: any) {
      dismissToasts();
      const message =
        err?.message || "Invalid OTP. Please try again.";

      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || !tempEmail) return
    try {
      await requestOtp({ email: tempEmail });
    } catch (error) {

    }
    setCanResend(false)
    setResendTimer(30)
    setOtp(Array(OTP_LENGTH).fill(''))
    focusInput(0)
    await new Promise((resolve) => setTimeout(resolve, 800))
    showToast('OTP resent successfully', 'success')
  }

  const isComplete = otp.every((d) => d !== '')

  return (
    <AuthLayout>
      <div className="w-full max-w-[480px] bg-white rounded-2xl p-10 shadow-[0_16px_48px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)] flex flex-col items-center text-center border border-black/[0.06] mb-6 max-sm:p-8">

        {/* Icon badge */}
        <div className="relative mb-7">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
            <ShieldCheck size={36} strokeWidth={1.8} className="text-primary" />
          </div>
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">6</span>
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-[26px] font-bold text-gray-900 mb-2 tracking-tight">
          Enter Verification Code
        </h1>
        <p className="text-[14px] text-gray-500 leading-relaxed mb-8 max-w-[320px]">
          We sent a 6-digit OTP to your email address. Enter it below to continue.
        </p>

        <form className="w-full flex flex-col items-center gap-6" onSubmit={handleVerify}>

          {/* OTP Input Boxes */}
          <div className="flex items-center justify-center gap-3 w-full">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                autoFocus={index === 0}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                onFocus={(e) => e.target.select()}
                className={[
                  'w-12 h-14 rounded-xl text-center text-[22px] font-bold outline-none transition-all duration-200',
                  'border-2 bg-gray-50',
                  digit
                    ? 'border-primary bg-primary/5 text-primary shadow-[0_0_0_4px_rgba(2,145,133,0.08)]'
                    : 'border-gray-200 text-gray-900 focus:border-primary focus:bg-white focus:shadow-[0_0_0_4px_rgba(2,145,133,0.08)]',
                ].join(' ')}
              />
            ))}
          </div>

          {/* Progress dots */}
          <div className="flex gap-1.5">
            {otp.map((digit, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${digit ? 'w-5 bg-primary' : 'w-2 bg-gray-200'
                  }`}
              />
            ))}
          </div>

          {/* Verify Button */}
          {isLoading ? (
            <button
              type="button"
              disabled
              className="w-full px-6 py-[14px] rounded-full bg-gray-100 text-gray-400 text-[16px] font-bold flex items-center justify-center gap-3 border-none cursor-not-allowed"
            >
              <div className="w-5 h-5 border-[2.5px] border-gray-300 border-t-gray-400 rounded-full animate-spin" />
              Verifying...
            </button>
          ) : (
            <button
              type="submit"
              disabled={!isComplete}
              className={[
                'w-full px-6 py-[14px] border-none rounded-full text-[16px] font-bold flex items-center justify-center gap-2 transition-all duration-200',
                isComplete
                  ? 'bg-primary text-white shadow-[0_4px_16px_rgba(2,145,133,0.3)] hover:brightness-105 hover:-translate-y-0.5 active:scale-[0.98]'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed',
              ].join(' ')}
            >
              <ShieldCheck size={18} strokeWidth={2.5} />
              Verify OTP
            </button>
          )}
        </form>

        {/* Resend Section */}
        <div className="mt-6 flex flex-col items-center gap-2">
          {canResend ? (
            <button
              onClick={handleResend}
              className="flex items-center gap-1.5 text-primary font-semibold text-[14px] bg-transparent border-none cursor-pointer hover:opacity-75 transition-opacity"
            >
              <RefreshCcw size={14} strokeWidth={2.5} />
              Resend OTP
            </button>
          ) : (
            <p className="text-[13px] text-gray-400 font-medium">
              Resend OTP in{' '}
              <span className="text-primary font-bold tabular-nums">
                0:{String(resendTimer).padStart(2, '0')}
              </span>
            </p>
          )}
        </div>

        {/* Back link */}
        <Link
          to="/login"
          className="flex items-center justify-center gap-1.5 text-gray-400 font-semibold text-[13px] no-underline transition-colors mt-5 hover:text-gray-600"
        >
          <ChevronLeft size={15} strokeWidth={2.5} />
          Back to Login
        </Link>
      </div>

      <p className="text-[13px] text-gray-500 text-center">
        By continuing, you agree to MDE Automation's{' '}
        <a href="#" className="text-primary no-underline hover:underline">Security Protocols</a>{' '}
        and{' '}
        <a href="#" className="text-primary no-underline hover:underline">Privacy Policy</a>.
      </p>
    </AuthLayout>
  )
}

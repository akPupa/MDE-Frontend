import { useState } from "react";
import { useNavigate } from "react-router-dom";
import doctorHero from '../../assets/doctor-hero.png'

import LoginForm from "../../components/AuthLayout/LoginForm";
import ErrorAlert from "../../components/ErrorAlert/ErrorAlert";
import { HelpCircle } from 'lucide-react';
import { showToast } from "@utils/toast";
import { useAuthStore } from "@stores/authStore";
import { requestOtp } from "@api/auth";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setTempEmail } = useAuthStore();

  const handleLogin = async (email: string, _remember: boolean) => {
    setError(null);
    setIsLoading(true);

    try {
      await requestOtp({ email });

      setTempEmail(email);
      showToast("OTP sent successfully", "success");
      navigate("/verify-otp");
    } catch (err: any) {
      console.log(err);

      const message =
        err?.message || "Failed to send OTP. Please try again.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex max-lg:flex-col bg-white">
      <div className="relative w-1/2 min-h-screen overflow-hidden flex flex-col max-lg:w-full max-lg:min-h-[40vh]">
        <img
          src={doctorHero}
          alt="Medical professional"
          className="absolute inset-0 w-full h-full object-cover object-[center_top] z-0"
        />
        <div className="absolute inset-0 bg-hero-gradient z-[1]" />
        <div className="relative z-[2] flex flex-col justify-center flex-1 px-14 py-15 text-white max-lg:px-8 max-lg:py-10 max-sm:px-6 max-sm:py-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-lg bg-white/15 backdrop-blur-md flex items-center justify-center text-white shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5H2v7l6.29 6.29c.94.94 2.48.94 3.42 0l3.58-3.58c.94-.94.94-2.48 0-3.42L9 5Z" />
                <path d="M6 9.01V9" />
                <path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19" />
              </svg>
            </div>
            <div className="h-[3px] w-16 bg-gradient-to-r from-primary to-transparent rounded-[2px]" />
          </div>

          <h1 className="text-[44px] font-extrabold leading-[1.15] tracking-[-1.5px] text-white mb-5 max-lg:text-[32px] max-sm:text-[26px]">
            Transforming Medical<br />
            Data into Clarity.
          </h1>
          <p className="text-base leading-[1.7] text-white/78 max-w-[420px] mb-12 max-lg:text-sm max-lg:mb-8">
            Securely manage cases and automate MDE reports
            with high-precision clinical intelligence. Designed
            for the modern provider.
          </p>

          <div className="flex gap-3 max-sm:flex-col">
            <div className="flex flex-col gap-3 px-7 py-5 rounded-lg bg-white/10 backdrop-blur-xl border border-white/12 min-w-[160px] transition-all hover:bg-white/16 hover:-translate-y-0.5 max-sm:min-w-0 max-sm:flex-row max-sm:items-center max-sm:px-[18px] max-sm:py-[14px]">
              <div className="w-9 h-9 rounded-md bg-white/85 flex items-center justify-center text-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <span className="text-[13px] font-semibold tracking-[0.3px] text-white/92">HIPAA Compliant</span>
            </div>
            <div className="flex flex-col gap-3 px-7 py-5 rounded-lg bg-white/10 backdrop-blur-xl border border-white/12 min-w-[160px] transition-all hover:bg-white/16 hover:-translate-y-0.5 max-sm:min-w-0 max-sm:flex-row max-sm:items-center max-sm:px-[18px] max-sm:py-[14px]">
              <div className="w-9 h-9 rounded-md bg-white/85 flex items-center justify-center text-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <span className="text-[13px] font-semibold tracking-[0.3px] text-white/92">Real-time Analysis</span>
            </div>
          </div>
        </div>

        {/* Decorative circle */}
        <div className="absolute bottom-20 -right-10 w-[180px] h-[180px] rounded-full border border-white/10 z-[2] max-lg:hidden" />
      </div>

      <main className="w-1/2 flex flex-col items-center justify-start lg:justify-center p-8 bg-white max-lg:w-full max-sm:p-6 overflow-y-auto ">
        <div className="w-full max-w-[440px] flex flex-col">
          <div className="mb-5 text-left">
            <h2 className="text-[16px] font-bold text-primary-deep tracking-tight mb-8 thick-underline">
              MDE Automation Platform
            </h2>
            <h1 className="text-[28px] lg:text-[32px] font-bold text-gray-900 mb-2  tracking-[-0.5px]">
              Login
            </h1>
            <p className="text-[14px] lg:text-[15px] text-gray-500 font-medium">
              Access your cases and generate MDE reports
            </p>
          </div>

          <ErrorAlert message={error || ''} />

          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />

          <footer className=" pt-8 text-center w-full">
            <p className="text-[14px] text-gray-600 font-medium mb-6">
              Don't have an account? <a href="#" className="text-primary-deep font-bold hover:underline">Contact Administrator</a>
            </p>
            <div className="flex items-center justify-center gap-6 border-t pt-6 border-gray-100  flex-wrap">
              <a href="#" className="text-[10px] text-gray-400 font-bold tracking-[0.8px] uppercase hover:text-gray-600 transition-colors">Privacy Policy</a>
              <a href="#" className="text-[10px] text-gray-400 font-bold tracking-[0.8px] uppercase hover:text-gray-600 transition-colors">HIPAA Compliance</a>
              <a href="#" className="text-[10px] text-gray-400 font-bold tracking-[0.8px] uppercase hover:text-gray-600 transition-colors">Support</a>
            </div>
          </footer>
        </div>
      </main>

      <button className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-white text-primary-deep border border-gray-100 flex items-center justify-center shadow-[0_12px_24px_rgba(0,0,0,0.1)] cursor-pointer z-[100] transition-all hover:shadow-lg hover:-translate-y-1 active:scale-95" aria-label="Help">
        <HelpCircle size={24} strokeWidth={2.5} />
      </button>
    </div>
  );
}

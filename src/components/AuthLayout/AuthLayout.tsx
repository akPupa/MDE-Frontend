import { Settings, HelpCircle } from 'lucide-react'
import type { ReactNode } from 'react'


interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral relative overflow-hidden bg-[radial-gradient(circle_at_center_20%,rgba(2,145,133,0.03)_0%,transparent_70%)]">
      {/* ─── Top Navbar ─── */}
      <nav className="flex items-center justify-between px-10 py-6 w-full">
        <div className="flex items-center gap-2.5 text-primary">
          <Settings className="w-6 h-6" size={24} strokeWidth={2.5} />
          <span className="text-[18px] font-bold tracking-[-0.3px] text-primary">MDE Automation</span>
        </div>
        <button className="bg-transparent border-none text-gray-500 cursor-pointer flex items-center justify-center transition-colors hover:text-gray-700" aria-label="Help">
          <HelpCircle className="fill-gray-400 stroke-white" size={24} strokeWidth={2} />
        </button>
      </nav>

      {/* ─── Main Content ─── */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 py-10 z-10">
        {children}
      </main>

      {/* ─── Footer ─── */}
      <footer className="flex items-center justify-between px-10 py-8 text-gray-400 text-[13px] font-medium max-sm:flex-col max-sm:gap-4 max-sm:py-6 max-sm:text-center">
        <div className="footer-left">
          © 2024 MDE Automation Platform. All rights reserved.
        </div>
        <div className="flex gap-6">
          <a href="#" className="text-gray-400 no-underline transition-colors hover:text-gray-600">Privacy Policy</a>
          <a href="#" className="text-gray-400 no-underline transition-colors hover:text-gray-600">Terms of Service</a>
          <a href="#" className="text-gray-400 no-underline transition-colors hover:text-gray-600">Support</a>
        </div>
      </footer>
    </div>
  )
}


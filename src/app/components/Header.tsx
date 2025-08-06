import Image from "next/image";

export default function Header() {
  return (
    <header className="z-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <Image
            src="/assets/logo.svg"
            alt="Sign in with Ethereum"
            width={300}
            height={100}
            className="w-32 h-auto"
          />

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="https://docs.login.xyz/"
              className="text-gray-400 hover:text-white transition-colors font-medium"
            >
              Learn more
            </a>
            <a
              href="https://docs.login.xyz/"
              className="text-gray-400 hover:text-white transition-colors font-medium"
            >
              Docs
            </a>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
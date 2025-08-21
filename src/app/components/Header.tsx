import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="z-20 relative">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/assets/logo.svg"
              alt="Sign in with Ethereum"
              width={300}
              height={100}
              className="w-24 sm:w-32 h-auto"
            />
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-6 sm:space-x-8 pr-1">
            <a
              href="https://eips.ethereum.org/EIPS/eip-4361"
              target="_blank"
              className="text-gray-400 sm:inline hidden hover:text-white transition-colors font-medium"
            >
              EIP-4361
            </a>
            <Link
              href="/ecosystem"
              className="text-gray-400 hover:text-white transition-colors font-medium"
            >
              Ecosystem
            </Link>
            <a
              href="https://docs.siwe.xyz/"
              target="_blank"
              className="text-gray-400 hover:text-white transition-colors font-medium"
            >
              Docs
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

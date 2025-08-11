import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 py-10 relative overflow-hidden bg-background shadow-footer z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-8 sm:space-y-0">
          {/* Logo and branding */}
          <div className="flex flex-col gap-5">
            <Image
              src="/assets/logo.svg"
              alt="Sign in with Ethereum"
              width={24}
              height={24}
              className="w-32 h-auto"
            />
            <div className="flex flex-row gap-2">
              <Image
                src="/assets/eif-logo.svg"
                alt="Ethereum Identity Foundation"
                width={100}
                height={100}
                className="w-8 h-auto"
              />
              <p className="text-gray-400 text-sm leading-tight">
                A project of the <br />
                <u>Ethereum Identity Foundation</u>
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8">
            <div>
              <h4 className="text-white font-medium mb-3">Developers</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://github.com/signinwithethereum"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.login.xyz/"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3">Contact</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="mailto:contact@ethfollow.xyz"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    contact@ethfollow.xyz
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

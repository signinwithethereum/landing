import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 py-10 text-center sm:text-start relative overflow-hidden bg-background shadow-footer z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-10">
          {/* Logo and branding */}
          <div className="flex flex-col gap-5 justify-center items-center sm:items-start">
            <Image
              src="/assets/logo.svg"
              alt="Sign in with Ethereum"
              width={24}
              height={24}
              className="w-32 h-auto"
            />
            <div className="flex flex-row gap-2 mt-6 sm:mt-0">
              <Image
                src="/assets/eif-logo.svg"
                alt="Ethereum Identity Foundation"
                width={100}
                height={100}
                className="w-8 h-auto"
              />
              <p className="text-gray-400 text-start text-sm leading-tight">
                A project of the <br />
                <a
                  href="https://ethid.org/"
                  target="_blank"
                  className="text-gray-400 hover:text-white transition-colors underline"
                >
                  Ethereum Identity Foundation
                </a>
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
            <div>
              <h4 className="text-white font-medium mb-3">Developers</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://github.com/signinwithethereum"
                    target="_blank"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.siwe.xyz/"
                    target="_blank"
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
                    href="mailto:contact@siwe.xyz"
                    target="_blank"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    contact@siwe.xyz
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

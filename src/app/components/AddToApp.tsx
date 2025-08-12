import Image from "next/image";

export default function AddToApp() {
  return (
    <section className="py-12 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold text-white">
            Add it to your app
          </h2>
        </div>

        <div className="grid gap-6 max-w-lg mx-auto">
          {/* Featured EIK Card */}
          <a href="https://ethidentitykit.com" target="_blank" className="border-2 border-accent rounded-lg py-4 sm:py-6 px-6 sm:px-8 hover:bg-accent/40 transition-colors cursor-pointer">
            <div className="flex items-center gap-4 sm:gap-6">
              <Image
                src="/assets/icons/eik-logo.svg"
                alt="EIK"
                width={24}
                height={24}
                className="w-16 h-16"
              />
              <div className="flex flex-col gap-0.5 sm:gap-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Ethereum Identity Kit
                </h3>
                <p className="text-gray-400 text-sm sm:text-base">
                  Add a <b>SIWE</b> button with our component library
                </p>
              </div>
            </div>
          </a>

          {/* Language Options */}
          <div className="grid grid-cols-2 gap-6">
            <a href="https://docs.siwe.xyz/languages/typescript" target="_blank" className="border-2 border-accent flex items-center justify-center rounded-lg px-4 sm:px-8 py-4 sm:py-5 transition-colors gap-3 sm:gap-4 hover:bg-accent/40 cursor-pointer">
              <Image
                src="/assets/icons/Typescript.svg"
                alt="TypeScript"
                width={24}
                height={24}
                className="w-9 h-9 sm:w-12 sm:h-12 rounded-sm"
              />
              <span className="text-white font-semibold text-base sm:text-xl">
                TypeScript
              </span>
            </a>
            <a href="https://docs.siwe.xyz/languages/python" target="_blank" className=" border-2 border-accent flex items-center justify-center rounded-lg px-4 sm:px-8 py-4 sm:py-5 transition-colors gap-3 sm:gap-4 hover:bg-accent/40 cursor-pointer">
              <Image
                src="/assets/icons/python.svg"
                alt="Python"
                width={24}
                height={24}
                className="w-9 h-9 sm:w-12 sm:h-12 rounded-sm"
              />
              <span className="text-white font-semibold text-lg sm:text-xl">
                Python
              </span>
            </a>
            <a href="https://docs.siwe.xyz/languages/rust" target="_blank" className="border-2 border-accent flex items-center justify-center rounded-lg px-4 sm:px-8 py-4 sm:py-5 transition-colors gap-3 sm:gap-4 hover:bg-accent/40 cursor-pointer">
              <Image
                src="/assets/icons/rust.svg"
                alt="Python"
                width={24}
                height={24}
                className="w-9 h-9 sm:w-12 sm:h-12 rounded-sm"
              />
              <span className="text-white font-semibold text-lg sm:text-xl">
                Rust
              </span>
            </a>
            <a href="https://docs.siwe.xyz/languages/ruby" target="_blank" className=" border-2 border-accent flex items-center justify-center rounded-lg px-4 sm:px-8 py-4 sm:py-5 transition-colors gap-3 sm:gap-4 hover:bg-accent/40 cursor-pointer">
              <Image
                src="/assets/icons/ruby.svg"
                alt="Python"
                width={24}
                height={24}
                className="w-9 h-9 sm:w-12 sm:h-12 rounded-sm"
              />
              <span className="text-white font-semibold text-lg sm:text-xl">
                Ruby
              </span>
            </a>
          </div>

          {/* View all docs link */}
          <div className="text-center">
            <a
              href="https://docs.siwe.xyz/languages/"
              target="_blank"
              className="inline-block text-accent hover:text-white transition-colors font-medium group"
            >
              View all docs{" "}
              <span className="inline-block group-hover:translate-x-1 transition-transform">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

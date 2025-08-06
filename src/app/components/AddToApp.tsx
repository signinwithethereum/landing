import Image from "next/image";

export default function AddToApp() {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white">
            Add it to your app
          </h2>
        </div>

        <div className="grid gap-6 max-w-lg mx-auto">
          {/* Featured EIK Card */}
          <div className="border-2 border-accent rounded-lg py-6 px-8 hover:bg-accent/40 transition-colors cursor-pointer">
            <div className="flex items-center gap-6">
              <Image
                src="/assets/icons/eik-logo.svg"
                alt="EIK"
                width={24}
                height={24}
                className="w-16 h-16"
              />
              <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-bold text-white">
                  Ethereum Identity Kit
                </h3>
                <p className="text-gray-400">
                  Add a <b>SIWE</b> button with our component library
                </p>
              </div>
            </div>
          </div>

          {/* Language Options */}
          <div className="grid grid-cols-2 gap-6">
            <div className="border-2 border-accent flex items-center justify-center rounded-lg px-8 py-5 transition-colors gap-4 hover:bg-accent/40 cursor-pointer">
              <Image
                src="/assets/icons/Typescript.svg"
                alt="TypeScript"
                width={24}
                height={24}
                className="w-12 h-12 rounded-sm"
              />
              <span className="text-white font-semibold text-xl">TypeScript</span>
            </div>
            <div className=" border-2 border-accent flex items-center justify-center rounded-lg px-8 py-5 transition-colors gap-4 hover:bg-accent/40 cursor-pointer">
              <Image
                src="/assets/icons/python.svg"
                alt="Python"
                width={24}
                height={24}
                className="w-12 h-12 rounded-sm"
              />
              <span className="text-white font-semibold text-xl">Python</span>
            </div>
            <div className="border-2 border-accent flex items-center justify-center rounded-lg p-4 transition-colors gap-4 hover:bg-accent/40 cursor-pointer">
              <Image
                src="/assets/icons/rust.svg"
                alt="Python"
                width={24}
                height={24}
                className="w-12 h-12 rounded-sm"
              />
              <span className="text-white font-semibold text-xl">Rust</span>
            </div>
            <div className=" border-2 border-accent flex items-center justify-center rounded-lg p-4 transition-colors gap-4 hover:bg-accent/40 cursor-pointer">
              <Image
                src="/assets/icons/ruby.svg"
                alt="Python"
                width={24}
                height={24}
                className="w-12 h-12 rounded-sm"
              />
              <span className="text-white font-semibold text-xl">Ruby</span>
            </div>
          </div>

          {/* View all docs link */}
          <div className="text-center">
            <a
              href="#"
              className="inline-block text-accent hover:text-white transition-colors font-medium group"
            >
              View all docs <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
import Image from "next/image";

export default function KeyFeatures() {
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto w-fit px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row gap-52 items-center">
          {/* Left side - Ethereum logo with key */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Ethereum diamond logo */}
              <div className="relative">
                <Image
                  src="/assets/key.svg"
                  alt="Ethereum with Key"
                  width={200}
                  height={400}
                  className="w-auto min-h-96"
                />
                {/* Connecting lines to features */}
                <div className="absolute left-24 top-0">
                  <Image
                    src="/assets/key-lines.svg"
                    alt="Connection lines"
                    width={300}
                    height={400}
                    className="h-auto min-w-60"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Features list */}
          <div className="flex flex-col gap-[92px] pt-5">
            <div className="flex items-start space-x-4">
              <div className="flex pt-2 items-center justify-center">
                <Image
                  src="/assets/icons/person.svg"
                  alt="Person"
                  width={40}
                  height={40}
                  className="w-8 h-auto"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-bold text-white mb-1">
                  Enrich your app&apos;s UX
                  <br />
                  with onchain data
                </h3>
                <p className="text-accent flex items-center gap-1 group cursor-pointer hover:text-white transition-colors">
                  Learn more
                  <span className="inline-block group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex pt-2 items-center justify-center">
                <Image
                  src="/assets/icons/authentication.svg"
                  alt="Authentication"
                  width={40}
                  height={40}
                  className="w-8 h-auto"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-bold text-white mb-1">
                  Works with crypto
                  <br />
                  and non-crypto apps
                </h3>
                <p className="text-accent flex items-center gap-1 group cursor-pointer hover:text-white transition-colors">
                  Learn more
                  <span className="inline-block group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex pt-1 items-center justify-center">
                <Image
                  src="/assets/icons/component.svg"
                  alt="Person"
                  width={40}
                  height={40}
                  className="w-8 h-auto"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-bold text-white mb-1">
                  Easily integrate
                  <br />
                  with libraries
                </h3>
                <p className="text-accent flex items-center gap-1 group cursor-pointer hover:text-white transition-colors">
                  Learn more
                  <span className="inline-block group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";

export default function EthereumIdentityStack() {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-medium text-gray-400 mb-2">
            Part of the
          </h2>
          <h3 className="text-5xl font-bold text-white mb-4">
            Ethereum identity stack
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            <strong>SIWE</strong> is complementary with{" "}
            <strong>ENS</strong>,{" "}
            <strong>EFP</strong> and other Ethereum
            identity primitives.
          </p>
          <a
            href="#"
            className="inline-block mt-4 text-accent hover:text-white transition-colors font-medium group"
          >
            Learn more{" "}
            <span className="inline-block group-hover:translate-x-1 transition-transform">
              →
            </span>
          </a>
        </div>

        <div className="gap-8 flex flex-wrap items-center justify-center mx-auto">
          {/* ENS Card */}
          <div className="bg-background cursor-pointer hover:-translate-y-2 hover:bg-[#11292E] rounded-xl w-[360px] h-[200px] p-8 transition-all flex flex-col items-center justify-center gap-6 shadow-accent">
            <Image
              src="/assets/ens-logo.svg"
              alt="ENS Logo"
              width={200}
              height={90}
              className="w-auto h-16"
            />
            <p className="text-gray-200 text-center text-lg font-medium">
              On-chain usernames and profiles
            </p>
          </div>

          {/* EFP Card */}
          <div className="bg-background cursor-pointer hover:-translate-y-2 hover:bg-[#11292E] rounded-xl w-[360px] h-[200px] p-8 transition-all flex flex-col items-center justify-center gap-6 shadow-accent">
            <Image
              src="/assets/efp-logo.svg"
              alt="EFP Logo"
              width={200}
              height={90}
              className="w-auto h-16"
            />
            <p className="text-gray-200 text-center text-lg font-medium">
              On-chain social graph for Ethereum accounts
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

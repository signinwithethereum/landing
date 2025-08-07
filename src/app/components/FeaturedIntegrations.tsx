import Image from "next/image";

const wallets = [
  { name: "MetaMask", logo: "metamask.svg" },
  { name: "Rainbow", logo: "rainbow.png" },
  { name: "Frame", logo: "frame.png" },
  { name: "WalletConnect", logo: "walletconnect.png" },
  { name: "Dynamic", logo: "dynamic.png" },
  { name: "Gnosis", logo: "gnosis.png" },
  { name: "taho", logo: "taho.png" },
];

const apps = [
  { name: "Snapshot", logo: "snapshot.png" },
  { name: "Tally", logo: "tally.png" },
  { name: "Superfluid", logo: "superfluid.png" },
  { name: "1inch", logo: "1inch.png" },
  { name: "Ceramic", logo: "ceramic.png" },
  { name: "galaxe", logo: "galaxe.svg" },
  { name: "oncyber", logo: "oncyber.png" },
  { name: "radicle", logo: "radicle.png" },
  { name: "unlock protocol", logo: "unlock-protocol.svg" },
  { name: "yup", logo: "yup.svg" },
];

export default function FeaturedIntegrations() {
  return (
    <section className="py-24">
      <div className="">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Featured Integrations
          </h2>
        </div>

        {/* Wallets Section */}
        <div className="mb-20">
          <h3 className="text-2xl font-semibold text-white text-center mb-8">
            Wallets
          </h3>
          <div className="gradient-overlay-horizontal overflow-visible">
            <div className="animate-infinite-scroll-left flex whitespace-nowrap px-80">
              {/* Original list */}
              <div className="flex gap-20 min-w-max">
                {wallets.map((wallet, index) => (
                  <div
                    key={`wallet-original-${index}`}
                    className="flex-shrink-0"
                  >
                    <Image
                      unoptimized
                      src={`/assets/integrations/wallets/${wallet.logo}`}
                      alt={wallet.name}
                      width={80}
                      height={80}
                      className="w-auto h-20 max-w-[230px] object-contain"
                    />
                  </div>
                ))}
              </div>
              {/* Duplicate list for seamless loop */}
              <div className="flex gap-20 min-w-max ml-20">
                {wallets.map((wallet, index) => (
                  <div
                    key={`wallet-duplicate-${index}`}
                    className="flex-shrink-0"
                  >
                    <Image
                      src={`/assets/integrations/wallets/${wallet.logo}`}
                      alt={wallet.name}
                      width={80}
                      height={80}
                      className="w-auto h-20 max-w-[230px] object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Apps Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-white text-center mb-8">
            Apps
          </h3>
          <div className="gradient-overlay-horizontal">
            <div className="animate-infinite-scroll-right flex whitespace-nowrap px-80">
              {/* Original list */}
              <div className="flex gap-20 min-w-max">
                {apps.map((app, index) => (
                  <div key={`app-original-${index}`} className="flex-shrink-0">
                    <Image
                      unoptimized
                      src={`/assets/integrations/apps/${app.logo}`}
                      alt={app.name}
                      width={80}
                      height={80}
                      className="w-auto h-20 max-w-[230px] object-contain"
                    />
                  </div>
                ))}
              </div>
              {/* Duplicate list for seamless loop */}
              <div className="flex gap-20 min-w-max ml-20">
                {apps.map((app, index) => (
                  <div key={`app-duplicate-${index}`} className="flex-shrink-0">
                    <Image
                      src={`/assets/integrations/apps/${app.logo}`}
                      alt={app.name}
                      width={80}
                      height={80}
                      className="w-auto h-20 max-w-[230px] object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

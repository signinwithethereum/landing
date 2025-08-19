import Image from "next/image";

const wallets = [
  { name: "MetaMask", logo: "metamask.svg", link: "https://metamask.io/" },
  { name: "Rainbow", logo: "rainbow.png", link: "https://rainbow.me/" },
  { name: "Frame", logo: "frame.png", link: "https://frame.sh/" },
  { name: "WalletConnect", logo: "walletconnect.png", link: "https://walletconnect.com/" },
  { name: "Dynamic", logo: "dynamic.png", link: "https://dynamic.xyz/" },
  { name: "Gnosis", logo: "gnosis.png", link: "https://safe.global/" },
  { name: "Taho", logo: "taho.svg", link: "https://taho.xyz/" },
];

const apps = [
  { name: "Snapshot", logo: "snapshot.png", link: "https://snapshot.org/" },
  { name: "Tally", logo: "tally.png", link: "https://tally.xyz/" },
  { name: "Superfluid", logo: "superfluid.png", link: "https://superfluid.finance/" },
  { name: "1inch", logo: "1inch.svg", link: "https://1inch.io/" },
  { name: "Ceramic", logo: "ceramic.png", link: "https://ceramic.network/" },
  { name: "Farcaster", logo: "farcaster.svg", link: "https://farcaster.xyz/" },
  { name: "Lens", logo: "lens.svg", link: "https://lens.xyz/" },
  { name: "Fileverse", logo: "fileverse.svg", link: "https://fileverse.io/" },
  { name: "galaxe", logo: "galaxe.svg", link: "https://galxe.xyz/" },
  { name: "oncyber", logo: "oncyber.png", link: "https://cyber.xyz/" },
  { name: "radicle", logo: "radicle.svg", link: "https://radicle.xyz/" },
  { name: "unlock protocol", logo: "unlock-protocol.svg", link: "https://unlock-protocol.com/" },
  { name: "yup", logo: "yup.svg", link: "https://yup.io/" },
];

export default function FeaturedIntegrations() {
  return (
    <section className="pb-12 max-w-[1560px] mx-auto sm:pb-24 pt-20 sm:pt-48 [background-image:linear-gradient(transparent,#222222,#222222,#222222)]">
      <div className="">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white sm:mb-4">
            Featured Integrations
          </h2>
        </div>

        {/* Wallets Section */}
        <div className="mb-10 sm:mb-20">
          <h3 className="text-2xl font-semibold text-white text-center mb-8">
            Wallets
          </h3>
          <div className="gradient-overlay-horizontal overflow-visible">
            <div className="animate-infinite-scroll-left flex whitespace-nowrap">
              {/* Original list */}
              <div className="flex gap-10 sm:gap-20">
                {wallets.map((wallet, index) => (
                  <a
                    href={wallet.link}
                    target="_blank"
                    key={`wallet-original-${index}`}
                    className="block flex-shrink-0 cursor-pointer hover:opacity-80"
                  >
                    <Image
                      unoptimized
                      src={`/assets/integrations/wallets/${wallet.logo}`}
                      alt={wallet.name}
                      width={80}
                      height={80}
                      className="w-auto h-14 sm:h-20 max-w-[250px] object-contain"
                    />
                  </a>
                ))}
              </div>
              {/* Duplicate list for seamless loop */}
              <div className="flex gap-10 sm:gap-20 ml-20">
                {wallets.map((wallet, index) => (
                  <a
                    href={wallet.link}
                    target="_blank"
                    key={`wallet-duplicate-${index}`}
                    className="block flex-shrink-0 cursor-pointer hover:opacity-80"
                  >
                    <Image
                      src={`/assets/integrations/wallets/${wallet.logo}`}
                      alt={wallet.name}
                      width={80}
                      height={80}
                      className="w-auto h-14 sm:h-20 max-w-[250px] object-contain"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Apps Section */}
        <div className="mb-0 sm:mb-12">
          <h3 className="text-2xl font-semibold text-white text-center mb-8">
            Apps
          </h3>
          <div className="gradient-overlay-horizontal">
            <div className="animate-infinite-scroll-right flex whitespace-nowrap">
              {/* Original list */}
              <div className="flex gap-10 sm:gap-20">
                {apps.map((app, index) => (
                  <a href={app.link} target="_blank" key={`app-original-${index}`} className="block flex-shrink-0 cursor-pointer hover:opacity-80">
                    <Image
                      unoptimized
                      src={`/assets/integrations/apps/${app.logo}`}
                      alt={app.name}
                      width={80}
                      height={80}
                      className="w-auto h-14 sm:h-20 max-w-[250px] object-contain"
                    />
                  </a>
                ))}
              </div>
              {/* Duplicate list for seamless loop */}
              <div className="flex gap-10 sm:gap-20 ml-20">
                {apps.map((app, index) => (
                  <a href={app.link} target="_blank" key={`app-duplicate-${index}`} className="block flex-shrink-0 cursor-pointer hover:opacity-80">
                    <Image
                      src={`/assets/integrations/apps/${app.logo}`}
                      alt={app.name}
                      width={80}
                      height={80}
                      className="w-auto h-14 sm:h-20 max-w-[250px] object-contain"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

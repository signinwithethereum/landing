import Image from "next/image";
import Link from "next/link";

const supportedBy = [
  {
    name: "Opensea",
    logo: "/assets/supported-by/opensea.svg",
    link: "https://opensea.io/",
  },
  {
    name: "Rainbow",
    logo: "/assets/supported-by/rainbow.svg",
    link: "https://rainbow.me/",
  },
  {
    name: "Metamask",
    logo: "/assets/supported-by/metamask.svg",
    link: "https://metamask.io/",
  },
  {
    name: "WalletConnect",
    logo: "/assets/supported-by/walletconnect.svg",
    link: "https://walletconnect.com/",
  },
  {
    name: "Snapshot",
    logo: "/assets/supported-by/snapshot.svg",
    link: "https://snapshot.org/",
  },
];

export default function FeaturedIntegrations() {
  return (
    <section className="sm:gap-4 gap-2 md:gap-8 flex flex-col items-center justify-center pb-12">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white sm:mb-4">Supported by</h2>
      </div>
      <div className="flex flex-nowrap items-center justify-center mx-auto gap-8 sm:gap-16 lg:gap-24 px-4 max-w-[440px] sm:max-w-[620px] md:max-w-none">
        {supportedBy.map((item, index) => (
          <a
            key={item.name}
            href={item.link}
            target="_blank"
            className="hover:opacity-80 transition-opacity"
          >
            <Image
              src={item.logo}
              alt={item.name}
              width={200}
              height={200}
              style={{
                width: 90 - (index > 2 ? 2 - (index % 2) : 2 - index) * 10,
                height: 100 - (index > 2 ? 2 - (index % 2) : 2 - index) * 10,
              }}
            />
          </a>
        ))}
      </div>
      <div className="text-center">
        <Link
          href="/ecosystem"
          className="inline-block text-accent hover:text-white transition-colors font-medium group"
        >
          Explore ecosystem&nbsp;
          <span className="inline-block group-hover:translate-x-1 transition-transform">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}

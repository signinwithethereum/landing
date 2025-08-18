import {
  Avatar,
  fetchAccount,
  HeaderImage,
  ProfileStats,
} from "ethereum-identity-kit";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

const steps = [
  {
    icon: "wallet.svg",
    title: "1. Connect your wallet",
    description: "You can use any wallet provider",
    mockup: {
      wallets: [
        { name: "MetaMask", icon: "assets/icons/wallets/metamask.svg", link: "https://metamask.io/" },
        {
          name: "WalletConnect",
          icon: "assets/icons/wallets/walletconnect.png",
          link: "https://walletconnect.com/"
        },
        { name: "Rainbow Wallet", icon: "assets/icons/wallets/rainbow.png", link: "https://rainbow.me/" },
        { name: "Base App", icon: "assets/icons/wallets/baseapp.jpg", link: "https://base.org/" },
        { name: "Trust Wallet", icon: "assets/icons/wallets/trust.png", link: "https://trustwallet.com/" },
        { name: "Ledger", icon: "assets/icons/wallets/ledger.png", link: "https://www.ledger.com/" },
        { name: "Rabby Wallet", icon: "assets/icons/wallets/rabby.png", link: "https://rabby.io/" },
        { name: "Phantom", icon: "assets/icons/wallets/phantom.svg", link: "https://phantom.app/" },
        { name: "Gemini", icon: "assets/icons/wallets/gemini.webp", link: "https://gemini.com/" },
        { name: "Safe", icon: "assets/icons/wallets/safe.png", link: "https://safe.global/" },
        { name: "Ambire Wallet", icon: "assets/icons/wallets/ambire.png", link: "https://ambire.com/" },
        { name: "Trezor", icon: "assets/icons/wallets/trezor.png", link: "https://trezor.io/" },
        { name: "OKX Wallet", icon: "assets/icons/wallets/okx.png", link: "https://www.okx.com/" },
        { name: "Exodus", icon: "assets/icons/wallets/exodus.png", link: "https://www.exodus.com/" },
        { name: "AlphaWallet", icon: "assets/icons/wallets/alpha.png", link: "https://alphawallet.com/" },
        { name: "Zerion", icon: "assets/icons/wallets/zerion.png", link: "https://zerion.io/" },
      ],
    },
  },
  {
    icon: "sign.svg",
    title: "2. Sign a message",
    description: "Following EIP-4361 standard",
    mockup: {
      message: "Hello from SIWE!",
      url: "https://siwe.com",
      network: "Ethereum",
      account: "vitalik.eth",
      chainId: "1",
    },
  },
  {
    icon: "authentication.svg",
    title: "3. You're authenticated",
    description: "Your onchain ENS profile and EFP connections follow you.",
    mockup: {
      message: "Hello from SIWE!",
      url: "https://siwe.com",
      network: "Ethereum",
      account: "vitalik.eth",
      chainId: "1",
    },
  },
];

export default function HowItWorks() {
  const accountName = "cottons.eth";
  const { data: account, isLoading: accountIsLoading } = useQuery({
    queryKey: ["user", accountName],
    queryFn: () => {
      return fetchAccount(accountName);
    },
  });

  return (
    <section className="py-12 sm:py-24">
      <div className="max-w-6xl mx-auto flex items-center flex-col gap-6 sm:gap-10 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-5xl font-bold text-white">How it works</h2>
        <div className="flex flex-row gap-10 max-w-[1040px] flex-wrap justify-center">
          {steps.map((step, index) => (
            <div
              key={index}
              className="w-80 bg-background shadow-accent rounded-lg p-6 h-[350px] flex flex-col gap-4"
            >
              <div className="flex flex-row gap-4 items-start h-[60px]">
                <div className="pt-1">
                  <Image
                    src={`/assets/icons/${step.icon}`}
                    alt={step.title}
                    width={24}
                    height={24}
                    className="min-w-12 h-auto"
                  />
                </div>
                <div className={`flex flex-col h-full items-start ${index === 2 ? 'gap-0.5' : 'gap-1'}`}>
                  <p className="text-lg font-bold text-white">{step.title}</p>
                  <p className="text-gray-400 text-sm leading-[18px] text-left">
                    {step.description}
                  </p>
                </div>
              </div>
              {index === 0 && (
                // Wallet selection mockup
                <div>
                  <div className="bg-[#333333] rounded-md p-4 max-h-[232px] overflow-hidden">
                    <div className="animate-infinite-scroll pause-animation-on-hover flex flex-col gap-3">
                      {/* Original list */}
                      <div className="space-y-6">
                        {step.mockup.wallets?.map((wallet, i) => (
                          <a
                            href={wallet.link}
                            target="_blank"
                            key={`original-${i}`}
                            className="flex items-center transition-colors gap-4 cursor-pointer hover:opacity-80"
                          >
                            <Image
                              src={wallet.icon}
                              alt={wallet.name}
                              width={30}
                              height={30}
                              className="rounded-sm"
                            />
                            <span className="text-white text-lg font-semibold">
                              {wallet.name}
                            </span>
                          </a>
                        ))}
                      </div>
                      {/* Duplicate list for seamless loop */}
                      <div className="space-y-6 mt-3">
                        {step.mockup.wallets?.map((wallet, i) => (
                          <a
                            href={wallet.link}
                            target="_blank"
                            key={`duplicate-${i}`}
                            className="flex items-center transition-colors gap-4 cursor-pointer hover:opacity-80"
                          >
                            <Image
                              src={wallet.icon}
                              alt={wallet.name}
                              width={30}
                              height={30}
                              className="rounded-sm"
                            />
                            <span className="text-white text-lg font-semibold">
                              {wallet.name}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {index === 1 && (
                // Message signing mockup
                <div className="siwe-container bg-[#333333] w-full flex flex-col items-center gap-4 p-4 rounded-sm text-sm">
                  <div className="flex items-center justify-between w-full">
                    <p className="font-bold">Message</p>
                    <p className="text-right">Hello from SIWE!</p>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <p className="font-bold">URL</p>
                    <p>https://siwe.com</p>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <p className="font-bold">Network</p>
                    <p>Ethereum</p>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <p className="font-bold">Account</p>
                    <p>vitalik.eth</p>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <p className="font-bold">Chain ID</p>
                    <p>1</p>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <p className="font-bold">Nonce</p>
                    <p>10c534ea1f3b5</p>
                  </div>
                  {/* <button className="text-[#111111] bg-primary active:scale-95 hover:bg-primaryHover transition-all rounded-sm h-[54px] font-bold text-lg w-44">
                    Sign Message
                  </button> */}
                </div>
              )}
              {index === 2 && (
                <div className="flex flex-col bg-[#333] rounded-md relative p-4 overflow-hidden h-[232px] items-start pt-8 gap-2">
                  <HeaderImage
                    // @ts-expect-error Missing types in EIK
                    key={account?.ens?.records?.header}
                    // @ts-expect-error Missing types in EIK
                    src={account?.ens?.records?.header}
                    isLoading={accountIsLoading}
                    style={{ height: "80px" }}
                  />
                  <div className="flex flex-row gap-2 relative z-10">
                    <Avatar
                      name={accountName}
                      fallback="https://efp.app/assets/art/default-avatar.svg"
                      style={{ width: "70px", height: "70px" }}
                    />
                  </div>
                  <div className="flex flex-col gap-2 items-start relative z-10">
                    <p className="text-white text-lg font-bold">
                      {accountName}
                    </p>
                    <ProfileStats
                      addressOrName={accountName}
                      containerDirection="row"
                      statsDirection="row"
                      gap="12px"
                      fontSize="md"
                    />
                    <p className="text-sm line-clamp-2 overflow-ellipsis">
                      {/* @ts-expect-error Missing types in EIK */}
                      {account?.ens.records?.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="w-80 bg-background shadow-accent rounded-lg p-6 h-fit items-center flex flex-col gap-4">
            <div className="flex flex-row items-center gap-3">
              <Image
                src="/assets/icons/open-standard.svg"
                alt="Open Standard"
                width={20}
                height={20}
                className="w-8 h-auto"
              />
              <p className="text-white font-bold text-2xl">Open standard</p>
            </div>
            <p className="text-center text-sm"><b>SIWE</b> is defined by the open community standard <b>EIP 4361</b>.</p>
            <a href="https://eips.ethereum.org/EIPS/eip-4361" target="_blank" className="w-full block">
              <button className="cursor-pointer bg-accent active:scale-95 text-background hover:opacity-90 transition-all rounded-sm py-2 font-bold w-full">
                Read the spec
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

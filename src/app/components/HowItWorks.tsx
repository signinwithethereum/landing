import {
  Avatar,
  fetchAccount,
  HeaderImage,
  ProfileStats,
} from "ethereum-identity-kit";
import Image from "next/image";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";

const steps = [
  {
    icon: "wallet.svg",
    title: "Connect your wallet",
    description: "You can use any wallet provider",
    mockup: {
      wallets: [
        { name: "MetaMask", icon: "assets/icons/wallets/metamask.svg" },
        {
          name: "WalletConnect",
          icon: "assets/icons/wallets/walletconnect.png",
        },
        { name: "Rainbow Wallet", icon: "assets/icons/wallets/rainbow.png" },
        { name: "Base App", icon: "assets/icons/wallets/baseapp.jpg" },
        { name: "Trust Wallet", icon: "assets/icons/wallets/trust.png" },
        { name: "Ledger", icon: "assets/icons/wallets/ledger.png" },
        { name: "Rabby Wallet", icon: "assets/icons/wallets/rabby.png" },
        { name: "Phantom", icon: "assets/icons/wallets/phantom.svg" },
        { name: "Safe", icon: "assets/icons/wallets/safe.png" },
        { name: "Ambire Wallet", icon: "assets/icons/wallets/ambire.png" },
        { name: "Trezor", icon: "assets/icons/wallets/trezor.png" },
        { name: "OKX Wallet", icon: "assets/icons/wallets/okx.png" },
        { name: "Exodus", icon: "assets/icons/wallets/exodus.png" },
        { name: "AlphaWallet", icon: "assets/icons/wallets/alpha.png" },
        { name: "Zerion", icon: "assets/icons/wallets/zerion.png" },
      ],
    },
  },
  {
    icon: "sign.svg",
    title: "Sign a message",
    description: "Sign a short message",
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
    title: "You're authenticated",
    description: "Your connections follow you.",
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
  const { address } = useAccount();
  const { data: account, isLoading: accountIsLoading } = useQuery({
    queryKey: ["user", address],
    queryFn: () => {
      return fetchAccount(address || "vitalik.eth");
    },
  });

  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto flex items-center flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <h2 className="text-5xl font-bold text-white">How it works</h2>
        </div>
        <div className="flex flex-row gap-10 max-w-[1040px] flex-wrap justify-center">
          {steps.map((step, index) => (
            <div
              key={index}
              className="w-80 bg-background shadow-accent rounded-lg p-6 h-[350px] flex flex-col gap-4"
            >
              <div className="flex flex-row gap-4 items-start">
                <div className="pt-1">
                  <Image
                    src={`/assets/icons/${step.icon}`}
                    alt={step.title}
                    width={24}
                    height={24}
                    className="w-12 h-auto"
                  />
                </div>
                <div className="flex flex-col items-start gap-1">
                  <p className="text-xl font-bold text-white">{step.title}</p>
                  <p className="text-gray-400 text-sm text-left">
                    {step.description}
                  </p>
                </div>
              </div>
              {index === 0 && (
                // Wallet selection mockup
                <div>
                  <div className="bg-[#333333] rounded-md p-4 max-h-[232px] overflow-hidden">
                    <div className="animate-infinite-scroll flex flex-col gap-3">
                      {/* Original list */}
                      <div className="space-y-6">
                        {step.mockup.wallets?.map((wallet, i) => (
                          <div
                            key={`original-${i}`}
                            className="flex items-center transition-colors gap-4"
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
                          </div>
                        ))}
                      </div>
                      {/* Duplicate list for seamless loop */}
                      <div className="space-y-6 mt-3">
                        {step.mockup.wallets?.map((wallet, i) => (
                          <div
                            key={`duplicate-${i}`}
                            className="flex items-center transition-colors gap-4"
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
                          </div>
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
                    isLoaded={accountIsLoading}
                    style={{ height: "80px" }}
                  />
                  <div className="flex flex-row gap-2 relative z-10">
                    <Avatar
                      address={address}
                      name={account?.ens?.name || "vitalik.eth"}
                      fallback="https://efp.app/assets/art/default-avatar.svg"
                      style={{ width: "70px", height: "70px" }}
                    />
                  </div>
                  <div className="flex flex-col gap-2 items-start relative z-10">
                    <p className="text-white text-lg font-bold">
                      {account?.ens?.name || "vitalik.eth"}
                    </p>
                    <ProfileStats
                      addressOrName={address || "vitalik.eth"}
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
          <div className="w-80 bg-background shadow-accent rounded-lg p-6 items-center flex flex-col gap-4">
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
            <button className="cursor-pointer bg-accent active:scale-95 hover:opacity-90 transition-all rounded-sm py-2 font-bold w-full">
              Read the spec
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

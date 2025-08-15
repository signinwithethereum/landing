"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useAccount, useDisconnect } from "wagmi";
import {
  Avatar,
  fetchAccount,
  LoadingCell,
  SignInWithEthereum,
} from "ethereum-identity-kit";
import { useState } from "react";
import { generateClientSideNonce } from "@/lib/utils";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";


export default function Hero() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const { data, isLoading } = useQuery({
    queryKey: ["user", address],
    queryFn: () => {
      if (!address) return null;
      return fetchAccount(address);
    },
    enabled: !!address,
  });

  return (
    <section className="py-12 sm:py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto flex flex-col gap-3">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Sign in with Ethereum
          </h1>
          <p className="text-xl sm:text-2xl text-gray-400 mb-6 leading-relaxed">
            Open standard for authentication with Ethereum accounts.
          </p>

          {/* CTA Buttons */}
          {isSignedIn ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => {
                  openAccountModal?.();
                }}
                className="inline-flex relative items-center px-6 py-3 bg-background text-white font-medium rounded-lg transition-colors border border-gray-50"
              >
                {isLoading ? (
                  <LoadingCell />
                ) : (
                  <div className="flex items-center gap-2">
                    {/* @ts-expect-error the records do exist */}
                    {data?.ens.records?.header && (
                      <Image
                        // @ts-expect-error the records do exist
                        src={data?.ens.records?.header}
                        alt="Ethereum"
                        width={12}
                        height={12}
                        className="mr-2 opacity-20 h-full w-full absolute top-0 left-0 object-cover"
                      />
                    )}
                    <div className="flex items-center gap-2 relative z-10">
                      <Avatar
                        address={address}
                        name={data?.ens.name}
                        src={data?.ens.avatar}
                        fallback="https://efp.app/assets/art/default-avatar.svg"
                        style={{ width: 24, height: 24 }}
                      />
                      <p className="text-white font-semibold">
                        {data?.ens.name || address}
                      </p>
                    </div>
                  </div>
                )}
              </button>
              <button
                onClick={() => {
                  disconnect();
                  setIsSignedIn(false);
                }}
                className="inline-flex cursor-pointer transition-all items-center active:scale-95 px-6 py-3 font-semibold border border-accent hover:bg-accent/90 rounded-lg"
              >
                <Image
                  src="/assets/ethereum-icon.svg"
                  alt="Ethereum"
                  width={12}
                  height={12}
                  className="mr-2"
                />
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 mx-auto w-fit relative justify-center items-center">
              <SignInWithEthereum
                darkMode={true}
                getNonce={() => generateClientSideNonce()}
                verifySignature={(message, nonce, signature) => {
                  console.log(message, nonce, signature);
                }}
                onSignInSuccess={() => {
                  setIsSignedIn(true);
                  console.log("signed in");
                }}
                onSignInError={() => {
                  console.log("signed in error");
                }}
                message="Sign in with Ethereum"
                onDisconnectedClick={() => {
                  openConnectModal?.();
                }}
                autoSignInAfterConnection={true}
              />
              <div className="hidden sm:flex flex-col gap-2 absolute -top-4 -left-[99px]">
                <svg
                  width="100"
                  height="60"
                  viewBox="0 0 88 33"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="animate-draw-path"
                >
                  <path
                    d="M87 27.3267C81.6507 19.362 66.179 5.23587 47.0862 12.4492C34.3301 17.2685 37.622 27.3268 42.1483 31.3843C47.0862 33.6393 
     53.6698 29.5806 52.8468 21.4668C50.792 1.20821 18.1451 0.42695 1 1.17834"
                    stroke="#EEEEEE"
                  />
                </svg>
                <p className="font-bold text-white -translate-y-[54px] rotate-[-10deg] -translate-x-24 animate-scale-pop">
                  Try it out
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

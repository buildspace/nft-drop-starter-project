import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";

import twitterLogo from "./../public/twitter-logo.svg"

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;



// This is to disable SSR when using WalletMultiButton
const WalletMultiButtonDynamic = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

// Constants
const Home = () => {
    const wallet = useWallet();
    // Actions
    const renderNotConnectedContainer = () => (
        <div>
            <Image src={twitterLogo} alt="emoji" />

            <div className="button-container">
                <WalletMultiButtonDynamic className="cta-button connect-wallet-button" />
            </div>
        </div>
    );

    return (
        <div className="App">
            <div className="container">
                <div className="header-container">
                    <p className="header">🍭 Candy Drop</p>
                    <p className="sub-text">NFT drop machine with fair mint</p>
                    {/* Render your connect to wallet button right here */}
                    {renderNotConnectedContainer()}
                    {/* {wallet.publicKey ? "Hello World" : renderNotConnectedContainer()} */}
                </div>

                <div className="footer-container">
                    <Image alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
                    <a className="footer-text" href={TWITTER_LINK} target="_blank" rel="noreferrer">{`built on @${TWITTER_HANDLE}`}</a>
                </div>
            </div>
        </div>
    );
};

export default Home;
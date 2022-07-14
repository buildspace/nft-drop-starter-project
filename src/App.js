import React, { useEffect, useState } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = '__iandc';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

  const [walletAddress, setWalletAddress] = useState(null)

  // Check window object in DOM: has Phantom Wallet Ext. injected 
  // solana object?
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana && solana.isPhantom) {
        console.log('Phantom Wallet found!')
        // connect() method tells Phantom Wallet that website is authorized to access
        // information about the wallet
        // onlyIfTrusted property pulls the data without prompting them with another 
        // connect popup in case wallet is already connected
        const response = await solana.connect({ onlyIfTrusted: true })
        console.log('Connected with Public Key:', response.publicKey.toString())
        // Set the user's public key in state
        setWalletAddress(response.publicKey.toString())
      } else {
        alert('Solana object not found --> Get a Phantom Wallet!')
      }
    } catch (error) {
      console.error(error);
    }
  }

  const connectWallet = async () => {}

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
      >
        Connect Wallet
      </button>
  )

  // When component first mounts, check if Phantom Wallet is connected
  useEffect( () => {
    const onLoad = async () => {
      await checkIfWalletIsConnected()
    }
    // Listen for event: window object load --> call onLoad
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad)
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🍭 Candy Drop</p>
          <p className="sub-text">NFT drop machine with fair mint</p>
          {/* call render method only is there is no user wallet stored in State */}
          {!walletAddress && renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;

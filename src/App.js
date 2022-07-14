import React, { useEffect } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

  // Check window object in DOM: has Phantom Wallet Ext. injected 
  // solana object?
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana && solana.isPhantom) {
        console.log('Phantom Wallet found!')
      } else {
        alert('Solana object not found --> Get a Phantom Wallet!')
      }
    } catch (error) {
      console.error(error);
    }
  }

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
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;

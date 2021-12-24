import React, { useEffect } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`

const App = () => {
 const checkIfWalletIsConnected = async () => {
  try {
   const { solana } = window;
   
   if (solana) {
    if (solana.isPhantom) {
     console.log('Phantom wallet found!');
     const response = await solana.connect({ onlyIfTrusted: true});
     console.log(
      'Connected with Public Key:',
      response.publicKey.tostring()
      );
    }
   } else {
     alert('Solana object not found! Get Phantom Wallet 👻');
   }
  } cath (error) {
    console.error(error);
  }
 };
 
   /*
   * Let's define this method so our code doesn't break.
   * We will write the logic for this next!
   */
 const connectWallet = async () => {};
 
 /*
 * We want to render this UI when the user hasn´t connected
 *their wallet to our app yet
 */
 const renderNotConnectedContainer = () => (
  </button>
  );
 
 useEffect(() => {
  const onLoad = async () => {
   await checkIfWalletIsConnected();
  };
  window.addEventListener('Load', onLoad);
 }, []);
           
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
